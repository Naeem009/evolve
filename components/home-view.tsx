import Image from "next/image";
import Link from "next/link";
import { categories, products } from "@/lib/catalog";
import { archiveTiles, audienceTiles, editorials, heroSlides } from "@/lib/home";
import { site } from "@/lib/site";
import { Hero } from "./hero";
import { ProductCard } from "./product-card";
import { btnGhost, eyebrow } from "./styles";

export function HomeView() {
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const best = [...products].sort((a, b) => b.sales30d - a.sales30d).slice(0, 4);
  const quotes = products.flatMap((product) => product.reviews.map((review) => ({ ...review, title: product.title }))).slice(0, 3);

  return (
    <>
      <Hero slides={heroSlides} />

      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="mb-3 block h-px w-8 bg-accent" />
            <h2 className="font-serif text-4xl md:text-5xl">Shop by category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {categories.map((category) => {
            const image = products.find((product) => product.category === category.handle)?.images[0];
            return (
              <Link key={category.handle} href={`/collections/${category.handle}`} className="group">
                <div className="relative aspect-[4/5] bg-sand">
                  {image ? (
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />
                  ) : null}
                </div>
                <h3 className="mt-3 text-sm">{category.title}</h3>
                <p className="text-[13px] text-stone-deep">{category.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8 md:pb-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-4xl md:text-5xl">New arrivals</h2>
          <Link href="/collections/new-arrivals" className="text-[12px] uppercase tracking-[0.16em]">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
          {newest.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-sand/50">
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-4xl md:text-5xl">Bestsellers</h2>
            <Link href="/collections/bestsellers" className="text-[12px] uppercase tracking-[0.16em]">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
            {best.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-3 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2">
        {editorials.map((story) => (
          <Link key={story.title} href={story.href} className="group relative min-h-[70vh] bg-ink text-bone">
            <Image src={story.image} alt={story.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="relative z-10 flex h-full min-h-[70vh] flex-col justify-end p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bone/80">{story.eyebrow}</p>
              <h2 className="mt-2 font-serif text-5xl">{story.title}</h2>
              <p className="mt-3 max-w-sm font-serif text-xl italic">{story.lede}</p>
              <span className="mt-6 text-[12px] uppercase tracking-[0.16em]">{story.cta}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
        <h2 className="mb-8 font-serif text-4xl md:text-5xl">Shop by audience</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {audienceTiles.map((tile) => (
            <Link key={tile.handle} href={`/shop/${tile.handle}`} className="relative min-h-80 bg-sand">
              <Image src={tile.image} alt={tile.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              <span className="absolute bottom-0 left-0 bg-bone px-4 py-3 text-[12px] uppercase tracking-[0.18em]">{tile.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-8 md:px-8 lg:grid-cols-2">
        <div className="relative min-h-96 bg-sand">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=75"
            alt="A quiet clothing studio with garments on rails"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className={eyebrow}>The house</p>
          <h2 className="mt-3 font-serif text-5xl">Evolve your style.</h2>
          <p className="mt-4 max-w-md text-stone-deep">
            EVOLVE designs clothing that can be worn hard and still look considered. The same cloth runs through the women’s, men’s and girls’ lines. Girls’ pieces are cut for ages 10 and over, with modest lengths and no children’s styling.
          </p>
          <Link href="/pages/about" className={`${btnGhost} mt-8`}>
            Read the story
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl">The edit</h2>
            <p className="mt-2 text-sm text-stone-deep">A curated grid from the archive.</p>
          </div>
          <a href={site.instagram} className="text-[12px] uppercase tracking-[0.16em]" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {archiveTiles.map((tile) => (
            <a key={tile.alt} href={site.instagram} target="_blank" rel="noreferrer" className="relative aspect-square bg-sand">
              <Image src={tile.image} alt={tile.alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-sand">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
          {quotes.map((quote) => (
            <blockquote key={quote.id}>
              <p className="font-serif text-2xl italic">“{quote.text}”</p>
              <footer className="mt-4 text-[12px] uppercase tracking-[0.14em] text-stone-deep">
                {quote.author} · {quote.title}
                {quote.verified ? " · Verified" : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-6 px-4 py-12 text-center md:grid-cols-4 md:px-8">
        {[
          ["Easy exchange", `${site.exchangeWindowDays} days, tags on`],
          ["Cash on delivery", "Confirmed before dispatch"],
          ["Secure payments", "No card data stored here"],
          ["WhatsApp", `Reply within ${site.replyMinutes} minutes`],
        ].map(([title, lede]) => (
          <div key={title} className="border border-sand px-4 py-6">
            <h2 className="text-[12px] uppercase tracking-[0.16em]">{title}</h2>
            <p className="mt-2 text-sm text-stone-deep">{lede}</p>
          </div>
        ))}
      </section>
    </>
  );
}
