import type { Metadata } from "next";
import { Suspense } from "react";
import { ReturnForm } from "@/components/return-form";
import { btn, field, labelCls } from "@/components/styles";
import { normalizePhone, formatPKR } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { findOrder, statusLabels } from "@/lib/server-store";

export const metadata: Metadata = pageMeta("Track order", "Look up an EVOLVE order with your order number and mobile.", "/track-order");

type Search = Promise<Record<string, string | string[] | undefined>>;

export default function Page({ searchParams }: { searchParams: Search }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-5xl">Track an order</h1>
      <p className="mt-3 text-stone-deep">Use the order number and the mobile number from checkout.</p>
      <form className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" method="get">
        <label>
          <span className={labelCls}>Order number</span>
          <input name="order" className={field} placeholder="EVL-…" />
        </label>
        <label>
          <span className={labelCls}>Mobile</span>
          <input name="phone" className={field} placeholder="03XXXXXXXXX" />
        </label>
        <button className={btn} type="submit">
          Look up
        </button>
      </form>
      <Suspense fallback={<p className="mt-8 text-sm text-stone-deep">Checking…</p>}>
        <Result searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Result({ searchParams }: { searchParams: Search }) {
  const search = await searchParams;
  const orderId = typeof search.order === "string" ? search.order.trim() : "";
  const phone = typeof search.phone === "string" ? normalizePhone(search.phone) : null;
  if (!orderId && !search.phone) return null;
  const order = orderId ? await findOrder(orderId) : undefined;
  if (!order || !phone || order.customer.phone !== phone) {
    return <p className="mt-8 text-sm">Those details do not match an order.</p>;
  }
  const steps = ["pending_confirmation", "confirmed", "packed", "dispatched", "delivered", "completed"] as const;
  const current = steps.indexOf(order.status as (typeof steps)[number]);
  return (
    <div className="mt-10 border border-sand p-5">
      <p className="text-[12px] uppercase tracking-[0.16em]">{order.id}</p>
      <h2 className="mt-2 font-serif text-4xl">{statusLabels[order.status]}</h2>
      {order.trackingNo ? (
        <p className="mt-2 text-sm">
          {order.courier ?? "Courier"} · {order.trackingNo}
        </p>
      ) : (
        <p className="mt-2 text-sm text-stone-deep">A tracking number appears here once the parcel is booked.</p>
      )}
      <ol className="mt-6 space-y-2">
        {steps.map((step, index) => (
          <li key={step} className={index <= current ? "text-ink" : "text-stone"}>
            {statusLabels[step]}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm">Total {formatPKR(order.totals.total)} · {order.customer.city}</p>
      <h3 className="mt-8 font-serif text-3xl">Exchange or refund</h3>
      {order.returnRequest ? (
        <p className="mt-2 text-sm">A {order.returnRequest.type} request is {order.returnRequest.status}.</p>
      ) : (
        <ReturnForm orderId={order.id} phone={order.customer.phone} />
      )}
    </div>
  );
}
