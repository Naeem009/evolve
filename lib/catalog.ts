import type {
  Audience,
  Badge,
  Category,
  Product,
  Review,
  Variant,
} from "./types";

const ADULT = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const sand = { name: "Sand", hex: "#CDBBA4", code: "SND" };
const ink = { name: "Ink", hex: "#1C1C1C", code: "INK" };
const ivory = { name: "Ivory", hex: "#F3EFE6", code: "IVR" };
const olive = { name: "Olive", hex: "#6B705C", code: "OLV" };
const cocoa = { name: "Cocoa", hex: "#6B4F3A", code: "COC" };
const navy = { name: "Navy", hex: "#1E2A3A", code: "NVY" };
const blush = { name: "Blush", hex: "#C9A7A0", code: "BLS" };
const forest = { name: "Forest", hex: "#2F4F45", code: "FOR" };

function photo(id: string, alt: string) {
  return {
    src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=75`,
    alt,
  };
}

function variants(
  code: string,
  colors: { name: string; hex: string; code: string }[],
  sizes: readonly string[],
  options?: { soldOut?: string[]; low?: string[] },
): Variant[] {
  return colors.flatMap((color) =>
    sizes.map((size) => {
      const key = `${color.code}-${size}`;
      const stock = options?.soldOut?.includes(color.code)
        ? 0
        : options?.low?.includes(key)
          ? 2
          : 10;
      return {
        id: `${code}-${color.code}-${size}`,
        sku: `EVL-${code}-${color.code}-${size}`,
        size,
        color: color.name,
        colorHex: color.hex,
        stock,
      };
    }),
  );
}

function review(
  handle: string,
  id: string,
  author: string,
  rating: number,
  text: string,
): Review {
  return {
    id,
    productHandle: handle,
    author,
    rating,
    text,
    verified: true,
    status: "published",
    createdAt: "2026-10-12",
  };
}

type Draft = {
  handle: string;
  code: string;
  title: string;
  category: Category;
  audience: Audience;
  price: number;
  compareAtPrice?: number;
  fabric: string;
  care: string;
  colors: { name: string; hex: string; code: string }[];
  sizes: readonly string[];
  soldOut?: string[];
  low?: string[];
  badges: Badge[];
  sales30d: number;
  createdAt: string;
  description: string;
  details: string[];
  fitNotes: string;
  modelInfo: string;
  images: Product["images"];
  reviews?: Review[];
};

function product(draft: Draft): Product {
  return {
    id: draft.code,
    handle: draft.handle,
    title: draft.title,
    category: draft.category,
    audience: draft.audience,
    price: draft.price,
    compareAtPrice: draft.compareAtPrice,
    fabric: draft.fabric,
    care: draft.care,
    fitNotes: draft.fitNotes,
    modelInfo: draft.modelInfo,
    description: draft.description,
    details: draft.details,
    badges: draft.badges,
    images: draft.images,
    variants: variants(draft.code, draft.colors, draft.sizes, {
      soldOut: draft.soldOut,
      low: draft.low,
    }),
    sales30d: draft.sales30d,
    createdAt: draft.createdAt,
    reviews: draft.reviews ?? [],
  };
}

const terryCare = "Machine wash cold with similar colours. Do not tumble dry. Iron on low.";
const fleeceCare = "Machine wash cold inside out. Dry flat. Do not iron the print or rib.";

export const products: Product[] = [
  product({
    handle: "nova-coord-set",
    code: "COD-001",
    title: "Nova Co-ord Set",
    category: "co-ord-sets",
    audience: "women",
    price: 12900,
    compareAtPrice: 15500,
    fabric: "French terry",
    care: terryCare,
    colors: [sand, ink],
    sizes: ADULT,
    low: ["SND-XS"],
    badges: ["bestseller", "sale"],
    sales30d: 86,
    createdAt: "2026-09-12",
    description:
      "A relaxed co-ord in a warm neutral. The shirt falls straight and the trouser is easy through the leg, cut to wear together or apart.",
    details: ["Shirt and straight trouser", "French terry, 280 gsm", "Side pockets", "Elasticated waist with an inner drawcord"],
    fitNotes: "Relaxed through the body. If you prefer a closer fit, take one size down.",
    modelInfo: "Model is 5'8\" and wears S.",
    images: [
      photo("photo-1515886657613-9f3515b0c78f", "Woman in a tailored neutral co-ord, standing in soft daylight"),
      photo("photo-1469334031218-e382a71b716b", "Editorial portrait in a structured sand outfit"),
      photo("photo-1496747611176-843222e1e57c", "Close view of a flowing neutral outfit outdoors"),
    ],
    reviews: [
      review("nova-coord-set", "r1", "Ayesha K.", 5, "The weight of the fabric feels considered, and the sand colour is exactly as photographed."),
      review("nova-coord-set", "r2", "Hira M.", 4, "True to the size chart. I took S and the trouser length is right for 5'5\"."),
    ],
  }),
  product({
    handle: "lumen-coord-set",
    code: "COD-002",
    title: "Lumen Co-ord Set",
    category: "co-ord-sets",
    audience: "women",
    price: 11800,
    fabric: "Woven viscose",
    care: "Dry clean, or cold hand wash and hang dry. Iron on reverse.",
    colors: [ivory, blush],
    sizes: ADULT,
    badges: ["new"],
    sales30d: 24,
    createdAt: "2026-10-20",
    description:
      "A lighter co-ord with a soft drape. The ivory set is quiet enough for the day and considered enough for the evening.",
    details: ["Camp-collar shirt", "Fluid wide trouser", "Woven viscose", "Covered buttons"],
    fitNotes: "Fluid, not oversized. The trouser sits at the natural waist.",
    modelInfo: "Model is 5'7\" and wears M.",
    images: [
      photo("photo-1509631179647-0177331693ae", "Fashion portrait in pale layered clothing"),
      photo("photo-1469334031218-e382a71b716b", "Editorial portrait in a structured light outfit"),
    ],
    reviews: [
      review("lumen-coord-set", "r3", "Maham S.", 5, "Beautiful drape. It does not cling, and the blush tone is muted rather than sweet."),
    ],
  }),
  product({
    handle: "aria-tracksuit",
    code: "TRK-001",
    title: "Aria Tracksuit",
    category: "tracksuits",
    audience: "women",
    price: 14900,
    fabric: "French terry",
    care: terryCare,
    colors: [olive, cocoa],
    sizes: ADULT,
    badges: ["bestseller"],
    sales30d: 64,
    createdAt: "2026-08-02",
    description:
      "A tracksuit with the ease of loungewear and the line of tailoring. Clean seams, no branding across the chest, and a trouser that stacks neatly.",
    details: ["Zip hoodie and tapered trouser", "French terry, 320 gsm", "Rib cuffs and hem", "Zip pockets"],
    fitNotes: "The trouser is tapered from the knee. Order your usual size.",
    modelInfo: "Model is 5'9\" and wears M.",
    images: [
      photo("photo-1483985988355-763728e1935b", "Woman in an easy contemporary set, city light"),
      photo("photo-1539109136881-3be0616acf4b", "Full-length fashion portrait in muted tones"),
    ],
    reviews: [
      review("aria-tracksuit", "r4", "Sana R.", 5, "I wear this constantly. It looks polished without trying."),
      review("aria-tracksuit", "r5", "Zara I.", 4, "Olive is deeper in person, which I prefer. Delivery to Lahore took three days."),
    ],
  }),
  product({
    handle: "sable-hoodie",
    code: "HOD-001",
    title: "Sable Hoodie",
    category: "hoodies",
    audience: "women",
    price: 8900,
    fabric: "Fleece",
    care: fleeceCare,
    colors: [cocoa, ivory],
    sizes: ADULT,
    soldOut: ["IVR"],
    badges: ["new"],
    sales30d: 31,
    createdAt: "2026-10-28",
    description:
      "A heavyweight hoodie with a short, straight body. The hood sits close, and the cuffs are firm enough to keep their shape.",
    details: ["Brushed fleece, 380 gsm", "Kangaroo pocket", "Tonal drawcord", "Dropped shoulder"],
    fitNotes: "Straight, slightly cropped. Size up if you want it longer.",
    modelInfo: "Model is 5'6\" and wears S.",
    images: [
      photo("photo-1556821840-3a63f95609a7", "Folded heavyweight hoodie in a warm neutral"),
      photo("photo-1529139574466-a303027c1d8b", "Portrait in a dark casual layer"),
    ],
    reviews: [review("sable-hoodie", "r6", "Noor F.", 5, "The fleece is dense and the cocoa colour is rich. Ivory was already gone in my size.")],
  }),
  product({
    handle: "ivory-sweatshirt",
    code: "SWT-001",
    title: "Ivory Sweatshirt",
    category: "sweatshirts",
    audience: "women",
    price: 7490,
    compareAtPrice: 8900,
    fabric: "Loopback cotton",
    care: terryCare,
    colors: [ivory, sand],
    sizes: ADULT,
    badges: ["sale"],
    sales30d: 40,
    createdAt: "2026-07-18",
    description:
      "A crewneck sweatshirt in undyed-looking ivory. The shoulder is gentle, the hem is ribbed, and there is nothing on it that shouts.",
    details: ["Loopback cotton, 300 gsm", "Set-in sleeve", "Rib collar, cuff and hem"],
    fitNotes: "Classic fit. Your usual size.",
    modelInfo: "Model is 5'7\" and wears S.",
    images: [
      photo("photo-1434389677669-e08b4cac3105", "Soft knit crew in warm light"),
      photo("photo-1521572163474-6864f9cf17ab", "Plain crewneck sweatshirt on a clean ground"),
    ],
    reviews: [review("ivory-sweatshirt", "r7", "Rabia A.", 4, "Lovely hand-feel. It picked up a little lint after the first wash, then settled.")],
  }),
  product({
    handle: "solene-top",
    code: "TOP-001",
    title: "Solene Top",
    category: "tops",
    audience: "women",
    price: 4990,
    fabric: "Cotton jersey",
    care: "Machine wash cold. Reshape while damp.",
    colors: [ivory, ink, blush],
    sizes: ADULT,
    badges: ["new"],
    sales30d: 22,
    createdAt: "2026-11-01",
    description:
      "A long-sleeve top with a modest neckline and a clean side seam. It layers under the Nova shirt or stands on its own.",
    details: ["Cotton jersey, 180 gsm", "Long sleeve", "Slightly elongated hem"],
    fitNotes: "Close but not tight. Take your usual size.",
    modelInfo: "Model is 5'8\" and wears S.",
    images: [
      photo("photo-1523381210434-271e8be1f52b", "Plain cotton top, folded"),
      photo("photo-1489987707025-afc232f7ea0f", "Neutral garments hanging in a row"),
    ],
  }),
  product({
    handle: "atlas-tracksuit",
    code: "TRK-002",
    title: "Atlas Tracksuit",
    category: "tracksuits",
    audience: "men",
    price: 15900,
    fabric: "French terry",
    care: terryCare,
    colors: [ink, navy],
    sizes: ADULT,
    badges: ["bestseller"],
    sales30d: 71,
    createdAt: "2026-08-15",
    description:
      "A men's tracksuit cut with a straight leg and a jacket that closes cleanly. Made for travel days and Fridays, not the gym floor.",
    details: ["Zip jacket and straight trouser", "French terry, 340 gsm", "Side pockets", "Rib hem"],
    fitNotes: "Straight through the thigh. If you are between sizes, take the larger one.",
    modelInfo: "Model is 6'0\" and wears L.",
    images: [
      photo("photo-1552374196-1ab2a1c593e8", "Man in a dark contemporary outfit, standing outdoors"),
      photo("photo-1507679799987-c73779587ccf", "Tailored dark layers, editorial crop"),
    ],
    reviews: [
      review("atlas-tracksuit", "r8", "Omar H.", 5, "The jacket is the piece. It looks like outerwear, not a tracksuit top."),
      review("atlas-tracksuit", "r9", "Bilal K.", 5, "Ordered L for 5'11\". Shoulder and length are both right."),
    ],
  }),
  product({
    handle: "harbor-hoodie",
    code: "HOD-002",
    title: "Harbor Hoodie",
    category: "hoodies",
    audience: "men",
    price: 9490,
    fabric: "Fleece",
    care: fleeceCare,
    colors: [navy, forest],
    sizes: ADULT,
    low: ["NVY-XXL"],
    badges: [],
    sales30d: 38,
    createdAt: "2026-09-01",
    description:
      "A full-length hoodie in a deep navy. The fleece is heavy, the pocket is set high, and the hood frames the face without bulk.",
    details: ["Brushed fleece, 400 gsm", "Double-layer hood", "Kangaroo pocket", "Rib cuffs"],
    fitNotes: "True to size with room through the chest.",
    modelInfo: "Model is 5'11\" and wears L.",
    images: [
      photo("photo-1617137968427-85924c800a22", "Man in a dark layered look"),
      photo("photo-1556821840-3a63f95609a7", "Heavyweight hoodie, folded"),
    ],
    reviews: [review("harbor-hoodie", "r10", "Usman R.", 4, "Warm without being clumsy. XXL in navy was limited.")],
  }),
  product({
    handle: "meridian-sweatshirt",
    code: "SWT-002",
    title: "Meridian Sweatshirt",
    category: "sweatshirts",
    audience: "men",
    price: 7990,
    fabric: "Loopback cotton",
    care: terryCare,
    colors: [sand, ink],
    sizes: ADULT,
    badges: ["new"],
    sales30d: 19,
    createdAt: "2026-10-12",
    description:
      "A crewneck with a firmer hand and a slightly longer back hem. Sand reads as stone in daylight and warmer indoors.",
    details: ["Loopback cotton, 320 gsm", "Rib trims", "Side vents"],
    fitNotes: "Regular fit. The back hem covers the waistband when you sit.",
    modelInfo: "Model is 6'1\" and wears L.",
    images: [
      photo("photo-1487222477894-8943e31ef7b2", "Man seated in a neutral sweatshirt"),
      photo("photo-1583743814966-8936f5b7be1a", "Plain sweatshirt against a light wall"),
    ],
  }),
  product({
    handle: "civic-coord-set",
    code: "COD-003",
    title: "Civic Co-ord Set",
    category: "co-ord-sets",
    audience: "men",
    price: 13500,
    fabric: "Woven viscose",
    care: "Cold hand wash. Hang dry. Iron on low.",
    colors: [olive, sand],
    sizes: ADULT,
    badges: [],
    sales30d: 28,
    createdAt: "2026-09-20",
    description:
      "An open-collar shirt and a straight trouser in the same cloth. It is the simplest way to look dressed without a blazer.",
    details: ["Shirt and trouser", "Woven viscose blend", "Mother-of-pearl-look buttons", "Side-tab waist"],
    fitNotes: "The shirt is worn untucked. The trouser is straight, not slim.",
    modelInfo: "Model is 5'11\" and wears M.",
    images: [
      photo("photo-1507679799987-c73779587ccf", "Man in a coordinated neutral suit-like set"),
      photo("photo-1516257984-b1b4d707412e", "Man in relaxed tailored clothing"),
    ],
    reviews: [review("civic-coord-set", "r11", "Hamza A.", 5, "Wore the olive set to a dinner. Two people asked where it was from.")],
  }),
  product({
    handle: "form-top",
    code: "TOP-002",
    title: "Form Top",
    category: "tops",
    audience: "men",
    price: 4490,
    fabric: "Cotton jersey",
    care: "Machine wash cold with similar colours.",
    colors: [ink, ivory, navy],
    sizes: ADULT,
    badges: [],
    sales30d: 33,
    createdAt: "2026-06-11",
    description:
      "A heavy jersey tee with a bound neck and a sleeve that ends at the right place. The kind of top the rest of the wardrobe depends on.",
    details: ["Cotton jersey, 200 gsm", "Bound neckline", "Straight hem"],
    fitNotes: "Regular. Not a muscle fit and not oversized.",
    modelInfo: "Model is 6'0\" and wears M.",
    images: [
      photo("photo-1521572163474-6864f9cf17ab", "White and ink jersey tops"),
      photo("photo-1583743814966-8936f5b7be1a", "Clean crewneck top"),
    ],
    reviews: [review("form-top", "r12", "Daniyal P.", 4, "Holds its shape after several washes. I bought a second in ivory.")],
  }),
  product({
    handle: "atelier-hoodie",
    code: "HOD-004",
    title: "Atelier Hoodie",
    category: "hoodies",
    audience: "unisex",
    price: 9990,
    fabric: "Fleece",
    care: fleeceCare,
    colors: [ink, sand],
    sizes: ADULT,
    badges: ["new", "bestseller"],
    sales30d: 58,
    createdAt: "2026-11-02",
    description:
      "Our house hoodie. One block, two colours, cut so it reads the same on different bodies. Heavy fleece, quiet finish.",
    details: ["Brushed fleece, 420 gsm", "Unisex block", "Tonal stitching", "Kangaroo pocket"],
    fitNotes: "Choose your usual size. The body is straight and the sleeve is long.",
    modelInfo: "Shown on a 5'8\" model in M and a 6'0\" model in L.",
    images: [
      photo("photo-1556821840-3a63f95609a7", "Ink and sand hoodies, folded"),
      photo("photo-1445205170230-053b83016050", "Clothing rail in a warm studio"),
    ],
    reviews: [review("atelier-hoodie", "r15", "Laiba & Ahmed", 5, "We bought matching ink hoodies in S and L. Same proportion, different size. That is the point.")],
  }),
  product({
    handle: "origin-sweatshirt",
    code: "SWT-003",
    title: "Origin Sweatshirt",
    category: "sweatshirts",
    audience: "unisex",
    price: 8490,
    fabric: "Loopback cotton",
    care: terryCare,
    colors: [forest, ivory],
    sizes: ADULT,
    badges: [],
    sales30d: 27,
    createdAt: "2026-07-30",
    description:
      "A unisex crew with a firm collar and a hem that does not curl. Forest is the colour we keep coming back to.",
    details: ["Loopback cotton, 340 gsm", "Set-in sleeve", "Taped neck"],
    fitNotes: "Unisex regular fit. Women who prefer a closer shape often take one size down.",
    modelInfo: "Model is 5'9\" and wears M.",
    images: [
      photo("photo-1591047139829-d91aecb6caea", "Dark outer layer, clean studio light"),
      photo("photo-1521572163474-6864f9cf17ab", "Ivory crewneck"),
    ],
    reviews: [review("origin-sweatshirt", "r16", "Farah N.", 4, "I sized down to S and it sits well. The forest green is deep, not bright.")],
  }),
  product({
    handle: "ease-top",
    code: "TOP-004",
    title: "Ease Top",
    category: "tops",
    audience: "unisex",
    price: 4790,
    fabric: "Cotton jersey",
    care: "Machine wash cold. Hang dry.",
    colors: [ivory, ink],
    sizes: ADULT,
    badges: ["new"],
    sales30d: 12,
    createdAt: "2026-11-05",
    description:
      "A heavier unisex tee with a longer body and a sleeve that can be pushed up. It is the layer under every hoodie in the line.",
    details: ["Cotton jersey, 210 gsm", "Longer body", "Shoulder seam set back"],
    fitNotes: "Relaxed unisex. Take your usual size, or one down for a closer fit.",
    modelInfo: "Model is 5'10\" and wears M.",
    images: [
      photo("photo-1523381210434-271e8be1f52b", "Stacked cotton tees"),
      photo("photo-1583743814966-8936f5b7be1a", "Ink and ivory tops"),
    ],
  }),
];

export const categories: { handle: Category; title: string; blurb: string }[] = [
  { handle: "co-ord-sets", title: "Co-ord Sets", blurb: "Shirt and trouser, cut from the same cloth." },
  { handle: "tracksuits", title: "Tracksuits", blurb: "Ease with a tailored line." },
  { handle: "hoodies", title: "Hoodies", blurb: "Heavy fleece, quiet finish." },
  { handle: "sweatshirts", title: "Sweatshirts", blurb: "Crewnecks with a firm hand." },
  { handle: "tops", title: "Tops", blurb: "The layer everything else depends on." },
];

export const collectionMeta: { handle: string; title: string; blurb: string }[] = [
  ...categories,
  { handle: "new-arrivals", title: "New Arrivals", blurb: "The latest pieces from the house." },
  { handle: "bestsellers", title: "Bestsellers", blurb: "What people keep coming back for." },
  { handle: "sale", title: "Sale", blurb: "A short list, marked down with care." },
];

export const audiences: { handle: Audience; title: string; blurb: string }[] = [
  { handle: "women", title: "Women", blurb: "Co-ords, tracksuits and layers with a clean line." },
  { handle: "men", title: "Men", blurb: "Straight fits, deep colours, no excess." },
  { handle: "unisex", title: "Unisex", blurb: "One block, shared across the wardrobe." },
];

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "10Y", "12Y", "14Y", "16Y"];

export function getProduct(handle: string): Product | undefined {
  return products.find((item) => item.handle === handle);
}

export function findVariant(variantId: string): { product: Product; variant: Product["variants"][number] } | undefined {
  for (const product of products) {
    const variant = product.variants.find((item) => item.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
}

export function productsInCollection(handle: string): Product[] {
  if (handle === "new-arrivals") {
    return products.filter((item) => item.badges.includes("new") || item.createdAt >= "2026-10-01");
  }
  if (handle === "bestsellers") {
    return products.filter((item) => item.badges.includes("bestseller") || item.sales30d >= 40);
  }
  if (handle === "sale") {
    return products.filter((item) => item.compareAtPrice && item.compareAtPrice > item.price);
  }
  return products.filter((item) => item.category === handle);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((item) => item.handle !== product.handle && (item.category === product.category || item.audience === product.audience))
    .sort((a, b) => b.sales30d - a.sales30d)
    .slice(0, limit);
}

export type CatalogQuery = {
  audience?: string;
  category?: string;
  size?: string | string[];
  color?: string | string[];
  fabric?: string | string[];
  availability?: string;
  min?: string;
  max?: string;
  sort?: string;
  q?: string;
};

function list(value?: string | string[]): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

export function filterProducts(source: Product[], query: CatalogQuery): Product[] {
  const sizes = list(query.size);
  const colors = list(query.color);
  const fabrics = list(query.fabric);
  const min = query.min ? Number(query.min) : undefined;
  const max = query.max ? Number(query.max) : undefined;
  const q = query.q?.trim().toLowerCase();

  const filtered = source.filter((product) => {
    if (query.audience && product.audience !== query.audience) return false;
    if (query.category && product.category !== query.category) return false;
    if (fabrics.length && !fabrics.includes(product.fabric)) return false;
    if (min !== undefined && !Number.isNaN(min) && product.price < min) return false;
    if (max !== undefined && !Number.isNaN(max) && product.price > max) return false;
    if (sizes.length && !product.variants.some((variant) => sizes.includes(variant.size))) return false;
    if (colors.length && !product.variants.some((variant) => colors.includes(variant.color))) return false;
    if (query.availability === "instock" && product.variants.every((variant) => variant.stock <= 0)) return false;
    if (q) {
      const haystack = [product.title, product.fabric, product.category, product.audience, product.description]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sort = query.sort || "newest";
  return filtered.sort((a, b) => {
    if (sort === "bestselling") return b.sales30d - a.sales30d;
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function searchProducts(query: string): Product[] {
  return filterProducts(products, { q: query, sort: "bestselling" });
}

export function facetOptions(source: Product[]) {
  const sizes = new Set<string>();
  const colors = new Map<string, string>();
  const fabrics = new Set<string>();
  for (const product of source) {
    fabrics.add(product.fabric);
    for (const variant of product.variants) {
      sizes.add(variant.size);
      colors.set(variant.color, variant.colorHex);
    }
  }
  return {
    sizes: [...sizes].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)),
    colors: [...colors.entries()].map(([name, hex]) => ({ name, hex })),
    fabrics: [...fabrics].sort(),
  };
}

export function totalStock(product: Product, availability?: Record<string, number>): number {
  return product.variants.reduce((sum, variant) => sum + (availability?.[variant.id] ?? variant.stock), 0);
}

export function isLowStock(product: Product, availability?: Record<string, number>): boolean {
  return product.variants.some((variant) => {
    const qty = availability?.[variant.id] ?? variant.stock;
    return qty > 0 && qty <= 3;
  });
}

export function priceLabel(product: Product): { price: number; compare?: number; off: number | null } {
  const off =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;
  return { price: product.price, compare: product.compareAtPrice, off };
}
