import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { findVariant, products } from "./catalog";
import { codFeeFor, discountFor, orderTotal, shippingQuote } from "./commerce";
import { site } from "./site";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
  PricedCart,
  PricedLine,
  RawCart,
  Review,
  Session,
} from "./types";

const dataDir = path.join(process.cwd(), "data");
const ordersFile = path.join(dataDir, "orders.json");
const reviewsFile = path.join(dataDir, "reviews.json");
const messagesFile = path.join(dataDir, "messages.json");
const subscribersFile = path.join(dataDir, "subscribers.json");

const CART = "evolve_cart";
const WISH = "evolve_wishlist";
const SESSION = "evolve_session";
const ADMIN = "evolve_admin";
const PAY = "evolve_pay";

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

function secret(): string {
  return process.env.COOKIE_SECRET || "dev-only-secret-change-me";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function readOrders(): Promise<Order[]> {
  return readJson<Order[]>(ordersFile, []);
}

async function saveOrders(orders: Order[]): Promise<void> {
  await writeJson(ordersFile, orders);
}

export async function readExtraReviews(): Promise<Review[]> {
  return readJson<Review[]>(reviewsFile, []);
}

function committedQty(orders: Order[], variantId: string): number {
  return orders
    .filter((order) => !["cancelled", "refunded", "rto"].includes(order.status))
    .reduce(
      (sum, order) =>
        sum +
        order.lines
          .filter((line) => line.variantId === variantId)
          .reduce((lineSum, line) => lineSum + line.qty, 0),
      0,
    );
}

export async function availabilityFor(variantIds: string[]): Promise<Record<string, number>> {
  const orders = await readOrders();
  const map: Record<string, number> = {};
  for (const id of variantIds) {
    const found = findVariant(id);
    const base = found?.variant.stock ?? 0;
    map[id] = Math.max(0, base - committedQty(orders, id));
  }
  return map;
}

async function readRawCart(): Promise<RawCart> {
  const jar = await cookies();
  const raw = jar.get(CART)?.value;
  if (!raw) return { lines: [] };
  try {
    const parsed = JSON.parse(raw) as RawCart;
    if (!Array.isArray(parsed.lines)) return { lines: [] };
    return {
      lines: parsed.lines.filter((line) => line.variantId && line.qty > 0),
      promoCode: parsed.promoCode,
    };
  } catch {
    return { lines: [] };
  }
}

async function writeRawCart(cart: RawCart): Promise<void> {
  const jar = await cookies();
  jar.set(CART, JSON.stringify(cart), { ...cookieBase, maxAge: 60 * 60 * 24 * 30 });
}

export async function getCart(): Promise<PricedCart> {
  const raw = await readRawCart();
  const orders = await readOrders();
  return priceRaw(raw, orders);
}

function priceRaw(raw: RawCart, orders: Order[]): PricedCart {
  const lines: PricedLine[] = [];
  for (const line of raw.lines) {
    const found = findVariant(line.variantId);
    if (!found) continue;
    const stock = Math.max(0, found.variant.stock - committedQty(orders, line.variantId));
    const qty = Math.max(1, Math.min(line.qty, Math.max(stock, 1)));
    if (stock <= 0) continue;
    lines.push({
      variantId: found.variant.id,
      sku: found.variant.sku,
      productHandle: found.product.handle,
      productTitle: found.product.title,
      size: found.variant.size,
      color: found.variant.color,
      colorHex: found.variant.colorHex,
      image: found.product.images[0]?.src ?? "",
      unitPrice: found.product.price,
      qty: Math.min(qty, stock),
      lineTotal: found.product.price * Math.min(qty, stock),
      stock,
    });
  }
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const promo = discountFor(subtotal, raw.promoCode);
  const merchandise = Math.max(0, subtotal - promo.discount);
  return {
    lines,
    subtotal,
    discount: promo.discount,
    promoCode: promo.applied,
    promoError: promo.error,
    count: lines.reduce((sum, line) => sum + line.qty, 0),
    freeShippingRemaining: Math.max(0, site.freeShippingThreshold - merchandise),
  };
}

export async function mutateCart(updater: (cart: RawCart) => RawCart): Promise<PricedCart> {
  const current = await readRawCart();
  const next = updater(current);
  const orders = await readOrders();
  const priced = priceRaw(next, orders);
  await writeRawCart({
    lines: priced.lines.map((line) => ({ variantId: line.variantId, qty: line.qty })),
    promoCode: priced.promoCode,
  });
  return priced;
}

export async function commitOrder(
  order: Order,
): Promise<{ ok: true; order: Order } | { ok: false; message: string }> {
  return enqueue(async () => {
    const orders = await readOrders();
    const existing = orders.find((item) => item.idempotencyKey === order.idempotencyKey);
    if (existing) return { ok: true as const, order: existing };
    for (const line of order.lines) {
      const found = findVariant(line.variantId);
      const stock = Math.max(0, (found?.variant.stock ?? 0) - committedQty(orders, line.variantId));
      if (line.qty > stock) {
        return {
          ok: false as const,
          message: `${line.productTitle} (${line.size} / ${line.color}) is no longer available in that quantity.`,
        };
      }
    }
    orders.unshift(order);
    await saveOrders(orders);
    return { ok: true as const, order };
  });
}

export async function clearCart(): Promise<void> {
  const jar = await cookies();
  jar.set(CART, "", { ...cookieBase, maxAge: 0 });
}

export async function getWishlist(): Promise<string[]> {
  const jar = await cookies();
  const raw = jar.get(WISH)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return parsed.filter((handle) => products.some((product) => product.handle === handle));
  } catch {
    return [];
  }
}

