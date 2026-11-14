import type { MetadataRoute } from "next";
import { collectionMeta, products } from "@/lib/catalog";
import { infoPages, policies } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/search",
    "/track-order",
    ...collectionMeta.map((collection) => `/collections/${collection.handle}`),
    ...["women", "men", "girls", "unisex"].map((audience) => `/shop/${audience}`),
    ...products.map((product) => `/products/${product.handle}`),
    ...policies.map((policy) => `/policies/${policy.slug}`),
    ...infoPages.map((page) => `/pages/${page.slug}`),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path || "/"}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
