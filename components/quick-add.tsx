"use client";

import { useState } from "react";
import { addToCart } from "@/app/actions";
import type { Product } from "@/lib/types";
import { useShop } from "./providers";

export function QuickAdd({ product }: { product: Product }) {
  const { setCart, setDrawerOpen, notify } = useShop();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const colors = [...new Map(product.variants.map((variant) => [variant.color, variant.colorHex])).entries()];
  const [color, setColor] = useState(colors[0]?.[0] ?? "");
  const sizes = product.variants.filter((variant) => variant.color === color);

  async function choose(variantId: string, stock: number) {
    if (stock <= 0 || pending) return;
    setPending(true);
    const cart = await addToCart(variantId, 1);
    setCart(cart);
    setDrawerOpen(true);
    notify(`${product.title} added to your bag`);
    setPending(false);
    setOpen(false);
  }

  if (product.variants.every((variant) => variant.stock <= 0)) return null;

  return (
    <div className="absolute right-2 bottom-2 z-10">
      <button
        type="button"
        className="inline-flex min-h-11 items-center bg-bone px-3 text-[11px] uppercase tracking-[0.16em] text-ink"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Quick add"}
      </button>
      {open ? (
        <div className="absolute right-0 bottom-12 w-max max-w-[70vw] bg-bone p-2">
          {colors.length > 1 ? (
            <div className="mb-2 flex gap-2">
              {colors.map(([name, hex]) => (
                <button
                  key={name}
                  type="button"
                  aria-label={name}
                  className={`h-11 w-11 border ${color === name ? "border-ink" : "border-sand"}`}
                  onClick={() => setColor(name)}
                >
                  <span className="mx-auto block h-4 w-4" style={{ background: hex }} />
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {sizes.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={variant.stock <= 0 || pending}
                className="min-h-11 min-w-11 border border-sand px-2 text-[12px] disabled:text-stone"
                onClick={() => choose(variant.id, variant.stock)}
              >
                {variant.size}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
