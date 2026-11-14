"use client";

import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";

export function WhatsAppButton() {
  const pathname = usePathname();
  const message = `Hello EVOLVE, I am on ${site.url}${pathname} and I have a question.`;
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noreferrer"
      className="no-print fixed right-4 bottom-20 z-30 inline-flex min-h-11 items-center bg-success px-4 text-[12px] uppercase tracking-[0.14em] text-bone lg:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      WhatsApp
    </a>
  );
}
