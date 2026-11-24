"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Cta, HeroSlide } from "@/lib/home/schema";

function ArtImage({ desktopUrl, mobileUrl, alt, eager }: { desktopUrl: string; mobileUrl: string; alt: string; eager: boolean }) {
  const shared = { alt, sizes: "100vw", quality: 75 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...shared, width: 2400, height: 1200, src: desktopUrl });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...shared,
    width: 1440,
    height: 1800,
    src: mobileUrl,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "low",
    preload: eager,
  });
  return (
    <picture className="absolute inset-0">
      <source media="(min-width: 768px)" srcSet={desktop} />
      <img {...rest} srcSet={mobile} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}

function ctaClass(style: Cta["style"]): string {
  const base = "inline-flex h-12 items-center justify-center px-6 text-[12px] uppercase tracking-[0.18em]";
  if (style === "solid") return `${base} bg-bone text-ink`;
  if (style === "outline") return `${base} border border-bone bg-transparent text-bone`;
  return "inline-flex h-12 items-center text-[12px] uppercase tracking-[0.18em] text-bone underline underline-offset-4";
}

export function HeroBanner({
  slides,
  height,
  heading = "h1",
}: {
  slides: HeroSlide[];
  height: "hero" | "md";
  heading?: "h1" | "h2";
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  const count = slides.length;
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!slide) return null;

  function step(direction: number) {
    setIndex((current) => (current + direction + count) % count);
  }

  const frame = height === "hero" ? "min-h-[78svh] lg:min-h-[min(88vh,860px)]" : "min-h-[min(70vh,640px)]";
  const align = slide.textAlign === "center" ? "items-center text-center" : "items-start text-left";
  const stretch = height === "hero" ? "min-h-[78svh] lg:min-h-[min(88vh,860px)]" : "min-h-[min(70vh,640px)]";

  return (
    <section
      className={`relative overflow-hidden bg-ink text-bone ${frame}`}
      aria-roledescription={count > 1 ? "carousel" : undefined}
      aria-label={count > 1 ? "Campaign" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onTouchStart={(event) => {
        startX.current = event.touches[0]?.clientX ?? 0;
      }}
      onTouchEnd={(event) => {
        if (count < 2) return;
        const next = event.changedTouches[0]?.clientX ?? 0;
        const delta = next - startX.current;
        if (Math.abs(delta) < 40) return;
        step(delta < 0 ? 1 : -1);
      }}
    >
      {slides.map((item, itemIndex) => (
        <div key={item.title} className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-700 ${itemIndex === index ? "opacity-100" : "opacity-0"}`} aria-hidden={itemIndex !== index}>
          <ArtImage desktopUrl={item.image.desktopUrl} mobileUrl={item.image.mobileUrl} alt={itemIndex === index ? item.image.alt : ""} eager={height === "hero" && itemIndex === 0} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-tr from-ink/55 via-ink/20 to-transparent" />
      <div className={`relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end px-4 pt-28 pb-28 md:px-6 lg:px-12 lg:pb-16 ${stretch} ${align}`}>
        <div className="max-w-xl">
          <span className="mb-4 block h-px w-10 bg-accent" />
          {slide.eyebrow ? <p className="text-[11px] uppercase tracking-[0.22em] text-bone/80">{slide.eyebrow}</p> : null}
          {heading === "h2" ? (
            <h2 className="mt-3 font-serif text-[clamp(36px,6vw,72px)] leading-[0.95] font-medium">{slide.title}</h2>
          ) : index === 0 ? (
            <h1 className="mt-3 font-serif text-[clamp(36px,6vw,72px)] leading-[0.95] font-medium">{slides[0]?.title}</h1>
          ) : (
            <>
              <h1 className="sr-only">{slides[0]?.title}</h1>
              <h2 className="mt-3 font-serif text-[clamp(36px,6vw,72px)] leading-[0.95] font-medium">{slide.title}</h2>
            </>
          )}
          {slide.subtitle ? <p className="mt-4 max-w-md font-serif text-xl italic text-bone/90">{slide.subtitle}</p> : null}
          <div className={`mt-8 flex flex-wrap gap-3 ${slide.textAlign === "center" ? "justify-center" : ""}`}>
            {slide.ctas.map((cta) => (
              <Link key={cta.href + cta.label} href={cta.href} className={ctaClass(cta.style)}>
                {cta.label}
              </Link>
            ))}
          </div>
          {count > 1 ? (
            <div className="mt-8 flex items-center gap-2">
              <button type="button" className="hidden h-12 w-12 items-center justify-center lg:inline-flex" aria-label="Previous slide" onClick={() => step(-1)}>
                <ChevronLeft strokeWidth={1.25} />
              </button>
              {slides.map((item, itemIndex) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Show slide ${itemIndex + 1}: ${item.title}`}
                  aria-current={itemIndex === index ? "true" : undefined}
                  className="inline-flex h-12 w-12 items-center justify-center"
                  onClick={() => setIndex(itemIndex)}
                >
                  <span className={`block h-px w-8 ${itemIndex === index ? "bg-bone" : "bg-bone/40"}`} />
                </button>
              ))}
              <button type="button" className="hidden h-12 w-12 items-center justify-center lg:inline-flex" aria-label="Next slide" onClick={() => step(1)}>
                <ChevronRight strokeWidth={1.25} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
