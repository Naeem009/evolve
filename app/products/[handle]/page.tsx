import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { Gallery, PurchasePanel } from "@/components/pdp";
import { ProductGrid } from "@/components/product-card";
import { ReviewForm } from "@/components/forms";
import { categories, getProduct, products, relatedProducts, totalStock } from "@/lib/catalog";
import { site } from "@/lib/site";
import { availabilityFor, publishedReviews } from "@/lib/server-store";

type Params = Promise<{ handle: string }>;

export function generateStaticParams() {
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return { title: "Piece" };
  return {
    title: product.title,
    description: product.description.slice(0, 155),
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [product.images[0].src] : undefined,
    },
  };
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1440px] px-4 py-16 text-sm text-stone-deep">Loading the piece…</div>}>
      <Piece params={params} />
    </Suspense>
  );
}

async function Piece({ params }: { params: Params }) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();
  const related = relatedProducts(product);
  const rating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : undefined;

  return (
    <article>
      <nav className="px-4 py-3 text-[12px] uppercase tracking-[0.14em] text-stone-deep md:px-8" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="px-2">/</span>
        <Link href={`/collections/${product.category}`}>{categories.find((item) => item.handle === product.category)?.title}</Link>
        <span className="px-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          image: product.images.map((image) => image.src),
          sku: product.variants[0]?.sku,
          brand: { "@type": "Brand", name: "EVOLVE" },
          ...(rating
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: rating.toFixed(1),
                  reviewCount: product.reviews.length,
                },
              }
            : {}),
          offers: {
            "@type": "Offer",
            priceCurrency: "PKR",
            price: product.price,
            availability:
              totalStock(product) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${site.url}/products/${product.handle}`,
          },
        }}
      />
      <Gallery product={product} />
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
        <div>
          <Suspense fallback={<div className="h-64 animate-pulse bg-sand/70" />}>
            <Stocked handle={product.handle} />
          </Suspense>
          <div className="mt-10 space-y-3 border-t border-sand pt-6">
            <details open>
              <summary className="min-h-11 text-[12px] uppercase tracking-[0.16em]">Description</summary>
              <p className="mt-2 text-[15px]">{product.description}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-deep">
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </details>
            <details>
              <summary className="min-h-11 text-[12px] uppercase tracking-[0.16em]">Fabric and care</summary>
              <p className="mt-2 text-sm">{product.fabric}. {product.care}</p>
            </details>
            <details>
              <summary className="min-h-11 text-[12px] uppercase tracking-[0.16em]">Fit</summary>
              <p className="mt-2 text-sm">{product.fitNotes}</p>
              <p className="mt-2 text-sm text-stone-deep">{product.modelInfo}</p>
            </details>
            <details>
              <summary className="min-h-11 text-[12px] uppercase tracking-[0.16em]">Delivery and exchange</summary>
              <p className="mt-2 text-sm">
                Standard delivery is free over PKR {site.freeShippingThreshold.toLocaleString("en-PK")}. Exchanges within {site.exchangeWindowDays} days if the piece is unworn and the tags are on.{" "}
                <Link href="/policies/exchange" className="underline">Exchange policy</Link>
              </p>
            </details>
          </div>
        </div>
      </div>

      <section className="mx-auto mt-10 max-w-[1440px] border-t border-sand px-4 pt-8 md:px-8">
        <h2 className="font-serif text-4xl">Reviews</h2>
        {product.reviews.length === 0 ? <p className="mt-3 text-sm text-stone-deep">No published reviews yet.</p> : null}
        <ul className="mt-6 space-y-6">
          {product.reviews.map((review) => (
            <li key={review.id}>
              <p className="text-[12px] uppercase tracking-[0.14em]">{review.rating} / 5{review.verified ? " · Verified buyer" : ""}</p>
              <p className="mt-2 max-w-2xl">{review.text}</p>
              <p className="mt-1 text-sm text-stone-deep">{review.author}</p>
            </li>
          ))}
        </ul>
        <Suspense fallback={null}>
          <ExtraReviews handle={product.handle} />
        </Suspense>
        <ReviewForm handle={product.handle} />
      </section>
      <section className="mt-8">
        <h2 className="mb-2 px-4 font-serif text-4xl md:px-8">You may also like</h2>
        <ProductGrid products={related} />
      </section>
    </article>
  );
}

async function Stocked({ handle }: { handle: string }) {
  const product = getProduct(handle);
  if (!product) return null;
  const availability = await availabilityFor(product.variants.map((variant) => variant.id));
  return <PurchasePanel product={product} availability={availability} />;
}

async function ExtraReviews({ handle }: { handle: string }) {
  const product = getProduct(handle);
  const seeded = new Set(product?.reviews.map((review) => review.id) ?? []);
  const extra = (await publishedReviews(handle)).filter((review) => !seeded.has(review.id));
  if (extra.length === 0) return null;
  return (
    <ul className="mt-6 space-y-6">
      {extra.map((review) => (
        <li key={review.id}>
          <p className="text-[12px] uppercase tracking-[0.14em]">{review.rating} / 5</p>
          <p className="mt-2 max-w-2xl">{review.text}</p>
          <p className="mt-1 text-sm text-stone-deep">{review.author}</p>
        </li>
      ))}
    </ul>
  );
}
