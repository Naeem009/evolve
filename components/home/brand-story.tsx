import Image from "next/image";
import type { HomeSection } from "@/lib/home/schema";
import { RichText } from "./rich";

export function BrandStory({ section }: { section: Extract<HomeSection, { type: "story" }> }) {
  return (
    <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-16 md:px-6 lg:grid-cols-2 lg:px-12 lg:py-24">
      <div className="relative min-h-96 bg-sand">
        <Image src={section.image.desktopUrl} alt={section.image.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone-deep">The house</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">{section.heading}</h2>
        <RichText text={section.body} className="mt-4 max-w-xl" />
      </div>
    </section>
  );
}
