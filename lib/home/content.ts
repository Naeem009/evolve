import { categories, products } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { site } from "@/lib/site";
import type { Category } from "@/lib/types";
import { homeSectionSchema, type HomePage, type HomeSection, type ImageAsset } from "./schema";

function crop(id: string, width: number, height: number): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=75`;
}

function editorial(id: string, alt: string): ImageAsset {
  return {
    desktopUrl: crop(id, 2400, 1200),
    mobileUrl: crop(id, 1440, 1800),
    alt,
  };
}

function portrait(id: string, alt: string): ImageAsset {
  const url = crop(id, 1200, 1500);
  return { desktopUrl: url, mobileUrl: url, alt };
}

function productShot(handle: string): ImageAsset {
  const product = products.find((item) => item.handle === handle);
  const image = product?.images[0];
  const src = image?.src || portrait("photo-1441984904996-e0b6ba687e04", "EVOLVE studio").desktopUrl;
  return { desktopUrl: src, mobileUrl: src, alt: image?.alt || product?.title || "EVOLVE" };
}

function categoryTile(handle: Category) {
  const category = categories.find((item) => item.handle === handle);
  const product = products.find((item) => item.category === handle);
  const image = product?.images[0];
  return {
    label: category?.title ?? handle,
    href: `/collections/${handle}`,
    image: {
      desktopUrl: image?.src || productShot(handle).desktopUrl,
      mobileUrl: image?.src || productShot(handle).mobileUrl,
      alt: image?.alt || category?.title || handle,
    },
  };
}

const shopWomen = { label: "Shop Women", href: "/shop/women", style: "solid" as const };
const shopMen = { label: "Shop Men", href: "/shop/men", style: "outline" as const };

const publishedReviews = products
  .flatMap((product) =>
    product.reviews
      .filter((review) => review.status === "published")
      .map((review) => ({ quote: review.text, author: review.author, product: product.title })),
  )
  .slice(0, 3);

const draftSections = [
  {
    type: "announcement" as const,
    order: 0,
    enabled: true,
    messages: [
      "Cash on delivery across Pakistan",
      `Free delivery over ${formatPKR(site.freeShippingThreshold)}`,
      `${site.exchangeWindowDays}-day easy exchange`,
    ],
  },
  {
    type: "hero" as const,
    order: 1,
    enabled: true,
    slides: [
      {
        eyebrow: "The Co-ord Edit",
        title: "Cut from the same cloth.",
        subtitle: "Shirt and trouser, considered together. For women and men.",
        image: editorial("photo-1469334031218-e382a71b716b", "Editorial portrait in a structured neutral outfit"),
        ctas: [shopWomen, shopMen],
        textAlign: "left" as const,
      },
      {
        eyebrow: "New arrivals",
        title: "Ease, with a tailored line.",
        subtitle: "Tracksuits and hoodies in heavy cloth. Nothing loud. Nothing wasted.",
        image: editorial("photo-1539109136881-3be0616acf4b", "A model walking in a light contemporary set"),
        ctas: [shopWomen, shopMen],
        textAlign: "left" as const,
      },
      {
        eyebrow: "Winter essentials",
        title: "Fleece, loopback, quiet colour.",
        subtitle: "The layers we wear from the first cool evening through the new year.",
        image: editorial("photo-1445205170230-053b83016050", "A warm studio rail of clothing"),
        ctas: [shopWomen, shopMen],
        textAlign: "left" as const,
      },
    ],
  },
  {
    type: "categoryTiles" as const,
    order: 2,
    enabled: true,
    tiles: (["co-ord-sets", "tracksuits", "hoodies", "sweatshirts", "tops"] as Category[]).map(categoryTile),
  },
  {
    type: "productRail" as const,
    order: 3,
    enabled: true,
    title: "New Arrivals",
    source: "new" as const,
    limit: 9,
    layout: "grid" as const,
    listName: "home_new_arrivals",
  },
  {
    type: "statement" as const,
    order: 4,
    enabled: true,
    text: "Clothes cut to be worn hard, and still look considered.",
    link: { label: "Read the house", href: "/pages/about", style: "text" as const },
  },
  {
    type: "campaignBanner" as const,
    order: 5,
    enabled: true,
    height: "lg" as const,
    video: "/video/winter-garments.mp4",
    slide: {
      eyebrow: "The season",
      title: "Winter essentials.",
      subtitle: "Hoodies and sweatshirts in ink, sand, forest and ivory.",
      image: editorial("photo-1483985988355-763728e1935b", "Contemporary outfit in city light"),
      ctas: [shopWomen, shopMen],
      textAlign: "left" as const,
    },
  },
  {
    type: "splitBanners" as const,
    order: 6,
    enabled: true,
    items: [
      {
        label: "For Her",
        promise: "Co-ords, tracksuits and layers with a clean line.",
        image: portrait("photo-1539109136881-3be0616acf4b", "Women's tailoring in muted light"),
        primary: { label: "Shop now", href: "/shop/women", style: "solid" as const },
        secondary: { label: "Discover more", href: "/collections/co-ord-sets", style: "text" as const },
      },
      {
        label: "For Him",
        promise: "Straight fits, deep colours, no excess.",
        image: portrait("photo-1617137968427-85924c800a22", "Men's dark layered clothing"),
        primary: { label: "Shop now", href: "/shop/men", style: "solid" as const },
        secondary: { label: "Discover more", href: "/collections/hoodies", style: "text" as const },
      },
    ],
  },
  {
    type: "productRail" as const,
    order: 7,
    enabled: true,
    title: "Bestsellers",
    source: "bestsellers" as const,
    limit: 3,
    layout: "grid" as const,
    listName: "home_bestsellers",
  },
  {
    type: "highlights" as const,
    order: 8,
    enabled: true,
    tiles: [
      { title: "The Co-ord Edit", href: "/collections/co-ord-sets", image: productShot("nova-coord-set") },
      { title: "New arrivals", href: "/collections/new-arrivals", image: productShot("ease-top") },
      { title: "Under Rs 5,000", href: "/shop/women?max=5000", image: productShot("solene-top") },
      { title: "Winter layers", href: "/collections/hoodies", image: productShot("sable-hoodie") },
      { title: "Tracksuits", href: "/collections/tracksuits", image: productShot("atlas-tracksuit") },
      { title: "The sale edit", href: "/collections/sale", image: productShot("ivory-sweatshirt") },
    ],
  },
  {
    type: "story" as const,
    order: 9,
    enabled: true,
    heading: "Evolve your style.",
    image: editorial("photo-1441984904996-e0b6ba687e04", "A quiet clothing studio with garments on rails"),
    body: [
      "EVOLVE is a clothing house in Pakistan for women and men who want a wardrobe that can be worn hard and still look considered. We cut [co-ord sets for women](/shop/women?category=co-ord-sets) and the men’s line from the same cloth, so a shirt and a trouser belong together and still stand on their own.",
      "[Tracksuits](/collections/tracksuits) keep a tailored line without the shine of a gym floor. [Unisex hoodies](/collections/hoodies) and sweatshirts are heavy where it matters and quiet in colour: sand, ink, ivory and forest. The [tops](/collections/tops) are the layer the rest of the outfit depends on. Nothing in the house is built to shout.",
      "Start with a co-ord or a hoodie, then add a top. Every piece sits next to the size guide, and an exchange stays open for seven days while the tags are on.",
    ].join("\n\n"),
  },
  {
    type: "social" as const,
    order: 10,
    enabled: true,
    instagramHandle: site.instagram,
    images: [
      portrait("photo-1469334031218-e382a71b716b", "Archive portrait, sand tailoring"),
      portrait("photo-1552374196-1ab2a1c593e8", "Archive portrait, dark layers"),
      portrait("photo-1445205170230-053b83016050", "Studio rail"),
      portrait("photo-1496747611176-843222e1e57c", "Outdoor editorial in neutral cloth"),
      portrait("photo-1509631179647-0177331693ae", "Pale layered clothing"),
      portrait("photo-1556821840-3a63f95609a7", "Folded heavyweight hoodie"),
    ],
    reviews: publishedReviews,
  },
  {
    type: "circle" as const,
    order: 11,
    enabled: true,
    heading: "EVOLVE Circle",
    body: "Join for early word on new drops. We write rarely, and only about the clothes.",
  },
  {
    type: "services" as const,
    order: 12,
    enabled: true,
    items: [
      { icon: "exchange", title: "Easy exchange", text: `${site.exchangeWindowDays} days, tags on`, href: "/policies/exchange" },
      { icon: "cod", title: "Cash on delivery", text: "Confirmed before dispatch", href: "/policies/cod" },
      { icon: "secure", title: "Secure payments", text: "No card data stored here", href: "/policies/cod" },
      { icon: "whatsapp", title: "WhatsApp support", text: site.supportHours, href: "/pages/contact" },
      { icon: "delivery", title: "Free delivery", text: `Over ${formatPKR(site.freeShippingThreshold)}`, href: "/policies/shipping" },
      { icon: "track", title: "Track your order", text: "Order number and mobile", href: "/track-order" },
    ],
  },
  {
    type: "newsletter" as const,
    order: 13,
    enabled: true,
    heading: "Stay in touch",
  },
];

function readSections(input: unknown[]): HomeSection[] {
  const sections: HomeSection[] = [];
  for (const section of input) {
    const parsed = homeSectionSchema.safeParse(section);
    if (!parsed.success) {
      console.error(parsed.error.issues);
      continue;
    }
    if (parsed.data.enabled) sections.push(parsed.data);
  }
  return sections.sort((a, b) => a.order - b.order);
}

export function getHomePage(): HomePage {
  return { sections: readSections(draftSections) };
}

export function homeChrome(): { messages: string[]; overlayHero: boolean } {
  const sections = getHomePage().sections;
  const announcement = sections.find((section) => section.type === "announcement");
  const first = sections.find((section) => section.type !== "announcement");
  return {
    messages: announcement?.type === "announcement" ? announcement.messages : [],
    overlayHero: first?.type === "hero",
  };
}
