"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { track } from "@/lib/analytics";
import type { CardModel } from "@/lib/home/cards";
import type { HomeSection } from "@/lib/home/schema";
import { HomeProductCard } from "./home-product-card";

export function ProductRail({
  section,
  products,
  viewAllHref,
}: {
  section: Extract<HomeSection, { type: "productRail" }>;
  products: CardModel[];
  viewAllHref: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("view_item_list", { item_list_name: section.listName, item_count: products.length });
  }, [products.length, section.listName]);

  if (products.length === 0) return null;

  function move(direction: number) {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  }

  const heading = (
    <div className="mb-2 flex items-end justify-between gap-4 px-4 md:px-8">
      <h2 className="text-[12px] uppercase tracking-[0.18em] md:text-[14px]">{section.title}</h2>
      <div className="flex items-center gap-2">
        {section.layout === "carousel" ? (
          <>
            <button type="button" className="hidden h-12 w-12 items-center justify-center border border-sand lg:inline-flex" aria-label="Previous pieces" onClick={() => move(-1)}>
              <ChevronLeft strokeWidth={1.25} />
            </button>
            <button type="button" className="hidden h-12 w-12 items-center justify-center border border-sand lg:inline-flex" aria-label="Next pieces" onClick={() => move(1)}>
              <ChevronRight strokeWidth={1.25} />
            </button>
          </>
        ) : null}
        <Link href={viewAllHref} className="text-[12px] uppercase tracking-[0.16em] underline underline-offset-4">
          View all
        </Link>
      </div>
    </div>
  );

  if (section.layout === "carousel") {
    return (
      <section className="bg-sand/50 py-4">
        {heading}
        <div
          ref={scroller}
            className="flex snap-x snap-mandatory gap-px overflow-x-auto bg-sand [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={section.title}
        >
          {products.map((product) => (
              <div key={product.handle} className="w-full shrink-0 snap-start bg-bone md:w-[calc(50%-0.5px)]">
              <HomeProductCard product={product} listName={section.listName} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      {heading}
      <div className={products.length <= 3 ? "grid w-full grid-cols-1 gap-px bg-sand md:grid-cols-3" : "grid w-full grid-cols-2 gap-px bg-sand lg:grid-cols-3"}>
        {products.map((product) => (
          <HomeProductCard key={product.handle} product={product} listName={section.listName} sizes="(max-width: 1024px) 50vw, 34vw" />
        ))}
      </div>
    </section>
  );
}
