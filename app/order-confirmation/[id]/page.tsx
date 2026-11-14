import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TrackPurchase } from "@/components/track-purchase";
import { formatPhone, formatPKR } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { site, whatsappLink } from "@/lib/site";
import { findOrder, paymentLabels, statusLabels } from "@/lib/server-store";
import { btnGhost } from "@/components/styles";

export const metadata: Metadata = pageMeta("Order confirmed", "Your EVOLVE order has been received.", "/order-confirmation");

type Params = Promise<{ id: string }>;

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="px-4 py-16">Loading your order…</p>}>
      <Confirmation params={params} />
    </Suspense>
  );
}

async function Confirmation({ params }: { params: Params }) {
  const { id } = await params;
  const order = await findOrder(id);
  if (!order) notFound();
  const chat = whatsappLink(`Hello EVOLVE, I am writing about order ${order.id}.`);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <TrackPurchase id={order.id} value={order.totals.total} />
      <span className="mb-4 block h-px w-8 bg-accent" />
      <h1 className="font-serif text-5xl">Thank you.</h1>
      <p className="mt-3 text-stone-deep">
        Order {order.id} is {statusLabels[order.status].toLowerCase()}. Payment is {paymentLabels[order.paymentStatus].toLowerCase()}.
      </p>
      {order.paymentMethod === "cod" ? (
        <p className="mt-4 text-sm">We may confirm this Cash on Delivery order on WhatsApp at {formatPhone(order.customer.phone)} before it is packed.</p>
      ) : null}
      {order.paymentMethod === "bank" ? (
        <div className="mt-6 border border-sand p-4 text-sm">
          <p className="text-[12px] uppercase tracking-[0.16em]">Transfer</p>
          <p className="mt-2">{site.bank.name}</p>
          <p>{site.bank.title}</p>
          <p>Account {site.bank.number}</p>
          <p>IBAN {site.bank.iban}</p>
          <p className="mt-2 text-stone-deep">Use {order.id} as the transfer reference. These account details are placeholders until the business account is connected.</p>
        </div>
      ) : null}
      <ul className="mt-8 divide-y divide-sand border-y border-sand">
        {order.lines.map((line) => (
          <li key={line.variantId} className="flex justify-between gap-4 py-3 text-sm">
            <span>
              {line.productTitle} · {line.color} / {line.size} × {line.qty}
            </span>
            <span>{formatPKR(line.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right">Total {formatPKR(order.totals.total)}</p>
      <p className="mt-2 text-sm text-stone-deep">
        Delivering to {order.customer.address}, {order.customer.city}. {order.eta}.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={chat} className={btnGhost} target="_blank" rel="noreferrer">
          Chat about this order
        </a>
        <Link href={`/track-order?order=${order.id}&phone=${order.customer.phone}`} className={btnGhost}>
          Track order
        </Link>
      </div>
    </div>
  );
}
