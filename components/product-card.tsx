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
        <Link href={`/products/${product.handle}`} className="relative block aspect-[3/4] overflow-hidden bg-sand">
          <Image
            src={product.images[0]?.src ?? ""}
            alt={product.images[0]?.alt ?? product.title}
            fill
            sizes="(max-width: 1024px) 50vw, 34vw"
            className={`object-cover ${second ? "transition duration-500 group-hover:opacity-0" : ""}`}
          />
          {second ? (
            <Image
              src={second.src}
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 34vw"
              className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
            />
          ) : null}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-2 pr-28 text-bone">
            <span className="block text-[12px] uppercase tracking-[0.12em]">{product.title}</span>
            <span className="mt-1 inline-flex items-center bg-bone px-1.5 py-0.5 text-[13px] text-ink">
              <span className={price.compare && price.compare > product.price ? "text-sale" : ""}>{formatPKR(product.price)}</span>
              {price.compare && price.compare > product.price ? <s className="ml-2 text-stone-deep">{formatPKR(price.compare)}</s> : null}
            </span>
          </span>
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {soldOut ? <span className="bg-bone px-2 py-1 text-[10px] uppercase tracking-[0.14em]">Sold out</span> : null}
          {product.badges.map((badge) => (
            <span key={badge} className={`px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${badge === "sale" ? "bg-sale text-bone" : "bg-bone"}`}>
              {badge === "sale" && price.off ? `${price.off}% off` : badgeLabel[badge]}
            </span>
          ))}
          {low && !soldOut ? <span className="bg-bone px-2 py-1 text-[10px] uppercase tracking-[0.14em]">Low stock</span> : null}
        </div>
        <WishlistButton handle={product.handle} />
        <QuickAdd product={product} />
      </div>
      <h3 className="sr-only">
        <Link href={`/products/${product.handle}`}>{product.title}</Link>
      </h3>
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
    <div className="grid w-full grid-cols-2 gap-0 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.handle} product={product} />
      ))}
    </div>
  );
}