export async function toggleWishlist(handle: string): Promise<string[]> {
  const current = await getWishlist();
  const next = current.includes(handle)
    ? current.filter((item) => item !== handle)
    : [handle, ...current].slice(0, 40);
  const jar = await cookies();
  jar.set(WISH, JSON.stringify(next), { ...cookieBase, maxAge: 60 * 60 * 24 * 180 });
  return next;
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.phone || !parsed.name) return null;
    return { ...parsed, addresses: parsed.addresses ?? [] };
  } catch {
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION, JSON.stringify(session), { ...cookieBase, maxAge: 60 * 60 * 24 * 90 });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION, "", { ...cookieBase, maxAge: 0 });
}

export async function saveOrder(order: Order): Promise<void> {
  await enqueue(async () => {
    const orders = await readOrders();
    orders.unshift(order);
    await saveOrders(orders);
  });
}

export async function findOrder(id: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((order) => order.id.toLowerCase() === id.toLowerCase());
}

export async function findOrderByKey(key: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((order) => order.idempotencyKey === key);
}

export async function updateOrder(
  id: string,
  updater: (order: Order) => Order,
): Promise<Order | undefined> {
  return enqueue(async () => {
    const orders = await readOrders();
    const index = orders.findIndex((order) => order.id === id);
    if (index < 0) return undefined;
    const current = orders[index];
    if (!current) return undefined;
    const next = updater(current);
    orders[index] = next;
    await saveOrders(orders);
    return next;
  });
}

export function buildTotals(
  cart: PricedCart,
  city: string,
  method: "standard" | "express",
  payment: "cod" | "card" | "bank",
): { shipping: number; codFee: number; total: number; eta: string; error?: string } {
  const merchandise = Math.max(0, cart.subtotal - cart.discount);
  const quote = shippingQuote({ merchandise, city, method });
  if (quote.error && quote.error !== "city") {
    return { shipping: 0, codFee: 0, total: merchandise, eta: "", error: quote.error };
  }
  const codFee = codFeeFor(merchandise, payment);
  const shipping = quote.shipping;
  return {
    shipping,
    codFee,
    total: orderTotal({ subtotal: cart.subtotal, discount: cart.discount, shipping, codFee }),
    eta: quote.eta,
  };
}

export async function addReview(review: Review): Promise<void> {
  await enqueue(async () => {
    const reviews = await readExtraReviews();
    reviews.unshift(review);
    await writeJson(reviewsFile, reviews);
  });
}

export async function publishedReviews(handle: string): Promise<Review[]> {
  const extra = await readExtraReviews();
  const seeded = products.find((product) => product.handle === handle)?.reviews ?? [];
  return [...seeded, ...extra.filter((review) => review.productHandle === handle && review.status === "published")];
}

export async function pendingReviews(): Promise<Review[]> {
  const extra = await readExtraReviews();
  return extra.filter((review) => review.status === "pending");
}

export async function setReviewStatus(id: string, status: Review["status"]): Promise<void> {
  await enqueue(async () => {
    const reviews = await readExtraReviews();
    const next = reviews.map((review) => (review.id === id ? { ...review, status } : review));
    await writeJson(reviewsFile, next);
  });
}

export async function saveMessage(message: { name: string; phone: string; body: string }): Promise<void> {
  await enqueue(async () => {
    const messages = await readJson<{ name: string; phone: string; body: string; createdAt: string }[]>(
      messagesFile,
      [],
    );
    messages.unshift({ ...message, createdAt: new Date().toISOString() });
    await writeJson(messagesFile, messages);
  });
}

export async function saveSubscriber(entry: { email?: string; phone?: string }): Promise<void> {
  await enqueue(async () => {
    const list = await readJson<{ email?: string; phone?: string; createdAt: string }[]>(subscribersFile, []);
    list.unshift({ ...entry, createdAt: new Date().toISOString() });
    await writeJson(subscribersFile, list);
  });
}

export function newOrderId(): string {
  const n = randomBytes(3).toString("hex").toUpperCase();
  return `EVL-${n}`;
}

export function newPayToken(): string {
  return randomBytes(16).toString("hex");
}

export async function rememberPayToken(orderId: string, token: string): Promise<void> {
  const jar = await cookies();
  jar.set(PAY, `${orderId}.${token}`, { ...cookieBase, maxAge: 60 * 60 * 2 });
}

export async function payTokenMatches(orderId: string, token: string): Promise<boolean> {
  const jar = await cookies();
  const value = jar.get(PAY)?.value;
  return value === `${orderId}.${token}`;
}

export async function adminAuthed(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const jar = await cookies();
  const value = jar.get(ADMIN)?.value;
  if (!value) return false;
  return safeEqual(value, sign(`admin:${password}`));
}

export async function loginAdmin(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !safeEqual(password, expected)) return false;
  const jar = await cookies();
  jar.set(ADMIN, sign(`admin:${expected}`), { ...cookieBase, maxAge: 60 * 60 * 12 });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN, "", { ...cookieBase, maxAge: 0 });
}

const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export const statusLabels: Record<OrderStatus, string> = {
  pending_confirmation: "Pending confirmation",
  confirmed: "Confirmed",
  packed: "Packed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  returned: "Returned",
  exchange_requested: "Exchange requested",
  refunded: "Refunded",
  failed_delivery: "Failed delivery",
  rto: "Returned to origin",
};

export const paymentLabels: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
};
