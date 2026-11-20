export type Slide = {
  eyebrow: string;
  title: string;
  lede: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
};

const crop = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=75`;

export const heroSlides: Slide[] = [
  {
    eyebrow: "The Co-ord Edit",
    title: "Cut from the same cloth.",
    lede: "Shirt and trouser, considered together. For women and men.",
    cta: "Shop co-ord sets",
    href: "/collections/co-ord-sets",
    image: crop("photo-1469334031218-e382a71b716b"),
    alt: "Editorial portrait in a structured neutral outfit",
  },
  {
    eyebrow: "New arrivals",
    title: "Ease, with a tailored line.",
    lede: "Tracksuits and hoodies in heavy cloth. Nothing loud. Nothing wasted.",
    cta: "Shop new arrivals",
    href: "/collections/new-arrivals",
    image: crop("photo-1539109136881-3be0616acf4b"),
    alt: "A model walking in a light contemporary set",
  },
  {
    eyebrow: "Winter essentials",
    title: "Fleece, loopback, quiet colour.",
    lede: "The layers we wear from the first cool evening through the new year.",
    cta: "Shop hoodies",
    href: "/collections/hoodies",
    image: crop("photo-1445205170230-053b83016050"),
    alt: "A warm studio rail of clothing",
  },
];

export const editorials = [
  {
    eyebrow: "Featured",
    title: "The Co-ord Edit",
    lede: "Four sets. One idea: pieces that belong together, and apart.",
    href: "/collections/co-ord-sets",
    cta: "Explore the edit",
    image: crop("photo-1515886657613-9f3515b0c78f"),
    alt: "Woman in a neutral co-ord, full length",
  },
  {
    eyebrow: "Season",
    title: "Winter Essentials",
    lede: "Hoodies and sweatshirts in ink, sand, forest and ivory.",
    href: "/collections/hoodies",
    cta: "Shop the layers",
    image: crop("photo-1483985988355-763728e1935b"),
    alt: "Contemporary outfit in city light",
  },
];

export const archiveTiles = [
  { image: crop("photo-1469334031218-e382a71b716b"), alt: "Archive portrait, sand tailoring" },
  { image: crop("photo-1552374196-1ab2a1c593e8"), alt: "Archive portrait, dark layers" },
  { image: crop("photo-1445205170230-053b83016050"), alt: "Studio rail" },
  { image: crop("photo-1496747611176-843222e1e57c"), alt: "Outdoor editorial in neutral cloth" },
  { image: crop("photo-1509631179647-0177331693ae"), alt: "Pale layered clothing" },
  { image: crop("photo-1556821840-3a63f95609a7"), alt: "Folded heavyweight hoodie" },
];

export const audienceTiles = [
  {
    handle: "women",
    title: "Women",
    image: crop("photo-1539109136881-3be0616acf4b"),
    alt: "Women's tailoring in muted light",
  },
  {
    handle: "men",
    title: "Men",
    image: crop("photo-1617137968427-85924c800a22"),
    alt: "Men's dark layered clothing",
  },
];
