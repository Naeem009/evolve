"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Slide } from "@/lib/home";
export function Hero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slide) return null;

  return (
    <section className="relative min-h-[78svh] bg-ink text-bone" aria-roledescription="carousel">
      {slides.map((item, itemIndex) => (
        <Image
          key={item.image}
          src={item.image}
          alt={itemIndex === index ? item.alt : ""}
          fill
          priority={itemIndex === 0}
          sizes="100vw"
          className={`object-cover transition duration-700 ${itemIndex === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/10" />
      <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-[1440px] items-end px-4 pb-16 md:px-8 md:pb-20">
        <div className="max-w-xl">
          <span className="mb-4 block h-px w-10 bg-accent" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-bone/80">{slide.eyebrow}</p>
          <h1 className="mt-3 font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{slide.title}</h1>
          <p className="mt-4 max-w-md font-serif text-xl italic text-bone/90">{slide.lede}</p>
          <Link href={slide.href} className="mt-8 inline-flex min-h-11 items-center bg-bone px-6 text-[12px] uppercase tracking-[0.18em] text-ink">
            {slide.cta}
          </Link>
          <div className="mt-8 flex gap-2">
            {slides.map((item, itemIndex) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show slide ${itemIndex + 1}: ${item.title}`}
                aria-current={itemIndex === index ? "true" : undefined}
                className="inline-flex h-11 w-11 items-center justify-center"
                onClick={() => setIndex(itemIndex)}
              >
                <span className={`block h-px w-8 ${itemIndex === index ? "bg-bone" : "bg-bone/40"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
