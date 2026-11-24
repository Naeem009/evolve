"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { addToCart } from "@/app/actions";
import { track } from "@/lib/analytics";
import type { CardModel } from "@/lib/home/cards";
import { useShop } from "../providers";

export function HomeQuickAdd({ product, listName }: { product: CardModel; listName: string }) {
  const { setCart, setDrawerOpen, notify } = useShop();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const titleId = useId();
  const group = product.colors.find((item) => item.name === color) ?? product.colors[0];

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!group || product.soldOut) return null;

  async function choose(variantId: string, stock: number, label: string) {
    if (stock <= 0 || pending) return;
    setPending(true);
    try {
      const cart = await addToCart(variantId, 1);
      setCart(cart);
      setDrawerOpen(true);
      notify(`${product.title} added to your bag`);
      track("add_to_cart", { item_list_name: listName, item_id: variantId, item_name: product.title, item_variant: label, value: product.price });
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  const sizes = (
    <div className="flex flex-wrap gap-2">
      {group.sizes.map((size) => (
        <button
          key={size.id}
          type="button"
          disabled={size.stock <= 0 || pending}
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-sand px-2 text-[12px] disabled:text-stone disabled:line-through"
          onClick={() => choose(size.id, size.stock, size.label)}
        >
          {size.label}
        </button>
      ))}
    </div>
  );

  const colors =
    product.colors.length > 1 ? (
      <div className="mb-3 flex flex-wrap gap-2">
        {product.colors.map((item) => (
          <button
            key={item.name}
            type="button"
            aria-label={item.name}
            aria-pressed={item.name === group.name}
            className={`inline-flex h-11 w-11 items-center justify-center border ${item.name === group.name ? "border-ink" : "border-sand"}`}
            onClick={() => setColor(item.name)}
          >
            <span className="block h-4 w-4 border border-sand" style={{ background: item.hex }} />
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <div className="mt-3 hidden md:block md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-300 md:group-hover:max-h-40 md:group-hover:opacity-100 md:group-focus-within:max-h-40 md:group-focus-within:opacity-100">
        {colors}
        {sizes}
      </div>
      <button
        type="button"
        className="mt-3 inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.16em] text-stone-deep md:hidden"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Quick add
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/40 md:hidden">
          <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[80svh] w-full overflow-y-auto bg-bone p-4 pb-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 id={titleId} className="text-[12px] uppercase tracking-[0.16em]">
                {product.title}
              </h3>
              <button type="button" className="inline-flex h-11 w-11 items-center justify-center" aria-label="Close quick add" onClick={() => setOpen(false)}>
                <X strokeWidth={1.25} />
              </button>
            </div>
            {colors}
            {sizes}
          </div>
        </div>
      ) : null}
    </>
  );
}
