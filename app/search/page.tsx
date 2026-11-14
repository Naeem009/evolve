import type { Metadata } from "next";
import { Suspense } from "react";
import { Listing } from "@/components/listing";
import { filterProducts, products, type CatalogQuery } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("Search", "Search co-ord sets, tracksuits, hoodies, sweatshirts and tops.", "/search");

type Search = Promise<Record<string, string | string[] | undefined>>;

export default function Page({ searchParams }: { searchParams: Search }) {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-sm text-stone-deep">Searching…</div>}>
      <Results searchParams={searchParams} />
    </Suspense>
  );
}

async function Results({ searchParams }: { searchParams: Search }) {
  const search = await searchParams;
  const q = typeof search.q === "string" ? search.q : "";
  const query: CatalogQuery = {
    q,
    sort: typeof search.sort === "string" ? search.sort : "bestselling",
    size: search.size,
    color: search.color,
    fabric: search.fabric,
    audience: typeof search.audience === "string" ? search.audience : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    availability: typeof search.availability === "string" ? search.availability : undefined,
    min: typeof search.min === "string" ? search.min : undefined,
    max: typeof search.max === "string" ? search.max : undefined,
  };
  const items = q.trim() ? filterProducts(products, query) : [];
  return (
    <Listing
      title={q.trim() ? `Results for “${q.trim()}”` : "Search"}
      lede={q.trim() ? "Pieces that match your words." : "Search by piece, fabric or audience."}
      action="/search"
      query={query}
      products={items}
      universe={products}
    />
  );
}
