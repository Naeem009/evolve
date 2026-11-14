import Link from "next/link";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { btn } from "@/components/styles";

export default function NotFound() {
  const suggestions = [...products].sort((a, b) => b.sales30d - a.sales30d).slice(0, 4);
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
      <h1 className="font-serif text-5xl">This page has moved on.</h1>
      <p className="mt-3 max-w-lg text-stone-deep">The link may be old. These pieces are still here.</p>
      <Link href="/collections/new-arrivals" className={`${btn} mt-6`}>
        New arrivals
      </Link>
      <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
        {suggestions.map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
      </div>
    </div>
  );
}
