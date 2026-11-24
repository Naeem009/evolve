import Image from "next/image";
import Link from "next/link";
import type { HomeSection } from "@/lib/home/schema";

export function HighlightsGrid({ section }: { section: Extract<HomeSection, { type: "highlights" }> }) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 lg:px-12 lg:py-24">
      <h2 className="text-[12px] uppercase tracking-[0.18em] md:text-[14px]">Highlights</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {section.tiles.map((tile) => (
          <Link key={tile.href + tile.title} href={tile.href} className="group min-w-0">
            <span className="relative block aspect-[4/5] overflow-hidden bg-sand">
              <Image
                src={tile.image.mobileUrl}
                alt={tile.image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
              />
            </span>
            <span className="mt-3 block text-[12px] uppercase tracking-[0.16em]">{tile.title}</span>
            <span className="mt-1 block text-[12px] uppercase tracking-[0.14em] text-stone-deep underline underline-offset-4">Discover more</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
