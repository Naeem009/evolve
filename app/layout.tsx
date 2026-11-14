import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Suspense } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { CartSync } from "@/components/cart-sync";
import { ConsentBanner } from "@/components/consent-banner";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { HeaderFallback, Navigation } from "@/components/navigation";
import { Providers } from "@/components/providers";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "EVOLVE · Evolve Your Style",
    template: "%s · EVOLVE",
  },
  description: site.description,
  openGraph: {
    siteName: "EVOLVE",
    type: "website",
    locale: "en_PK",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bone font-sans text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-bone focus:px-3 focus:py-2">
          Skip to content
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "EVOLVE",
            url: site.url,
            slogan: site.tagline,
            email: site.email,
            logo: `${site.url}/brand/logo.jpg`,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "EVOLVE",
            url: site.url,
            potentialAction: {
              "@type": "SearchAction",
              target: `${site.url}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <Providers>
          <Suspense fallback={<HeaderFallback />}>
            <Navigation />
          </Suspense>
          <main id="main" className="flex-1 pb-20 lg:pb-0">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Suspense fallback={null}>
            <WhatsAppButton />
          </Suspense>
          <ConsentBanner />
          <Suspense fallback={null}>
            <CartSync />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
