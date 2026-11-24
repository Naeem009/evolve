import Link from "next/link";
import { MessageCircle, Package, RefreshCw, ShieldCheck, Truck, Wallet } from "lucide-react";
import type { HomeSection } from "@/lib/home/schema";

const icons = {
  exchange: RefreshCw,
  cod: Wallet,
  secure: ShieldCheck,
  whatsapp: MessageCircle,
  delivery: Truck,
  track: Package,
} as const;

export function ServicesStrip({ section }: { section: Extract<HomeSection, { type: "services" }> }) {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-12 lg:py-24">
      {section.items.map((item) => {
        const Icon = icons[item.icon as keyof typeof icons] ?? Package;
        const body = (
          <>
            <Icon strokeWidth={1.25} aria-hidden="true" />
            <h2 className="mt-4 text-[12px] uppercase tracking-[0.16em]">{item.title}</h2>
            <p className="mt-2 text-sm text-stone-deep">{item.text}</p>
          </>
        );
        return item.href ? (
          <Link key={item.title} href={item.href} className="border border-sand px-4 py-6">
            {body}
          </Link>
        ) : (
          <div key={item.title} className="border border-sand px-4 py-6">
            {body}
          </div>
        );
      })}
    </section>
  );
}
