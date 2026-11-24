"use server";

import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { headers } from "next/headers";
import { z } from "zod";
import { normalizePhone } from "@/lib/format";
import { findCity, provinces } from "@/lib/shipping";
import { site } from "@/lib/site";
import {
  addReview,
  adminAuthed,
  buildTotals,
  clearCart,
  clearSession,
  commitOrder,
  findOrder,
  getCart,
  getSession,
  loginAdmin,
  logoutAdmin,
  mutateCart,
  newOrderId,
  newPayToken,
  payTokenMatches,
  rateLimit,
  rememberPayToken,
  saveMessage,
  saveSession,
  saveSubscriber,
  setReviewStatus,
  toggleWishlist,
  updateOrder,
} from "@/lib/server-store";
import type { CheckoutResult, Order, OrderStatus, PaymentMethod, PaymentStatus, PricedCart, ShippingMethod } from "@/lib/types";

async function clientKey(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function addToCart(variantId: string, qty = 1): Promise<PricedCart> {
  const amount = Math.max(1, Math.min(5, qty));
  return mutateCart((cart) => {
    const lines = [...cart.lines];
    const index = lines.findIndex((line) => line.variantId === variantId);
    if (index >= 0) {
      const current = lines[index];
      if (current) lines[index] = { ...current, qty: current.qty + amount };
    } else {
      lines.push({ variantId, qty: amount });
    }
    return { ...cart, lines };
  });
}

export async function updateQty(variantId: string, qty: number): Promise<PricedCart> {
  return mutateCart((cart) => ({
    ...cart,
    lines:
      qty <= 0
        ? cart.lines.filter((line) => line.variantId !== variantId)
        : cart.lines.map((line) => (line.variantId === variantId ? { ...line, qty } : line)),
  }));
}

export async function removeLine(variantId: string): Promise<PricedCart> {
  return updateQty(variantId, 0);
}

export async function applyPromo(code: string): Promise<PricedCart> {
  return mutateCart((cart) => ({ ...cart, promoCode: code }));
}

export async function clearPromo(): Promise<PricedCart> {
  return mutateCart((cart) => ({ ...cart, promoCode: undefined }));
}

export async function moveWishlist(handle: string): Promise<string[]> {
  return toggleWishlist(handle);
}

const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "Enter your full name.").max(80),
  phone: z.string().trim().min(10, "Enter a Pakistani mobile number."),
  email: z.string().trim().max(120),
  province: z.string().min(1, "Choose a province."),
  city: z.string().min(1, "Choose a city."),
  address: z.string().trim().min(8, "Enter the full address.").max(240),
  landmark: z.string().trim().max(120),
  notes: z.string().trim().max(300),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["cod", "card", "bank"]),
  idempotencyKey: z.string().trim().min(8).max(80),
  saveAddress: z.string().optional(),
  createAccount: z.string().optional(),
});

function nextPath(order: Order): string {
  return order.paymentMethod === "card" && order.paymentStatus !== "paid"
    ? `/checkout/pay/${order.id}`
    : `/order-confirmation/${order.id}`;
}

