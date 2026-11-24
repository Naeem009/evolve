import Link from "next/link";
import { cardsForRail, railHref } from "@/lib/home/cards";
import { getHomePage } from "@/lib/home/content";
import type { HomePage } from "@/lib/home/schema";
import { BrandStory } from "./brand-story";
import { CategoryTiles } from "./category-tiles";
import { CircleBanner } from "./circle-banner";
import { HeroBanner } from "./hero-banner";
import { HighlightsGrid } from "./highlights-grid";
import { NewsletterBlock } from "./newsletter-block";
import { ProductRail } from "./product-rail";
import { ServicesStrip } from "./services-strip";
import { SocialProof } from "./social-proof";
import { SplitBanners } from "./split-banners";
import { Statement } from "./statement";

export function HomeRenderer({ page = getHomePage() }: { page?: HomePage }) {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || "";
  const sections = page.sections.filter((section) => section.type !== "announcement");
  if (sections.length === 0) {
    return (
      <section className="mx-auto max-w-[1440px] px-4 py-24">
        <h1 className="font-serif text-5xl">Evolve your style.</h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop/women" className="inline-flex h-12 items-center bg-ink px-6 text-[12px] uppercase tracking-[0.18em] text-bone">
            Shop Women
          </Link>
          <Link href="/shop/men" className="inline-flex h-12 items-center border border-ink px-6 text-[12px] uppercase tracking-[0.18em]">
            Shop Men
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) {
            @keyframes home-rise {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: none; }
            }
            .home-reveal {
              animation: home-rise 400ms ease both;
              animation-timeline: view();
              animation-range: entry 0% cover 25%;
            }
          }
        }
      `}</style>
      {sections.map((section) => {
        const body = renderSection(section, turnstileSiteKey);
        if (!body) return null;
        if (section.type === "hero") return <div key={`${section.type}-${section.order}`}>{body}</div>;
        return (
          <div key={`${section.type}-${section.order}`} className="home-reveal">
            {body}
          </div>
        );
      })}
    </>
  );
}

function renderSection(section: HomePage["sections"][number], turnstileSiteKey: string) {
  switch (section.type) {
    case "hero":
      return <HeroBanner slides={section.slides} height="hero" />;
    case "categoryTiles":
      return <CategoryTiles section={section} />;
    case "productRail":
      return <ProductRail section={section} products={cardsForRail(section)} viewAllHref={railHref(section)} />;
    case "statement":
      return <Statement section={section} />;
    case "campaignBanner":
      return <HeroBanner slides={[section.slide]} height={section.height} heading="h2" videoSrc={section.video} />;
    case "splitBanners":
      return <SplitBanners section={section} />;
    case "highlights":
      return <HighlightsGrid section={section} />;
    case "story":
      return <BrandStory section={section} />;
    case "social":
      return <SocialProof section={section} />;
    case "circle":
      return <CircleBanner section={section} turnstileSiteKey={turnstileSiteKey || undefined} />;
    case "services":
      return <ServicesStrip section={section} />;
    case "newsletter":
      return <NewsletterBlock section={section} turnstileSiteKey={turnstileSiteKey || undefined} />;
    default:
      return null;
  }
}
