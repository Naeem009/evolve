import Image from "next/image";
import Link from "next/link";
import type { HomeSection } from "@/lib/home/schema";

export function CategoryTiles({ section }: { section: Extract<HomeSection, { type: "categoryTiles" }> }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12">
        <h2 className="text-[12px] uppercase tracking-[0.18em]">Shop by category</h2>
      </div>
      <div className="mx-auto mt-6 max-w-[1440px] md:px-6 lg:px-12">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-5">
          {section.tiles.map((tile) => (
            <Link key={tile.href} href={tile.href} className="group w-[42%] shrink-0 snap-start md:w-auto">
              <span className="relative block aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src={tile.image.mobileUrl}
                  alt={tile.image.alt}
                  fill
                  sizes="(max-width: 768px) 42vw, 20vw"
                  className="object-cover motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/35 to-transparent p-3 text-[12px] uppercase tracking-[0.16em] text-bone">
                  {tile.label}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
