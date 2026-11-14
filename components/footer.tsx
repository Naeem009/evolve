import Image from "next/image";
import Link from "next/link";
import { policies } from "@/lib/content";
import { site } from "@/lib/site";
import { NewsletterForm } from "./forms";

const shop = [
  { href: "/collections/new-arrivals", label: "New arrivals" },
  { href: "/shop/women", label: "Women" },
  { href: "/shop/men", label: "Men" },
  { href: "/shop/girls", label: "Girls (10+)" },
  { href: "/collections/sale", label: "Sale" },
];

const help = [
  { href: "/pages/size-guide", label: "Size guide" },
  { href: "/pages/faq", label: "FAQ" },
  { href: "/track-order", label: "Track order" },
  { href: "/pages/contact", label: "Contact" },
  { href: "/account", label: "Account" },
];

export function Footer() {
  return (
    <footer className="no-print border-t border-sand bg-bone">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Image src="/brand/logo.jpg" alt="EVOLVE — Evolve Your Style" width={220} height={120} className="h-auto w-44 bg-bone" />
          <p className="mt-4 max-w-sm text-sm text-stone-deep">
            A clothing house for women, men and girls 10+. Co-ord sets, tracksuits, hoodies, sweatshirts and tops.
          </p>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-[11px] uppercase tracking-[0.18em]">Shop</h2>
          <ul className="mt-4 space-y-2">
            {shop.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-stone-deep hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-[11px] uppercase tracking-[0.18em]">Help</h2>
          <ul className="mt-4 space-y-2">
            {help.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-stone-deep hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-[11px] uppercase tracking-[0.18em]">Policies</h2>
          <ul className="mt-4 space-y-2">
            {policies.map((policy) => (
              <li key={policy.slug}>
                <Link href={`/policies/${policy.slug}`} className="text-sm text-stone-deep hover:text-ink">
                  {policy.title.replace(" Policy", "").replace(" & Conditions", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-[11px] uppercase tracking-[0.18em]">Letters</h2>
          <p className="mt-4 text-sm text-stone-deep">New pieces and the occasional note. No noise.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-sand">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-6 text-[12px] text-stone-deep md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 EVOLVE. Evolve Your Style.</p>
          <div className="flex flex-wrap gap-4">
            <a href={site.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={site.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href={site.tiktok} target="_blank" rel="noreferrer">
              TikTok
            </a>
          </div>
          <p>COD · Visa · Mastercard · JazzCash · Easypaisa · Bank transfer</p>
        </div>
      </div>
    </footer>
  );
}
