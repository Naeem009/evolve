"use client";

import Image from "next/image";
import Link from "next/link";
import { removeLine, updateQty } from "@/app/actions";
import { formatPKR } from "@/lib/format";
import { site } from "@/lib/site";
import { useShop } from "./providers";
import { btn, btnGhost } from "./styles";

export function CartView() {
  const { cart, setCart } = useShop();
  if (!cart) return <p className="px-4 py-16 text-sm text-stone-deep">Loading your bag…</p>;
  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-serif text-5xl">Your bag is empty.</h1>
        <Link href="/collections/new-arrivals" className={`${btn} mt-6`}>
          Shop new arrivals
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 md:px-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div>
        <h1 className="font-serif text-5xl">Your bag</h1>
        <ul className="mt-8 divide-y divide-sand">
          {cart.lines.map((line) => (
            <li key={line.variantId} className="grid grid-cols-[96px_1fr] gap-4 py-5">
              <Link href={`/products/${line.productHandle}`} className="relative aspect-[4/5] bg-sand">
                <Image src={line.image} alt="" fill className="object-cover" sizes="96px" />
              </Link>
              <div>
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/products/${line.productHandle}`}>{line.productTitle}</Link>
                    <p className="text-sm text-stone-deep">
                      {line.color} · {line.size}
                    </p>
                  </div>
                  <p>{formatPKR(line.lineTotal)}</p>
                </div>
                <div className="mt-3 flex gap-3">
                  <select
                    className="min-h-11 border border-sand bg-bone px-2"
                    value={line.qty}
                    aria-label={`Quantity for ${line.productTitle}`}
                    onChange={async (event) => setCart(await updateQty(line.variantId, Number(event.target.value)))}
                  >
                    {Array.from({ length: Math.min(5, line.stock) }, (_, index) => index + 1).map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="min-h-11 text-[12px] uppercase tracking-[0.14em]" onClick={async () => setCart(await removeLine(line.variantId))}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit border border-sand p-5">
        <p className="text-sm text-stone-deep">
          {cart.freeShippingRemaining > 0
            ? `${formatPKR(cart.freeShippingRemaining)} away from free delivery`
            : "Standard delivery is free on this bag."}
        </p>
        <div className="mt-3 flex justify-between">
          <span>Subtotal</span>
          <span>{formatPKR(Math.max(0, cart.subtotal - cart.discount))}</span>
        </div>
        <p className="mt-2 text-[12px] text-stone-deep">Shipping is calculated from your city. Free standard delivery starts at {formatPKR(site.freeShippingThreshold)}.</p>
        <Link href="/checkout" className={`${btn} mt-5 w-full`}>
          Checkout
        </Link>
        <Link href="/collections/new-arrivals" className={`${btnGhost} mt-2 w-full`}>
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
