import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PayButton } from "@/components/pay-button";
import { formatPKR } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { findOrder } from "@/lib/server-store";

export const metadata: Metadata = pageMeta("Secure payment", "Sandbox hosted payment for an EVOLVE order.", "/checkout/pay");

type Params = Promise<{ id: string }>;

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="px-4 py-16">Opening the payment page…</p>}>
      <Pay params={params} />
    </Suspense>
  );
}

async function Pay({ params }: { params: Params }) {
  const { id } = await params;
  const order = await findOrder(id);
  if (!order) notFound();
  if (order.paymentMethod !== "card") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <p>This order does not use card payment.</p>
        <Link href={`/order-confirmation/${order.id}`} className="mt-4 inline-block underline">
          View the order
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-deep">Hosted payment · sandbox</p>
      <h1 className="mt-3 font-serif text-5xl">Pay EVOLVE</h1>
      <p className="mt-4 text-sm text-stone-deep">
        This stand-in is where Safepay or PayFast will sit. No card number is asked for, and nothing is stored on our server.
      </p>
      <p className="mt-6 text-lg">{formatPKR(order.totals.total)}</p>
      <p className="text-sm text-stone-deep">Order {order.id}</p>
      {order.paymentStatus === "paid" ? (
        <Link href={`/order-confirmation/${order.id}`} className="mt-6 inline-block underline">
          Payment received. View the order.
        </Link>
      ) : (
        <PayButton orderId={order.id} />
      )}
    </div>
  );
}
