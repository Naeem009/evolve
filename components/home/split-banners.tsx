import Image from "next/image";
import Link from "next/link";
import type { Cta, HomeSection } from "@/lib/home/schema";

function actionClass(style: Cta["style"]): string {
  if (style === "text") return "inline-flex h-12 items-center text-[12px] uppercase tracking-[0.18em] text-bone underline underline-offset-4";
  if (style === "outline") return "inline-flex h-12 items-center border border-bone px-6 text-[12px] uppercase tracking-[0.18em] text-bone";
  return "inline-flex h-12 items-center bg-bone px-6 text-[12px] uppercase tracking-[0.18em] text-ink";
}

export function SplitBanners({ section }: { section: Extract<HomeSection, { type: "splitBanners" }> }) {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-3 px-4 py-16 md:px-6 lg:grid-cols-2 lg:px-12 lg:py-24">
      {section.items.map((item) => (
        <article key={item.label} className="relative aspect-[4/5] overflow-hidden bg-sand text-bone">
          <Image src={item.image.desktopUrl} alt={item.image.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/20" />
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.2em]">{item.label}</p>
            <p className="mt-3 max-w-sm font-serif text-2xl">{item.promise}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={item.primary.href} className={actionClass(item.primary.style)}>
                {item.primary.label}
              </Link>
              {item.secondary ? (
                <Link href={item.secondary.href} className={actionClass(item.secondary.style)}>
                  {item.secondary.label}
                </Link>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
