import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import { pageMeta } from "@/lib/seo";
import { getSession } from "@/lib/server-store";

export const metadata: Metadata = pageMeta("Checkout", "Guest checkout with Cash on Delivery, card or bank transfer.", "/checkout");

export default function Page() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-sm text-stone-deep">Preparing checkout…</p>}>
      <CheckoutScreen />
    </Suspense>
  );
}

async function CheckoutScreen() {
  const session = await getSession();
  return <CheckoutForm session={session} />;
}
