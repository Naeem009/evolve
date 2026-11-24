import type { Metadata } from "next";
import { HomeRenderer } from "@/components/home/home-renderer";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMeta(
    "Evolve Your Style",
    "Premium co-ord sets, tracksuits, hoodies, sweatshirts and tops for women and men in Pakistan.",
    "/",
  ),
  title: { absolute: "EVOLVE · Evolve Your Style" },
};

export default function HomePage() {
  return <HomeRenderer />;
}