export async function placeOrder(_prev: CheckoutResult | null, formData: FormData): Promise<CheckoutResult> {
  const key = await clientKey();
  if (!rateLimit(`checkout:${key}`, 8, 10 * 60 * 1000)) {
    return { ok: false, message: "Too many attempts. Wait a few minutes and try again." };
  }

  const parsed = checkoutSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    province: formData.get("province"),
    city: formData.get("city"),
    address: formData.get("address"),
    landmark: formData.get("landmark") ?? "",
    notes: formData.get("notes") ?? "",
    shippingMethod: formData.get("shippingMethod"),
    paymentMethod: formData.get("paymentMethod"),
    idempotencyKey: formData.get("idempotencyKey"),
    saveAddress: formData.get("saveAddress") ?? undefined,
    createAccount: formData.get("createAccount") ?? undefined,
  });

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const name = String(issue.path[0] ?? "form");
      if (!fields[name]) fields[name] = issue.message;
    }
    return { ok: false, fields };
  }

  const input = parsed.data;
  const phone = normalizePhone(input.phone);
  if (!phone) {
    return { ok: false, fields: { phone: "Use a Pakistani mobile number, for example 03XXXXXXXXX." } };
  }
  if (input.email && !z.email().safeParse(input.email).success) {
    return { ok: false, fields: { email: "Enter a valid email, or leave it blank." } };
  }

  const province = provinces.find((item) => item.name === input.province);
  const city = findCity(input.city);
  if (!province || !city || city.province !== province.name) {
    return { ok: false, fields: { city: "Choose a city in the selected province." } };
  }

  const cart = await getCart();
  if (cart.lines.length === 0) {
    return { ok: false, message: "Your bag is empty." };
  }

  const shippingMethod = input.shippingMethod as ShippingMethod;
  const paymentMethod = input.paymentMethod as PaymentMethod;
  const totals = buildTotals(cart, input.city, shippingMethod, paymentMethod);
  if (totals.error) return { ok: false, message: totals.error };
  if (paymentMethod === "cod" && totals.total > site.codMax) {
    return {
      ok: false,
      message: `Cash on Delivery is limited to PKR ${site.codMax.toLocaleString("en-PK")}. Choose a card payment or bank transfer.`,
    };
  }

  let receiptFile: string | undefined;
  const receipt = formData.get("receipt");
  if (receipt instanceof File && receipt.size > 0) {
    if (receipt.size > 2 * 1024 * 1024) {
      return { ok: false, fields: { receipt: "The receipt must be under 2 MB." } };
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(receipt.type)) {
      return { ok: false, fields: { receipt: "Upload a JPG, PNG, WEBP or PDF receipt." } };
    }
    const safeName = receipt.name.replace(/[^a-zA-Z0-9.]+/g, "-").slice(-48);
    const filename = `${input.idempotencyKey}-${safeName}`;
    const dir = path.join(process.cwd(), "data", "receipts");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), Buffer.from(await receipt.arrayBuffer()));
    receiptFile = filename;
  }

  const paymentStatus: PaymentStatus =
    paymentMethod === "card" ? "pending" : paymentMethod === "bank" ? "pending" : "unpaid";

  const order: Order = {
    id: newOrderId(),
    idempotencyKey: input.idempotencyKey,
    payToken: newPayToken(),
    createdAt: new Date().toISOString(),
    status: "pending_confirmation",
    paymentMethod,
    paymentStatus,
    shippingMethod,
    customer: {
      fullName: input.fullName,
      phone,
      email: input.email || undefined,
      province: input.province,
      city: input.city,
      address: input.address,
      landmark: input.landmark || undefined,
      notes: input.notes || undefined,
    },
    lines: cart.lines,
    totals: {
      subtotal: cart.subtotal,
      discount: cart.discount,
      shipping: totals.shipping,
      codFee: totals.codFee,
      total: totals.total,
      promoCode: cart.promoCode,
    },
    eta: totals.eta,
    codConfirmed: false,
    receiptFile,
  };

  const saved = await commitOrder(order);
  if (!saved.ok) return { ok: false, message: saved.message };

  if (saved.order.idempotencyKey === order.idempotencyKey && saved.order.id === order.id) {
    await clearCart();
    await rememberPayToken(saved.order.id, saved.order.payToken);
  }

  if (input.createAccount === "on" || input.saveAddress === "on") {
    const session = (await getSession()) ?? {
      name: input.fullName,
      phone,
      email: input.email || undefined,
      addresses: [],
    };
    const address = {
      id: randomBytes(4).toString("hex"),
      fullName: input.fullName,
      phone,
      province: input.province,
      city: input.city,
      address: input.address,
      landmark: input.landmark || undefined,
    };
    const exists = session.addresses.some((item) => item.address === address.address && item.city === address.city);
    await saveSession({
      ...session,
      name: input.fullName,
      phone,
      email: input.email || session.email,
      addresses: exists ? session.addresses : [address, ...session.addresses].slice(0, 5),
    });
  }

  return { ok: true, orderId: saved.order.id, next: nextPath(saved.order) };
}

