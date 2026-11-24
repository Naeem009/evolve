import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AddressForm, SignInForm, SignOutButton } from "@/components/account-forms";
import { ProductGrid } from "@/components/product-card";
import { formatPhone, formatPKR } from "@/lib/format";
import { getProduct } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";
import { getSession, getWishlist, readOrders, statusLabels } from "@/lib/server-store";

export const metadata: Metadata = pageMeta("Account", "Orders, addresses and your EVOLVE wishlist.", "/account");

export default function Page() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-sm text-stone-deep">Opening your account…</p>}>
      <Account />
    </Suspense>
  );
}

async function Account() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-serif text-5xl">Account</h1>
        <p className="mt-3 max-w-lg text-stone-deep">Continue with your name and mobile. Guest checkout still works without this.</p>
        <SignInForm />
      </div>
    );
  }
  const orders = (await readOrders()).filter((order) => order.customer.phone === session.phone);
  const wishlist = (await getWishlist()).map((handle) => getProduct(handle)).filter((product) => product !== undefined);
  return (
    <>
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl">{session.name}</h1>
          <p className="mt-2 text-sm text-stone-deep">{formatPhone(session.phone)}{session.email ? ` · ${session.email}` : ""}</p>
        </div>
        <SignOutButton />
      </div>
      <section className="mt-12">
        <h2 className="font-serif text-4xl">Orders</h2>
        {orders.length === 0 ? <p className="mt-3 text-sm text-stone-deep">No orders for this number yet.</p> : null}
        <ul className="mt-4 divide-y divide-sand border-y border-sand">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
              <span>
                {order.id} · {statusLabels[order.status]}
              </span>
              <span>{formatPKR(order.totals.total)}</span>
              <Link href={`/track-order?order=${order.id}&phone=${order.customer.phone}`} className="underline">
                Track
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-12">
        <h2 className="font-serif text-4xl">Addresses</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {session.addresses.map((address) => (
            <li key={address.id}>
              {address.address}, {address.city}
            </li>
          ))}
        </ul>
        <AddressForm />
      </section>
      <section id="wishlist" className="mt-12">
        <h2 className="font-serif text-4xl">Wishlist</h2>
        {wishlist.length === 0 ? <p className="mt-3 text-sm text-stone-deep">Save a piece from its card or product page.</p> : null}
      </section>
    </div>
    {wishlist.length > 0 ? <ProductGrid products={wishlist} /> : null}
    </>
  );
}
