import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Listing } from "@/components/listing";
import { audiences, filterProducts, products, type CatalogQuery } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";
import type { Audience } from "@/lib/types";

type Params = Promise<{ audience: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

const allowed: Audience[] = ["women", "men", "unisex"];

export function generateStaticParams() {
  return allowed.map((audience) => ({ audience }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { audience } = await params;
  const match = audiences.find((item) => item.handle === audience);
  if (!match) return { title: "Shop" };
  return pageMeta(match.title, match.blurb, `/shop/${match.handle}`);
}

export default function Page({ params, searchParams }: { params: Params; searchParams: Search }) {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-sm text-stone-deep">Loading the edit…</div>}>
      <Shop params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Shop({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { audience } = await params;
  const search = await searchParams;
  if (!allowed.includes(audience as Audience)) notFound();
  const match = audiences.find((item) => item.handle === audience);
  if (!match) notFound();
  const universe = products.filter((product) => product.audience === audience);
  const query: CatalogQuery = {
    audience,
    category: typeof search.category === "string" ? search.category : undefined,
    size: search.size,
    color: search.color,
    fabric: search.fabric,
    availability: typeof search.availability === "string" ? search.availability : undefined,
    min: typeof search.min === "string" ? search.min : undefined,
    max: typeof search.max === "string" ? search.max : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
  };
  return (
    <Listing
      title={match.title}
      lede={match.blurb}
      action={`/shop/${audience}`}
      query={query}
      products={filterProducts(universe, query)}
      universe={universe}
      hideAudience
    />
  );
}
