import Link from "next/link";
import type { HomeSection } from "@/lib/home/schema";

export function Statement({ section }: { section: Extract<HomeSection, { type: "statement" }> }) {
  return (
    <section className="mx-auto max-w-[28ch] px-4 py-16 text-center lg:py-24">
      <p className="font-serif text-2xl leading-snug md:text-[32px]">{section.text}</p>
      {section.link ? (
        <Link href={section.link.href} className="mt-6 inline-flex h-12 items-center text-[12px] uppercase tracking-[0.18em] underline underline-offset-4">
          {section.link.label}
        </Link>
      ) : null}
    </section>
  );
}
