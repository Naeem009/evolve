function resolveSiteUrl(): string {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const local = !configured || /localhost|127\.0\.0\.1/i.test(configured);
  if (process.env.NODE_ENV === "production" && local) {
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
    if (host) return `https://${host.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }
  return configured || "http://localhost:3000";
}

export const site = {
  name: "EVOLVE",
  tagline: "Evolve Your Style",
  description:
    "EVOLVE is a premium unisex clothing house in Pakistan. Co-ord sets, tracksuits, hoodies, sweatshirts and tops for women and men.",
  url: resolveSiteUrl(),
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567").replace(/\D/g, ""),
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@evolve.pk",
  address: process.env.NEXT_PUBLIC_STUDIO_ADDRESS || "",
  helpline: process.env.NEXT_PUBLIC_HELPLINE || "",
  freeShippingThreshold: 8000,
  codFee: 150,
  codMax: 50000,
  exchangeWindowDays: 7,
  supportHours: "11:00–20:00 PKT, every day",
  replyMinutes: 30,
  bank: {
    name: "Meezan Bank",
    title: "EVOLVE (replace with your account title)",
    number: "0000-0000000000",
    iban: "PK00MEZN0000000000000000",
  },
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const couriers = [
  "Leopards",
  "TCS",
  "Trax",
  "PostEx",
  "M&P",
  "Call Courier",
] as const;
