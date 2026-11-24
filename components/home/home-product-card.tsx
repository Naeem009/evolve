"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { formatPKR } from "@/lib/format";
import type { CardModel } from "@/lib/home/cards";
import { WishlistButton } from "../wishlist-button";
import { HomeQuickAdd } from "./home-quick-add";

const badgeLabel: Record<string, string> = {
  new: "New",
  bestseller: "Bestseller",
  sale: "Sale",
};

export function HomeProductCard({ product, listName, sizes }: { product: CardModel; listName: string; sizes: string }) {
  const second = product.images[1];
  const onSale = product.badges.includes("sale") || Boolean(product.compareAt);

  function select() {
    track("select_item", { item_list_name: listName, item_id: product.handle, item_name: product.title, value: product.price });
  }

  return (
    <article className="group relative min-w-0">
      <div className="relative">
        <Link href={`/products/${product.handle}`} className="relative block aspect-[3/4] overflow-hidden bg-sand" onClick={select}>
          <Image
            src={product.images[0]?.src ?? ""}
            alt={product.images[0]?.alt ?? product.title}
            fill
            sizes={sizes}
            className={`object-cover ${second ? "md:transition md:duration-500 md:group-hover:opacity-0" : ""}`}
          />
          {second ? (
            <Image src={second.src} alt="" fill sizes={sizes} className="hidden object-cover opacity-0 md:block md:transition md:duration-500 md:group-hover:opacity-100" />
          ) : null}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-2 pb-14 text-bone">
            <span className="block text-[12px] uppercase tracking-[0.12em] md:text-[13px]">{product.title}</span>
            <span className="mt-1 inline-flex items-center bg-bone px-1.5 py-0.5 text-[13px] text-ink">
              <span className={onSale ? "text-sale" : ""}>{formatPKR(product.price)}</span>
              {product.compareAt ? <s className="ml-2 text-stone-deep">{formatPKR(product.compareAt)}</s> : null}
            </span>
          </span>
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1">
          {product.soldOut ? <span className="bg-bone px-2 py-1 text-[10px] uppercase tracking-[0.14em]">Sold out</span> : null}
          {product.badges.map((badge) => (
            <span key={badge} className={`px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${badge === "sale" ? "bg-sale text-bone" : "bg-bone"}`}>
              {badge === "sale" && product.off ? `${product.off}% off` : badgeLabel[badge] ?? badge}
            </span>
          ))}
          {product.lowStock && !product.soldOut ? <span className="bg-bone px-2 py-1 text-[10px] uppercase tracking-[0.14em]">Low stock</span> : null}
        </div>
        <WishlistButton handle={product.handle} />
        <div className="absolute inset-x-0 bottom-0 z-10 px-2 pb-2">
          <HomeQuickAdd product={product} listName={listName} />
        </div>
      </div>
      <h3 className="sr-only">
        <Link href={`/products/${product.handle}`} onClick={select}>
          {product.title}
        </Link>
      </h3>
    </article>
  );
}
