export const site = {
  name: "EVOLVE",
  tagline: "Evolve Your Style",
  description:
    "EVOLVE is a premium unisex clothing house in Pakistan. Co-ord sets, tracksuits, hoodies, sweatshirts and tops for women, men and girls 10+.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567").replace(
    /\D/g,
    "",
  ),
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@evolve.pk",
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
