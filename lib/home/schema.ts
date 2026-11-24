import { z } from "zod";

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  style: z.enum(["solid", "outline", "text"]),
});

const imageSchema = z.object({
  desktopUrl: z.string().min(1),
  mobileUrl: z.string().min(1),
  alt: z.string().min(1),
});

const heroSlideSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  image: imageSchema,
  ctas: z.array(ctaSchema).min(1).max(3),
  textAlign: z.enum(["left", "center"]),
});

const flags = { enabled: z.boolean(), order: z.number() };

export const homeSectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("announcement"), messages: z.array(z.string().min(1)).min(1), ...flags }),
  z.object({ type: z.literal("hero"), slides: z.array(heroSlideSchema).min(1).max(3), ...flags }),
  z.object({
    type: z.literal("categoryTiles"),
    tiles: z.array(z.object({ label: z.string().min(1), href: z.string().min(1), image: imageSchema })).min(1),
    ...flags,
  }),
  z.object({
    type: z.literal("productRail"),
    title: z.string().min(1),
    source: z.enum(["new", "bestsellers", "collection"]),
    collectionHandle: z.string().optional(),
    limit: z.number().int().min(1).max(12),
    layout: z.enum(["grid", "carousel"]),
    listName: z.string().min(1),
    pinnedHandles: z.array(z.string()).optional(),
    ...flags,
  }),
  z.object({ type: z.literal("statement"), text: z.string().min(1), link: ctaSchema.optional(), ...flags }),
  z.object({
    type: z.literal("campaignBanner"),
    slide: heroSlideSchema,
    height: z.enum(["md", "lg"]),
    video: z.string().min(1).optional(),
    ...flags,
  }),
  z.object({
    type: z.literal("splitBanners"),
    items: z
      .array(
        z.object({
          label: z.string().min(1),
          promise: z.string().min(1),
          image: imageSchema,
          primary: ctaSchema,
          secondary: ctaSchema.optional(),
        }),
      )
      .min(2)
      .max(2),
    ...flags,
  }),
  z.object({
    type: z.literal("highlights"),
    tiles: z.array(z.object({ title: z.string().min(1), href: z.string().min(1), image: imageSchema })).min(6).max(8),
    ...flags,
  }),
  z.object({
    type: z.literal("story"),
    heading: z.string().min(1),
    body: z.string().min(1),
    image: imageSchema,
    ...flags,
  }),
  z.object({
    type: z.literal("social"),
    instagramHandle: z.string().min(1),
    images: z.array(imageSchema).min(1),
    reviews: z.array(z.object({ quote: z.string().min(1), author: z.string().min(1), product: z.string().min(1) })),
    ...flags,
  }),
  z.object({ type: z.literal("circle"), heading: z.string().min(1), body: z.string().min(1), ...flags }),
  z.object({
    type: z.literal("services"),
    items: z.array(z.object({ icon: z.string().min(1), title: z.string().min(1), text: z.string().min(1), href: z.string().optional() })).min(1),
    ...flags,
  }),
  z.object({ type: z.literal("newsletter"), heading: z.string().min(1), ...flags }),
]);

export const homePageSchema = z.object({
  sections: z.array(homeSectionSchema),
});

export type Cta = z.infer<typeof ctaSchema>;
export type ImageAsset = z.infer<typeof imageSchema>;
export type HeroSlide = z.infer<typeof heroSlideSchema>;
export type HomeSection = z.infer<typeof homeSectionSchema>;
export type HomePage = z.infer<typeof homePageSchema>;
