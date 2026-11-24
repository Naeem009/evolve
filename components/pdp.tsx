"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { addToCart } from "@/app/actions";
import { formatPKR, percentOff } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { adultChart, girlsChart, suggestAdultSize, suggestGirlsSize } from "@/lib/size-charts";
import type { Product } from "@/lib/types";
import { SizeTable } from "./size-table";
import { btn, btnGhost, field, labelCls } from "./styles";
import { useShop } from "./providers";
import { WishlistButton } from "./wishlist-button";

export function Gallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const image = product.images[index] ?? product.images[0];
  if (!image) return null;
  return (
    <div className="w-full">
      <div className="relative h-[78svh] w-full bg-sand lg:h-[min(88vh,960px)]">
        <Image src={image.src} alt={image.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover" />
      </div>
      {product.images.length > 1 ? (
        <div className="flex w-full gap-0 overflow-x-auto">
          {product.images.map((item, itemIndex) => (
            <button
              key={item.src}
              type="button"
              aria-label={`Show image ${itemIndex + 1}`}
              className={`relative h-28 w-24 shrink-0 border-0 sm:h-36 sm:w-28 ${itemIndex === index ? "opacity-100" : "opacity-70"}`}
              onClick={() => setIndex(itemIndex)}
            >
              <Image src={item.src} alt="" fill className="object-cover" sizes="112px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PurchasePanel({
  product,
  availability,
}: {
  product: Product;
  availability: Record<string, number>;
}) {
  const { setCart, setDrawerOpen, notify } = useShop();
  const colors = useMemo(() => {
    const map = new Map<string, string>();
    for (const variant of product.variants) map.set(variant.color, variant.colorHex);
    return [...map.entries()];
  }, [product.variants]);
  const [color, setColor] = useState(colors[0]?.[0] ?? "");
  const [size, setSize] = useState("");
  const [guide, setGuide] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const sizes = product.variants.filter((variant) => variant.color === color);
  const selected = sizes.find((variant) => variant.size === size);
  const off = percentOff(product.price, product.compareAtPrice);
  const chart = product.audience === "girls" ? "girls" : product.audience === "unisex" ? "both" : "adult";
  const ask = whatsappLink(`Hello EVOLVE, I have a question about ${product.title}: ${site.url}/products/${product.handle}`);

  async function add() {
    if (!selected) {
      setError("Choose a size.");
      return;
    }
    const stock = availability[selected.id] ?? selected.stock;
    if (stock <= 0) {
      setError("That size is sold out.");
      return;
    }
    setPending(true);
    const cart = await addToCart(selected.id, 1);
    setCart(cart);
    setDrawerOpen(true);
    notify(`${product.title} added to your bag`);
    setPending(false);
    setError("");
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium md:text-5xl">{product.title}</h1>
          <p className={`mt-3 text-lg ${off || product.badges.includes("sale") ? "text-sale" : ""}`}>
            {formatPKR(product.price)}
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <s className="ml-2 text-base text-stone-deep">{formatPKR(product.compareAtPrice)}</s>
            ) : null}
            {off ? <span className="ml-2 text-sm">{off}% off</span> : null}
          </p>
        </div>
        <WishlistButton handle={product.handle} className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-sand" />
      </div>
      <p className="mt-2 text-[12px] uppercase tracking-[0.16em] text-stone-deep">
        {product.audience === "girls" ? "Girls 10+" : product.audience} · {product.fabric}
      </p>

      <fieldset className="mt-8">
        <legend className={labelCls}>Colour</legend>
        <div className="flex gap-2">
          {colors.map(([name, hex]) => {
            const gone = product.variants.filter((variant) => variant.color === name).every((variant) => (availability[variant.id] ?? variant.stock) <= 0);
            return (
              <button
                key={name}
                type="button"
                aria-label={name}
                aria-pressed={color === name}
                disabled={gone}
                className={`inline-flex h-11 items-center gap-2 border px-3 text-sm disabled:opacity-40 ${color === name ? "border-ink" : "border-sand"}`}
                onClick={() => {
                  setColor(name);
                  setSize("");
                }}
              >
                <span className="h-3 w-3" style={{ background: hex }} />
                {name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="flex items-center justify-between">
          <span className={labelCls}>Size</span>
          <button type="button" className="min-h-11 text-[12px] uppercase tracking-[0.14em] underline" onClick={() => setGuide(true)}>
            Size guide
          </button>
        </legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((variant) => {
            const stock = availability[variant.id] ?? variant.stock;
            return (
              <button
                key={variant.id}
                type="button"
                aria-pressed={size === variant.size}
                disabled={stock <= 0}
                className={`min-h-11 min-w-14 border px-3 text-sm disabled:text-stone ${size === variant.size ? "border-ink" : "border-sand"}`}
                onClick={() => setSize(variant.size)}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
        {selected && (availability[selected.id] ?? selected.stock) <= 3 ? (
          <p className="mt-2 text-sm text-stone-deep">Only a few left in this size.</p>
        ) : null}
      </fieldset>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-6 hidden gap-3 lg:flex">
        <button type="button" className={`${btn} flex-1`} disabled={pending} onClick={add}>
          {pending ? "Adding" : "Add to bag"}
        </button>
        <a href={ask} target="_blank" rel="noreferrer" className={btnGhost}>
          Ask on WhatsApp
        </a>
      </div>
      <p className="mt-4 text-sm text-stone-deep">SKU {selected?.sku ?? product.variants[0]?.sku}. Delivery estimate appears at checkout once you choose a city.</p>

      <div className="no-print fixed inset-x-0 bottom-16 z-30 flex gap-2 border-t border-sand bg-bone p-3 lg:hidden">
        <button type="button" className={`${btn} flex-1`} disabled={pending} onClick={add}>
          {pending ? "Adding" : selected ? `Add · ${formatPKR(product.price)}` : "Select a size"}
        </button>
      </div>

      {guide ? (
        <SizeGuide chart={chart} onClose={() => setGuide(false)} />
      ) : null}
    </div>
  );
}

function SizeGuide({ chart, onClose }: { chart: "adult" | "girls" | "both"; onClose: () => void }) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [chest, setChest] = useState("");
  const [height, setHeight] = useState("");
  const suggestion =
    chart === "girls"
      ? height
        ? suggestGirlsSize(Number(height))
        : ""
      : chest
        ? suggestAdultSize(Number(chest))
        : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 md:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby="size-guide-title" className="max-h-[90svh] w-full max-w-2xl overflow-y-auto bg-bone p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="size-guide-title" className="font-serif text-4xl">
            Size guide
          </h2>
          <button type="button" className="min-h-11 px-2 text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" className={unit === "cm" ? btn : btnGhost} onClick={() => setUnit("cm")}>
            cm
          </button>
          <button type="button" className={unit === "in" ? btn : btnGhost} onClick={() => setUnit("in")}>
            inches
          </button>
        </div>
        {chart !== "girls" ? (
          <div className="mt-6">
            <h3 className="text-[12px] uppercase tracking-[0.16em]">Adults</h3>
            <SizeTable kind="adult" unit={unit} />
          </div>
        ) : null}
        {chart !== "adult" ? (
          <div className="mt-6">
            <h3 className="text-[12px] uppercase tracking-[0.16em]">Girls 10+</h3>
            <SizeTable kind="girls" unit={unit} />
          </div>
        ) : null}
        <form
          className="mt-6 grid gap-3 border-t border-sand pt-4 sm:grid-cols-2"
          onSubmit={(event) => event.preventDefault()}
        >
          <p className="sm:col-span-2 text-sm text-stone-deep">Find a starting size. It is a guide, not a fitting.</p>
          {chart === "girls" ? (
            <label>
              <span className={labelCls}>Height, cm</span>
              <input className={field} inputMode="numeric" value={height} onChange={(event) => setHeight(event.target.value)} />
            </label>
          ) : (
            <label>
              <span className={labelCls}>Chest, cm</span>
              <input className={field} inputMode="numeric" value={chest} onChange={(event) => setChest(event.target.value)} />
            </label>
          )}
          {suggestion ? <p className="self-end text-sm">Start with {suggestion}.</p> : null}
        </form>
        <p className="mt-4 text-[12px] text-stone-deep">
          Adult sample: {adultChart[2]?.size} chest {adultChart[2]?.chest} cm. Girls sample: {girlsChart[1]?.size}.
        </p>
      </div>
    </div>
  );
}
