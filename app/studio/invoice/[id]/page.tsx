import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PrintButton } from "@/components/print-button";
import { formatPKR } from "@/lib/format";
import { adminAuthed, findOrder } from "@/lib/server-store";

export const metadata: Metadata = { title: "Invoice", robots: { index: false, follow: false } };

type Params = Promise<{ id: string }>;

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="px-4 py-16">Preparing the invoice…</p>}>
      <Invoice params={params} />
    </Suspense>
  );
}

async function Invoice({ params }: { params: Params }) {
  if (!(await adminAuthed())) notFound();
  const { id } = await params;
  const order = await findOrder(id);
  if (!order) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-4xl tracking-[0.2em]">EVOLVE</p>
          <p className="text-[12px] uppercase tracking-[0.16em]">Invoice {order.id}</p>
        </div>
        <PrintButton />
      </div>
      <p className="mt-6 text-sm">
        {order.customer.fullName}
        <br />
        {order.customer.phone}
        <br />
        {order.customer.address}, {order.customer.city}, {order.customer.province}
      </p>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-sand">
            <th className="py-2 font-medium">Piece</th>
            <th className="py-2 font-medium">Qty</th>
            <th className="py-2 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => (
            <tr key={line.variantId} className="border-b border-sand">
              <td className="py-2">
                {line.productTitle}
                <span className="block text-stone-deep">
                  {line.color} / {line.size} · {line.sku}
                </span>
              </td>
              <td>{line.qty}</td>
              <td>{formatPKR(line.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-right text-sm">Shipping {formatPKR(order.totals.shipping)}</p>
      <p className="text-right text-sm">COD fee {formatPKR(order.totals.codFee)}</p>
      <p className="text-right">Total {formatPKR(order.totals.total)}</p>
      <p className="mt-2 text-right text-sm text-stone-deep">
        {order.paymentMethod === "cod" ? "Collect on delivery" : order.paymentStatus}
      </p>
    </article>
  );
}
