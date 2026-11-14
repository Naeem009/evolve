"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { applyPromo, removeLine, updateQty } from "@/app/actions";
import { products } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { site } from "@/lib/site";
import { btn, btnGhost, field } from "./styles";
import { useShop } from "./providers";

export function CartDrawer() {
  const { cart, drawerOpen, setDrawerOpen, setCart } = useShop();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [promo, setPromo] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  const lines = cart?.lines ?? [];
  const progress = cart ? Math.min(100, ((site.freeShippingThreshold - cart.freeShippingRemaining) / site.freeShippingThreshold) * 100) : 0;
  const inBag = new Set(lines.map((line) => line.productHandle));
  const suggestion = products.find((product) => !inBag.has(product.handle) && product.badges.includes("bestseller"));

  async function onPromo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const next = await applyPromo(promo);
    setCart(next);
    setPending(false);
  }

  return (
    <div className="no-print fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close bag" onClick={() => setDrawerOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-bone"
      >
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 id="bag-title" className="font-serif text-3xl">
            Your bag
          </h2>
          <button ref={closeRef} type="button" className="inline-flex h-11 w-11 items-center justify-center" aria-label="Close bag" onClick={() => setDrawerOpen(false)}>
            <X strokeWidth={1.25} />
          </button>
        </div>
        <div className="border-b border-sand px-5 py-4">
          <p className="text-sm text-stone-deep">
            {cart && cart.freeShippingRemaining > 0
              ? `${formatPKR(cart.freeShippingRemaining)} away from free delivery`
              : "You have free standard delivery"}
          </p>
          <div className="mt-2 h-px bg-sand">
            <div className="h-px bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-3xl">The bag is empty.</p>
              <Link href="/collections/new-arrivals" className={`${btn} mt-6`} onClick={() => setDrawerOpen(false)}>
                Shop new arrivals
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {lines.map((line) => (
                <li key={line.variantId} className="grid grid-cols-[88px_1fr] gap-3">
                  <Link href={`/products/${line.productHandle}`} className="relative aspect-[4/5] bg-sand" onClick={() => setDrawerOpen(false)}>
                    <Image src={line.image} alt="" fill className="object-cover" sizes="88px" />
                  </Link>
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/products/${line.productHandle}`} className="text-sm" onClick={() => setDrawerOpen(false)}>
                          {line.productTitle}
                        </Link>
                        <p className="text-[13px] text-stone-deep">
                          {line.color} · {line.size}
                        </p>
                      </div>
                      <p className="text-sm">{formatPKR(line.lineTotal)}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <label className="sr-only" htmlFor={`qty-${line.variantId}`}>
                        Quantity
                      </label>
                      <select
                        id={`qty-${line.variantId}`}
                        className="min-h-11 border border-sand bg-bone px-2 text-sm"
                        value={line.qty}
                        onChange={async (event) => setCart(await updateQty(line.variantId, Number(event.target.value)))}
                      >
                        {Array.from({ length: Math.min(5, line.stock) }, (_, index) => index + 1).map((qty) => (
                          <option key={qty} value={qty}>
                            {qty}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="min-h-11 text-[12px] uppercase tracking-[0.14em] text-stone-deep" onClick={async () => setCart(await removeLine(line.variantId))}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {suggestion ? (
            <Link href={`/products/${suggestion.handle}`} className="mt-8 block border-t border-sand pt-4 text-sm" onClick={() => setDrawerOpen(false)}>
              <span className="text-[11px] uppercase tracking-[0.16em] text-stone-deep">You may also like</span>
              <span className="mt-1 block">{suggestion.title}</span>
            </Link>
          ) : null}
        </div>
        {lines.length > 0 && cart ? (
          <div className="border-t border-sand px-5 py-4">
            <form onSubmit={onPromo} className="mb-4 flex gap-2">
              <label className="sr-only" htmlFor="promo">
                Promo code
              </label>
              <input id="promo" value={promo} onChange={(event) => setPromo(event.target.value)} placeholder="Promo code" className={field} />
              <button className={btnGhost} type="submit" disabled={pending}>
                Apply
              </button>
            </form>
            {cart.promoError ? <p className="mb-3 text-sm text-danger">{cart.promoError}</p> : null}
            {cart.promoCode ? <p className="mb-3 text-sm text-success">{cart.promoCode} applied</p> : null}
            <div className="mb-1 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPKR(cart.subtotal)}</span>
            </div>
            {cart.discount > 0 ? (
              <div className="mb-1 flex justify-between text-sm">
                <span>Discount</span>
                <span>−{formatPKR(cart.discount)}</span>
              </div>
            ) : null}
            <p className="mb-4 text-[12px] text-stone-deep">Shipping and any COD fee are added at checkout. Totals are recalculated on the server.</p>
            <Link href="/checkout" className={`${btn} w-full`} onClick={() => setDrawerOpen(false)}>
              Checkout
            </Link>
            <Link href="/cart" className={`${btnGhost} mt-2 w-full`} onClick={() => setDrawerOpen(false)}>
              View bag
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
