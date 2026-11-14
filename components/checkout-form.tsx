"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { placeOrder } from "@/app/actions";
import { codFeeFor, orderTotal, shippingQuote } from "@/lib/commerce";
import { formatPhone, formatPKR } from "@/lib/format";
import { citiesFor, provinces } from "@/lib/shipping";
import { site } from "@/lib/site";
import type { PaymentMethod, Session, ShippingMethod } from "@/lib/types";
import { track } from "@/lib/analytics";
import { useShop } from "./providers";
import { btn, field, labelCls } from "./styles";

export function CheckoutForm({ session }: { session: Session | null }) {
  const router = useRouter();
  const { cart } = useShop();
  const address = session?.addresses[0];
  const [province, setProvince] = useState(address?.province ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [method, setMethod] = useState<ShippingMethod>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [state, action, pending] = useActionState(placeOrder, null);
  const [key] = useState(() => crypto.randomUUID());
  const sent = useRef(false);

  useEffect(() => {
    if (!state?.ok || sent.current) return;
    sent.current = true;
    router.push(state.next);
  }, [state, router]);

  if (!cart) {
    return <p className="px-4 py-16 text-sm text-stone-deep">Loading your bag…</p>;
  }
  if (cart.lines.length === 0) {
    return (
      <div className="px-4 py-16">
        <h1 className="font-serif text-5xl">Your bag is empty.</h1>
        <Link href="/collections/new-arrivals" className={`${btn} mt-6`}>
          Continue shopping
        </Link>
      </div>
    );
  }

  const merchandise = Math.max(0, cart.subtotal - cart.discount);
  const quote = city ? shippingQuote({ merchandise, city, method }) : null;
  const shipping = quote && !quote.error ? quote.shipping : 0;
  const codFee = codFeeFor(merchandise, payment);
  const total = orderTotal({ subtotal: cart.subtotal, discount: cart.discount, shipping, codFee });
  const cities = citiesFor(province);

  function onSubmit() {
    track("begin_checkout", { value: total });
  }

  return (
    <form action={action} onSubmit={onSubmit} className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1.2fr_0.8fr]">
      <input type="hidden" name="idempotencyKey" value={key} />
      <div className="space-y-4">
        <div>
          <span className="mb-3 block h-px w-8 bg-accent" />
          <h1 className="font-serif text-5xl">Checkout</h1>
          <p className="mt-2 text-sm text-stone-deep">Guest checkout. An account is optional.</p>
        </div>
        {state && !state.ok && state.message ? <p className="border border-danger px-3 py-2 text-sm text-danger">{state.message}</p> : null}

        <details open className="border border-sand p-4">
          <summary className="text-[12px] uppercase tracking-[0.16em]">1 · Contact and delivery</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="fullName" defaultValue={session?.name} error={state?.ok === false ? state.fields?.fullName : undefined} />
            <Field label="Mobile" name="phone" defaultValue={session ? formatPhone(session.phone) : ""} placeholder="03XXXXXXXXX" error={state?.ok === false ? state.fields?.phone : undefined} />
            <Field label="Email, optional" name="email" type="email" defaultValue={session?.email} error={state?.ok === false ? state.fields?.email : undefined} />
            <label className="block">
              <span className={labelCls}>Province</span>
              <select
                name="province"
                className={field}
                value={province}
                onChange={(event) => {
                  setProvince(event.target.value);
                  setCity("");
                }}
                required
              >
                <option value="">Choose</option>
                {provinces.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>City</span>
              <select name="city" className={field} value={city} onChange={(event) => setCity(event.target.value)} required>
                <option value="">Choose</option>
                {cities.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              {state?.ok === false && state.fields?.city ? <span className="mt-1 block text-sm text-danger">{state.fields.city}</span> : null}
            </label>
            <label className="block sm:col-span-2">
              <span className={labelCls}>Address</span>
              <textarea name="address" required defaultValue={address?.address} rows={3} className={`${field} py-3`} />
              {state?.ok === false && state.fields?.address ? <span className="mt-1 block text-sm text-danger">{state.fields.address}</span> : null}
            </label>
            <Field label="Landmark, optional" name="landmark" defaultValue={address?.landmark} />
            <label className="block">
              <span className={labelCls}>Order notes</span>
              <input name="notes" className={field} />
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="createAccount" />
              Remember me on this device with this phone number
            </label>
          </div>
        </details>

        <details open className="border border-sand p-4">
          <summary className="text-[12px] uppercase tracking-[0.16em]">2 · Shipping</summary>
          <div className="mt-4 space-y-3">
            <label className="flex min-h-11 items-start gap-3 border border-sand p-3">
              <input type="radio" name="shippingMethod" value="standard" checked={method === "standard"} onChange={() => setMethod("standard")} />
              <span>
                <span className="block text-sm">Standard</span>
                <span className="text-[13px] text-stone-deep">{quote && method === "standard" && !quote.error ? `${formatPKR(quote.shipping)} · ${quote.eta}` : "Calculated from your city"}</span>
              </span>
            </label>
            <label className="flex min-h-11 items-start gap-3 border border-sand p-3">
              <input type="radio" name="shippingMethod" value="express" checked={method === "express"} onChange={() => setMethod("express")} />
              <span>
                <span className="block text-sm">Express</span>
                <span className="text-[13px] text-stone-deep">Metro cities only. 1–2 days after dispatch.</span>
              </span>
            </label>
            {quote?.error && quote.error !== "city" ? <p className="text-sm text-danger">{quote.error}</p> : null}
          </div>
        </details>

        <details open className="border border-sand p-4">
          <summary className="text-[12px] uppercase tracking-[0.16em]">3 · Payment</summary>
          <div className="mt-4 space-y-3">
            {(
              [
                ["cod", "Cash on Delivery", "Pay when the parcel arrives. We may confirm by WhatsApp."],
                ["card", "Card", "A sandbox hosted page. No card number is collected here."],
                ["bank", "Bank transfer", "We show account details after you place the order."],
              ] as const
            ).map(([value, title, lede]) => (
              <label key={value} className="flex min-h-11 items-start gap-3 border border-sand p-3">
                <input type="radio" name="paymentMethod" value={value} checked={payment === value} onChange={() => setPayment(value)} />
                <span>
                  <span className="block text-sm">{title}</span>
                  <span className="text-[13px] text-stone-deep">{lede}</span>
                </span>
              </label>
            ))}
            {payment === "bank" ? (
              <label className="block">
                <span className={labelCls}>Transfer receipt, optional</span>
                <input name="receipt" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="text-sm" />
                {state?.ok === false && state.fields?.receipt ? <span className="mt-1 block text-sm text-danger">{state.fields.receipt}</span> : null}
              </label>
            ) : null}
            <p className="text-[13px] text-stone-deep">
              By placing the order you agree to the{" "}
              <Link href="/policies/shipping" className="underline">shipping</Link>,{" "}
              <Link href="/policies/returns" className="underline">return</Link> and{" "}
              <Link href="/policies/cod" className="underline">COD</Link> policies.
            </p>
          </div>
        </details>
      </div>

      <aside className="h-fit border border-sand p-5 lg:sticky lg:top-28">
        <h2 className="font-serif text-3xl">Summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {cart.lines.map((line) => (
            <li key={line.variantId} className="flex justify-between gap-3">
              <span>
                {line.productTitle} · {line.size} × {line.qty}
              </span>
              <span>{formatPKR(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-sand pt-4 text-sm">
          <Row label="Subtotal" value={formatPKR(cart.subtotal)} />
          {cart.discount > 0 ? <Row label="Discount" value={`−${formatPKR(cart.discount)}`} /> : null}
          <Row label="Shipping" value={city ? formatPKR(shipping) : "—"} />
          {payment === "cod" ? <Row label="COD fee" value={formatPKR(codFee)} /> : null}
          <div className="flex justify-between pt-2 text-base">
            <dt>Total</dt>
            <dd>{formatPKR(total)}</dd>
          </div>
        </dl>
        {quote && !quote.error ? <p className="mt-3 text-[13px] text-stone-deep">{quote.eta}. Prepared in 1–2 working days before that.</p> : null}
        <button className={`${btn} mt-5 w-full`} type="submit" disabled={pending}>
          {pending ? "Placing order" : payment === "card" ? "Continue to payment" : "Place order"}
        </button>
        <p className="mt-3 text-[12px] text-stone-deep">Promo {cart.promoCode ?? "none"}. Codes can be applied in the bag. EVOLVE10 · WELCOME500</p>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input name={name} type={type} required={name !== "email" && name !== "landmark" && name !== "notes"} defaultValue={defaultValue} placeholder={placeholder} className={field} />
      {error ? <span className="mt-1 block text-sm text-danger">{error}</span> : null}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-deep">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
