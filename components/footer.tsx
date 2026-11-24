import Image from "next/image";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

const shop = [
  { href: "/collections/new-arrivals", label: "New arrivals" },
  { href: "/shop/women", label: "Women" },
  { href: "/shop/men", label: "Men" },
  { href: "/collections/sale", label: "Sale" },
];

const help = [
  { href: "/pages/size-guide", label: "Size guide" },
  { href: "/pages/faq", label: "FAQ" },
  { href: "/track-order", label: "Track order" },
  { href: "/pages/contact", label: "Contact" },
  { href: "/account", label: "Account" },
];

const information = [
  { href: "/pages/about", label: "About" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/exchange", label: "Exchange" },
  { href: "/policies/returns", label: "Returns" },
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/terms", label: "Terms" },
  { href: "/policies/cod", label: "Cash on delivery" },
  { href: "/policies/cod", label: "Payment methods" },
];

const social = [
  { href: site.instagram, label: "Instagram" },
  { href: site.facebook, label: "Facebook" },
  { href: site.tiktok, label: "TikTok" },
  { href: site.youtube, label: "YouTube" },
];

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="min-w-0">
      <h2 className="text-[11px] uppercase tracking-[0.18em]">{title}</h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={title + link.label}>
            <Link href={link.href} className={`text-sm hover:text-ink ${link.href === "/collections/sale" ? "text-sale" : "text-stone-deep"}`}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const helpline = site.helpline ? `tel:${site.helpline.replace(/\s/g, "")}` : whatsappLink("Hello EVOLVE, I have a question.");
  return (
    <footer className="no-print border-t border-sand bg-bone">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 md:px-6 lg:grid-cols-12 lg:px-12">
        <div className="min-w-0 lg:col-span-3">
          <Image src="/brand/logo.jpg" alt="EVOLVE — Evolve Your Style" width={220} height={120} className="h-auto w-44 bg-bone" />
          <p className="mt-4 text-sm tracking-[0.14em] uppercase">Evolve Your Style</p>
          <p className="mt-3 max-w-sm text-sm text-stone-deep">A clothing house for women and men. Co-ord sets, tracksuits, hoodies, sweatshirts and tops.</p>
        </div>
        <div className="lg:col-span-2">
          <Column title="Shop" links={shop} />
        </div>
        <div className="lg:col-span-2">
          <Column title="Help" links={help} />
        </div>
        <div className="lg:col-span-2">
          <Column title="Information" links={information} />
        </div>
        <div className="min-w-0 lg:col-span-3">
          <h2 className="text-[11px] uppercase tracking-[0.18em]">Contact</h2>
          <ul className="mt-4 space-y-2 text-sm text-stone-deep">
            <li>{site.address || "Pakistan"}</li>
            <li>
              <a href={helpline} className="hover:text-ink">
                {site.helpline || "WhatsApp"}
              </a>
            </li>
            <li>
              <a href={whatsappLink("Hello EVOLVE")} className="hover:text-ink">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="break-all hover:text-ink">
                {site.email}
              </a>
            </li>
            <li>{site.supportHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-6 text-[12px] text-stone-deep md:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p>© 2026 EVOLVE. Evolve Your Style.</p>
          <div className="flex flex-wrap gap-4">
            {social.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
          <p>COD · Visa · Mastercard · JazzCash · Easypaisa · Bank transfer</p>
        </div>
      </div>
    </footer>
  );
}
