import Image from "next/image";
import type { HomeSection } from "@/lib/home/schema";

export function SocialProof({ section }: { section: Extract<HomeSection, { type: "social" }> }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-4xl md:text-5xl">The edit</h2>
          <a href={section.instagramHandle} className="text-[12px] uppercase tracking-[0.16em] underline underline-offset-4" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {section.images.map((image) => (
            <a key={image.alt} href={section.instagramHandle} target="_blank" rel="noreferrer" className="relative aspect-square bg-sand">
              <Image src={image.mobileUrl} alt={image.alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
            </a>
          ))}
        </div>
      </div>
      {section.reviews.length > 0 ? (
        <div className="mx-auto mt-12 max-w-[1440px] border-y border-sand md:px-6 lg:px-12">
          <h2 className="px-4 pt-8 text-[12px] uppercase tracking-[0.18em] md:px-0">Reviews</h2>
          <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-8 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {section.reviews.map((review) => (
              <blockquote key={review.author + review.product} className="w-[85%] shrink-0 snap-start md:w-auto">
                <p className="font-serif text-2xl italic">“{review.quote}”</p>
                <footer className="mt-4 text-[12px] uppercase tracking-[0.14em] text-stone-deep">
                  {review.author} · {review.product} · Verified
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
