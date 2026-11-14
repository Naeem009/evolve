"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { categories, collectionMeta, searchProducts } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { useShop } from "./providers";

const links = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  {
    label: "Women",
    href: "/shop/women",
    items: categories.map((item) => ({
      label: item.title,
      href: `/shop/women?category=${item.handle}`,
    })),
  },
  {
    label: "Men",
    href: "/shop/men",
    items: categories.map((item) => ({
      label: item.title,
      href: `/shop/men?category=${item.handle}`,
    })),
  },
  {
    label: "Girls (10+)",
    href: "/shop/girls",
    items: categories.map((item) => ({
      label: item.title,
      href: `/shop/girls?category=${item.handle}`,
    })),
  },
  {
    label: "Collections",
    href: "/collections/co-ord-sets",
    items: collectionMeta.map((item) => ({
      label: item.title,
      href: `/collections/${item.handle}`,
    })),
  },
  { label: "Sale", href: "/collections/sale" },
  { label: "About", href: "/pages/about" },
];

export function HeaderFallback() {
  return (
    <div className="border-b border-sand bg-bone">
      <div className="h-9 bg-ink" />
      <div className="mx-auto h-16 max-w-[1440px]" />
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, setDrawerOpen } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [path, setPath] = useState(pathname);

  if (path !== pathname) {
    setPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
    setDrawerOpen(false);
  }

  const count = cart?.count ?? 0;
  const suggestions = query.trim().length > 1 ? searchProducts(query).slice(0, 6) : [];

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      <header className="no-print sticky top-0 z-40 border-b border-sand bg-bone/95 backdrop-blur">
        <div className="bg-ink px-4 py-2 text-center text-[11px] uppercase tracking-[0.16em] text-bone">
          Free delivery over PKR 8,000 · Cash on Delivery available
        </div>
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-8">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu strokeWidth={1.25} />
          </button>
          <Link href="/" className="font-serif text-[28px] leading-none tracking-[0.28em] text-ink">
            EVOLVE
          </Link>
          <nav className="ml-6 hidden items-center gap-6 lg:flex" aria-label="Primary">
            {links.map((link) =>
              link.items ? (
                <div key={link.label} className="group relative">
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-[12px] uppercase tracking-[0.16em]"
                  >
                    {link.label}
                  </Link>
                  <div className="invisible absolute top-full left-0 z-20 hidden pt-2 group-hover:visible group-hover:block group-focus-within:visible group-focus-within:block">
                    <div className="min-w-56 border border-sand bg-bone p-4 shadow-none">
                      {link.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block py-2 text-[13px] tracking-wide text-stone-deep hover:text-ink"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[12px] uppercase tracking-[0.16em]"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
          <div className="ml-auto flex items-center">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
            >
              <Search strokeWidth={1.25} />
            </button>
            <Link href="/account" className="inline-flex h-11 w-11 items-center justify-center" aria-label="Account">
              <User strokeWidth={1.25} />
            </Link>
            <Link
              href="/account#wishlist"
              className="relative inline-flex h-11 w-11 items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart strokeWidth={1.25} />
              {wishlist.length > 0 ? (
                <span className="absolute top-1 right-0 text-[10px]">{wishlist.length}</span>
              ) : null}
            </Link>
            <button
              type="button"
              className="relative inline-flex h-11 w-11 items-center justify-center"
              aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
              onClick={() => setDrawerOpen(true)}
            >
              <ShoppingBag strokeWidth={1.25} />
              <span className="absolute top-1 right-0 text-[10px]">{count}</span>
            </button>
          </div>
        </div>
        {searchOpen ? (
          <div className="border-t border-sand bg-bone">
            <form onSubmit={onSearch} className="mx-auto max-w-[1440px] px-4 py-4 md:px-8">
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-stone-deep" htmlFor="site-search">
                Search the house
              </label>
              <input
                id="site-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Co-ord, hoodie, sand…"
                className="min-h-11 w-full border border-sand bg-bone px-3 text-base"
                autoFocus
              />
              {suggestions.length > 0 ? (
                <ul className="mt-3 divide-y divide-sand border border-sand">
                  {suggestions.map((product) => (
                    <li key={product.handle}>
                      <Link
                        href={`/products/${product.handle}`}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-sand/60"
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className="relative h-14 w-11 shrink-0 bg-sand">
                          <Image src={product.images[0]?.src ?? ""} alt="" fill className="object-cover" sizes="44px" />
                        </span>
                        <span>
                          <span className="block text-sm">{product.title}</span>
                          <span className="text-[12px] text-stone-deep">{formatPKR(product.price)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </form>
          </div>
        ) : null}
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-bone lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-serif text-[28px] tracking-[0.28em]">EVOLVE</span>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X strokeWidth={1.25} />
            </button>
          </div>
          <nav className="flex flex-col px-6" aria-label="Mobile">
            {links.map((link) =>
              link.items ? (
                <details key={link.label} className="border-b border-sand">
                  <summary className="flex min-h-12 items-center text-[14px] uppercase tracking-[0.16em]">
                    {link.label}
                  </summary>
                  <div className="pb-3">
                    <Link href={link.href} className="block py-2 text-sm text-stone-deep" onClick={() => setMenuOpen(false)}>
                      Shop all
                    </Link>
                    {link.items.map((item) => (
                      <Link key={item.href} href={item.href} className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex min-h-12 items-center border-b border-sand text-[14px] uppercase tracking-[0.16em]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      ) : null}

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-sand bg-bone lg:hidden"
        aria-label="Mobile"
      >
        <Link href="/" className="flex min-h-14 flex-col items-center justify-center text-[10px] uppercase tracking-[0.12em]">
          Home
        </Link>
        <button type="button" className="flex min-h-14 flex-col items-center justify-center text-[10px] uppercase tracking-[0.12em]" onClick={() => setSearchOpen(true)}>
          Search
        </button>
        <button type="button" className="flex min-h-14 flex-col items-center justify-center text-[10px] uppercase tracking-[0.12em]" onClick={() => setMenuOpen(true)}>
          Shop
        </button>
        <Link href="/account" className="flex min-h-14 flex-col items-center justify-center text-[10px] uppercase tracking-[0.12em]">
          Account
        </Link>
        <button type="button" className="flex min-h-14 flex-col items-center justify-center text-[10px] uppercase tracking-[0.12em]" onClick={() => setDrawerOpen(true)}>
          Bag{count > 0 ? ` (${count})` : ""}
        </button>
      </nav>
    </>
  );
}