export async function confirmSandboxPayment(orderId: string): Promise<{ ok: boolean; message?: string; next?: string }> {
  const order = await findOrder(orderId);
  if (!order || order.paymentMethod !== "card") {
    return { ok: false, message: "This order is not waiting for a card payment." };
  }
  const allowed = await payTokenMatches(order.id, order.payToken);
  if (!allowed && !(await adminAuthed())) {
    return { ok: false, message: "Open the payment step from the checkout that created this order." };
  }
  await updateOrder(order.id, (current) => ({
    ...current,
    paymentStatus: "paid",
    status: current.status === "pending_confirmation" ? "confirmed" : current.status,
  }));
  return { ok: true, next: `/order-confirmation/${order.id}` };
}

const accountSchema = z.object({
  name: z.string().trim().min(3, "Enter your name.").max(80),
  phone: z.string().trim(),
  email: z.string().trim().max(120),
});

export async function signIn(_prev: { message?: string } | null, formData: FormData): Promise<{ message?: string; ok?: boolean }> {
  const parsed = accountSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the form." };
  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return { message: "Use a Pakistani mobile number, for example 03XXXXXXXXX." };
  if (parsed.data.email && !z.email().safeParse(parsed.data.email).success) {
    return { message: "Enter a valid email, or leave it blank." };
  }
  const existing = await getSession();
  await saveSession({
    name: parsed.data.name,
    phone,
    email: parsed.data.email || undefined,
    addresses: existing?.phone === phone ? existing.addresses : [],
  });
  return { ok: true };
}

export async function signOut(): Promise<void> {
  await clearSession();
}

