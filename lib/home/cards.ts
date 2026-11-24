import { isLowStock, priceLabel, products, productsInCollection, totalStock } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import type { HomeSection } from "./schema";

export type CardSize = { id: string; label: string; stock: number };

export type CardModel = {
  handle: string;
  title: string;
  price: number;
  compareAt?: number;
  off: number | null;
  badges: string[];
  lowStock: boolean;
  soldOut: boolean;
  images: { src: string; alt: string }[];
  colors: { name: string; hex: string; sizes: CardSize[] }[];
};

export function toCard(product: Product): CardModel {
  const price = priceLabel(product);
  const colors = new Map<string, { name: string; hex: string; sizes: CardSize[] }>();
  for (const variant of product.variants) {
    const group = colors.get(variant.color) ?? { name: variant.color, hex: variant.colorHex, sizes: [] };
    group.sizes.push({ id: variant.id, label: variant.size, stock: variant.stock });
    colors.set(variant.color, group);
  }
  return {
    handle: product.handle,
    title: product.title,
    price: product.price,
    compareAt: price.compare && price.compare > product.price ? price.compare : undefined,
    off: price.off,
    badges: product.badges,
    lowStock: isLowStock(product),
    soldOut: totalStock(product) <= 0,
    images: product.images.map((image) => ({ src: image.src, alt: image.alt })),
    colors: [...colors.values()],
  };
}

export function cardsForRail(section: Extract<HomeSection, { type: "productRail" }>): CardModel[] {
  let list: Product[];
  if (section.source === "new") {
    list = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } else if (section.source === "bestsellers") {
    list = [...products].sort((a, b) => b.sales30d - a.sales30d);
  } else {
    list = productsInCollection(section.collectionHandle ?? "");
  }
  const pins = section.pinnedHandles ?? [];
  if (pins.length > 0) {
    const pinned = pins.flatMap((handle) => {
      const match = list.find((product) => product.handle === handle);
      return match ? [match] : [];
    });
    list = [...pinned, ...list.filter((product) => !pins.includes(product.handle))];
  }
  return list.slice(0, section.limit).map(toCard);
}

export function railHref(section: Extract<HomeSection, { type: "productRail" }>): string {
  if (section.source === "new") return "/collections/new-arrivals";
  if (section.source === "bestsellers") return "/collections/bestsellers";
  return `/collections/${section.collectionHandle ?? "new-arrivals"}`;
}
