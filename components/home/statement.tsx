import Link from "next/link";
import type { HomeSection } from "@/lib/home/schema";

export function Statement({ section }: { section: Extract<HomeSection, { type: "statement" }> }) {
  return (
    <section className="mx-auto max-w-[100ch] px-4 py-5 text-center lg:py-8">
      <p className="font-serif text-2xl leading-snug md:text-[40px]">{section.text}</p>
      {section.link ? (
        <Link href={section.link.href} className="mt-6 inline-flex h-8 items-center text-[8px] uppercase tracking-[0.18em] underline underline-offset-4">
          {section.link.label}
        </Link>
      ) : null}
    </section>
  );
}
