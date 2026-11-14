import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { moderateReview, studioUpdate } from "@/app/actions";
import { StudioLogin, StudioLogout } from "@/components/studio-login";
import { field } from "@/components/styles";
import { formatPKR } from "@/lib/format";
import { couriers } from "@/lib/site";
import { adminAuthed, paymentLabels, pendingReviews, readOrders, statusLabels } from "@/lib/server-store";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

const statuses = Object.keys(statusLabels) as OrderStatus[];
const payments = Object.keys(paymentLabels) as PaymentStatus[];

export default function Page() {
  return (
    <Suspense fallback={<p className="px-4 py-16">Opening the studio…</p>}>
      <Studio />
    </Suspense>
  );
}

async function Studio() {
  if (!process.env.ADMIN_PASSWORD) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-serif text-5xl">Studio</h1>
        <p className="mt-4 text-sm">Set ADMIN_PASSWORD in the environment before this desk will open.</p>
      </div>
    );
  }
  if (!(await adminAuthed())) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-serif text-5xl">Studio</h1>
        <StudioLogin />
      </div>
    );
  }
  const orders = await readOrders();
  const reviews = await pendingReviews();
  const sales = orders
    .filter((order) => !["cancelled", "refunded"].includes(order.status))
    .reduce((sum, order) => sum + order.totals.total, 0);
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl">Studio</h1>
          <p className="mt-2 text-sm text-stone-deep">
            {orders.length} orders · {formatPKR(sales)} recorded
          </p>
        </div>
        <StudioLogout />
      </div>
      <div className="mt-8 space-y-8">
        {orders.length === 0 ? <p className="text-sm text-stone-deep">No orders yet.</p> : null}
        {orders.map((order) => (
          <form key={order.id} action={studioUpdate} className="border border-sand p-4">
            <input type="hidden" name="id" value={order.id} />
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-serif text-3xl">{order.id}</h2>
              <Link href={`/studio/invoice/${order.id}`} className="text-[12px] uppercase tracking-[0.14em] underline">
                Invoice
              </Link>
            </div>
            <p className="mt-1 text-sm text-stone-deep">
              {order.customer.fullName} · {order.customer.phone} · {order.customer.city} · {order.paymentMethod} · {formatPKR(order.totals.total)}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <select name="status" defaultValue={order.status} className={field}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
              <select name="paymentStatus" defaultValue={order.paymentStatus} className={field}>
                {payments.map((status) => (
                  <option key={status} value={status}>
                    {paymentLabels[status]}
                  </option>
                ))}
              </select>
              <select name="courier" defaultValue={order.courier ?? ""} className={field}>
                <option value="">Courier</option>
                {couriers.map((courier) => (
                  <option key={courier}>{courier}</option>
                ))}
              </select>
              <input name="trackingNo" defaultValue={order.trackingNo ?? ""} placeholder="Tracking number" className={field} />
            </div>
            <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="codConfirmed" defaultChecked={order.codConfirmed} />
              COD confirmed
            </label>
            <textarea name="internalNotes" defaultValue={order.internalNotes ?? ""} rows={2} placeholder="Internal notes" className={`${field} mt-3 py-2`} />
            <button className="mt-3 min-h-11 text-[12px] uppercase tracking-[0.16em] underline" type="submit">
              Save order
            </button>
          </form>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="font-serif text-4xl">Reviews waiting</h2>
        {reviews.length === 0 ? <p className="mt-3 text-sm text-stone-deep">None.</p> : null}
        <ul className="mt-4 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border border-sand p-4 text-sm">
              <p>
                {review.author} · {review.rating}/5 · {review.productHandle}
              </p>
              <p className="mt-2">{review.text}</p>
              <div className="mt-3 flex gap-2">
                <form action={moderateReview}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="decision" value="published" />
                  <button className="min-h-11 px-3 text-[12px] uppercase tracking-[0.14em]" type="submit">
                    Publish
                  </button>
                </form>
                <form action={moderateReview}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="decision" value="rejected" />
                  <button className="min-h-11 px-3 text-[12px] uppercase tracking-[0.14em]" type="submit">
                    Decline
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
