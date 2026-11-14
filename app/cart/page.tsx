import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("Bag", "Review your EVOLVE bag before checkout.", "/cart");

export default function CartPage() {
  return <CartView />;
}
