import Image from "next/image";
import Link from "next/link";
import { isLowStock, priceLabel, totalStock } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import { QuickAdd } from "./quick-add";
import { WishlistButton } from "./wishlist-button";

const badgeLabel = {
  new: "New",
  bestseller: "Bestseller",
  sale: "Sale",
} as const;

export function ProductCard({ product }: { product: Product }) {
  const price = priceLabel(product);
  const soldOut = totalStock(product) <= 0;
  const low = isLowStock(product);
  const second = product.images[1];
  return (
    <article className="group">
      <div className="relative">
        <Link href={`/products/${product.handle}`} className="relative block aspect-[4/5] overflow-hidden bg-sand">
          <Image
            src={product.images[0]?.src ?? ""}
            alt={product.images[0]?.alt ?? product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover ${second ? "transition duration-500 group-hover:opacity-0" : ""}`}
          />
          {second ? (
            <Image
              src={second.src}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
            />
          ) : null}
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {soldOut ? <span className="bg-bone px-2 py-1 text-[10px] uppercase tracking-[0.14em]">Sold out</span> : null}
          {product.badges.map((badge) => (
            <span key={badge} className="bg-bone px-2 py-1 text-[10px] uppercase tracking-[0.14em]">
              {badge === "sale" && price.off ? `${price.off}% off` : badgeLabel[badge]}
            </span>
          ))}
          {low && !soldOut ? <span className="bg-bone px-2 py-1 text-[10px] uppercase tracking-[0.14em]">Low stock</span> : null}
        </div>
        <WishlistButton handle={product.handle} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm">
            <Link href={`/products/${product.handle}`}>{product.title}</Link>
          </h3>
          <p className="text-[13px] text-stone-deep">
            {formatPKR(product.price)}
            {price.compare && price.compare > product.price ? (
              <s className="ml-2">{formatPKR(price.compare)}</s>
            ) : null}
          </p>
        </div>
      </div>
      <QuickAdd product={product} />
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-sand px-6 py-16 text-center">
        <p className="font-serif text-4xl">Nothing in this edit.</p>
        <p className="mt-3 text-sm text-stone-deep">Clear a filter, or look through new arrivals.</p>
        <Link href="/collections/new-arrivals" className="mt-6 inline-flex min-h-11 items-center text-[12px] uppercase tracking-[0.16em] underline">
          New arrivals
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.handle} product={product} />
      ))}
    </div>
  );
}
