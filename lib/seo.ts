import type { Metadata } from "next";

export function pageMeta(title: string, description: string, path: string): Metadata {
  const text = description.slice(0, 155);
  return {
    title,
    description: text,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: text,
      url: path,
      siteName: "EVOLVE",
      type: "website",
      images: [{ url: "/brand/logo.jpg", alt: "EVOLVE — Evolve Your Style" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: text,
      images: ["/brand/logo.jpg"],
    },
  };
}