export async function saveAddress(_prev: { message?: string } | null, formData: FormData): Promise<{ message?: string; ok?: boolean }> {
  const session = await getSession();
  if (!session) return { message: "Sign in first." };
  const province = String(formData.get("province") ?? "");
  const city = String(formData.get("city") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const landmark = String(formData.get("landmark") ?? "").trim();
  if (address.length < 8) return { message: "Enter the full address." };
  if (!findCity(city)) return { message: "Choose a city we deliver to." };
  await saveSession({
    ...session,
    addresses: [
      {
        id: randomBytes(4).toString("hex"),
        fullName: session.name,
        phone: session.phone,
        province,
        city,
        address,
        landmark: landmark || undefined,
      },
      ...session.addresses,
    ].slice(0, 5),
  });
  return { ok: true };
}

const reviewSchema = z.object({
  handle: z.string().min(1),
  author: z.string().trim().min(2).max(40),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(12, "Write a sentence or two.").max(600),
});

export async function submitReview(_prev: { message?: string; ok?: boolean } | null, formData: FormData) {
  const key = await clientKey();
  if (!rateLimit(`review:${key}`, 5, 60 * 60 * 1000)) {
    return { message: "You have sent several reviews. Try again later." };
  }
  const parsed = reviewSchema.safeParse({
    handle: formData.get("handle"),
    author: formData.get("author"),
    rating: formData.get("rating"),
    text: formData.get("text"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the review." };
  await addReview({
    id: randomBytes(4).toString("hex"),
    productHandle: parsed.data.handle,
    author: parsed.data.author,
    rating: parsed.data.rating,
    text: parsed.data.text,
    verified: false,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  return { ok: true, message: "Thank you. Your review will appear after it is read by the studio." };
}

async function turnstilePasses(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function subscribe(_prev: { message?: string; ok?: boolean } | null, formData: FormData) {
  if (String(formData.get("company") ?? "").trim()) return { ok: true, message: "You are on the list." };
  const source = String(formData.get("source") ?? "");
  if (source === "circle" && formData.get("consent") !== "yes") {
    return { message: "Please confirm you want to hear from us." };
  }
  if (!(await turnstilePasses(String(formData.get("cf-turnstile-response") ?? "")))) {
    return { message: "Confirm you are a person and try again." };
  }
  const email = String(formData.get("email") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (!email && !phoneRaw) return { message: "Add an email or a WhatsApp number." };
  if (email && !z.email().safeParse(email).success) return { message: "Enter a valid email." };
  if (phoneRaw && !phone) return { message: "Use a Pakistani mobile number, or leave WhatsApp blank." };
  const saved = await saveSubscriber({ email: email || undefined, phone: phone || undefined });
  if (saved === "exists") return { ok: true, message: "You are already on the list." };
  return { ok: true, message: source === "circle" ? "You are on the list for early access." : "You are on the list." };
}

export async function sendMessage(_prev: { message?: string; ok?: boolean } | null, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const body = String(formData.get("body") ?? "").trim();
  if (name.length < 2 || !phone || body.length < 8) {
    return { message: "Add your name, a Pakistani mobile number, and a short message." };
  }
  await saveMessage({ name, phone, body });
  return { ok: true, message: "Received. We will reply on WhatsApp during studio hours." };
}

const returnSchema = z.object({
  orderId: z.string().min(3),
  phone: z.string(),
  type: z.enum(["exchange", "refund"]),
  reason: z.string().trim().min(3).max(80),
  notes: z.string().trim().min(8).max(500),
});

export async function requestReturn(_prev: { message?: string; ok?: boolean } | null, formData: FormData) {
  const parsed = returnSchema.safeParse({
    orderId: formData.get("orderId"),
    phone: formData.get("phone"),
    type: formData.get("type"),
    reason: formData.get("reason"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the form." };
  const phone = normalizePhone(parsed.data.phone);
  const order = await findOrder(parsed.data.orderId.trim());
  if (!order || !phone || order.customer.phone !== phone) {
    return { message: "That order number and phone do not match." };
  }
  if (order.returnRequest) return { message: "A request is already open for this order." };
  await updateOrder(order.id, (current) => ({
    ...current,
    status: parsed.data.type === "exchange" ? "exchange_requested" : current.status,
    returnRequest: {
      type: parsed.data.type,
      reason: parsed.data.reason,
      notes: parsed.data.notes,
      status: "requested",
      createdAt: new Date().toISOString(),
    },
  }));
  return { ok: true, message: "Request received. The studio will confirm the next step on WhatsApp." };
}

export async function studioLogin(_prev: { message?: string } | null, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const ok = await loginAdmin(password);
  if (!ok) return { message: "That password is not right, or ADMIN_PASSWORD is not set." };
  return {};
}

export async function studioLogout() {
  await logoutAdmin();
}

export async function studioUpdate(formData: FormData) {
  if (!(await adminAuthed())) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const paymentStatus = String(formData.get("paymentStatus") ?? "") as PaymentStatus;
  const courier = String(formData.get("courier") ?? "").trim();
  const trackingNo = String(formData.get("trackingNo") ?? "").trim();
  const internalNotes = String(formData.get("internalNotes") ?? "").trim();
  const codConfirmed = formData.get("codConfirmed") === "on";
  await updateOrder(id, (order) => ({
    ...order,
    status,
    paymentStatus,
    courier: courier || undefined,
    trackingNo: trackingNo || undefined,
    internalNotes: internalNotes || undefined,
    codConfirmed,
  }));
}

export async function moderateReview(formData: FormData) {
  if (!(await adminAuthed())) return;
  const id = String(formData.get("id") ?? "");
  const status = formData.get("decision") === "published" ? "published" : "rejected";
  await setReviewStatus(id, status);
}
