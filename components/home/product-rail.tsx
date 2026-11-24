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
    <div className="mb-6 flex items-end justify-between gap-4">
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
      <section className="bg-sand/50 py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12">
          {heading}
          <div
            ref={scroller}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={section.title}
          >
            {products.map((product) => (
              <div key={product.handle} className="w-[76%] shrink-0 snap-start md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
                <HomeProductCard product={product} listName={section.listName} sizes="(max-width: 768px) 76vw, 25vw" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 lg:px-12 lg:py-24">
      {heading}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <HomeProductCard key={product.handle} product={product} listName={section.listName} sizes="(max-width: 1024px) 50vw, 25vw" />
        ))}
      </div>
    </section>
  );
}
