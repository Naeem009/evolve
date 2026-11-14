import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Listing } from "@/components/listing";
import { JsonLd } from "@/components/json-ld";
import { categories, collectionMeta, filterProducts, productsInCollection, type CatalogQuery } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

type Params = Promise<{ handle: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

export function generateStaticParams() {
  return collectionMeta.map((collection) => ({ handle: collection.handle }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { handle } = await params;
  const collection = collectionMeta.find((item) => item.handle === handle);
  if (!collection) return { title: "Collection" };
  return pageMeta(collection.title, collection.blurb, `/collections/${collection.handle}`);
}

export default function Page({ params, searchParams }: { params: Params; searchParams: Search }) {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-sm text-stone-deep">Loading the edit…</div>}>
      <Collection params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Collection({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { handle } = await params;
  const search = await searchParams;
  const collection = collectionMeta.find((item) => item.handle === handle);
  if (!collection) notFound();
  const universe = productsInCollection(handle);
  const isCategory = categories.some((category) => category.handle === handle);
  const query: CatalogQuery = {
    audience: one(search.audience),
    category: isCategory ? undefined : one(search.category),
    size: search.size,
    color: search.color,
    fabric: search.fabric,
    availability: one(search.availability),
    min: one(search.min),
    max: one(search.max),
    sort: one(search.sort),
  };
  const items = filterProducts(universe, query);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: collection.title, item: `${site.url}/collections/${handle}` },
          ],
        }}
      />
      <Listing
        title={collection.title}
        lede={collection.blurb}
        action={`/collections/${handle}`}
        query={query}
        products={items}
        universe={universe}
        hideCategory={isCategory}
      />
    </>
  );
}

function one(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}
