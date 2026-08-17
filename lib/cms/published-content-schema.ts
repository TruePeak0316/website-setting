import { z } from "zod";

const nullableText = z.string().nullable();
export function isSafeHttpUrl(value: string): boolean {
  if (/[\\\u0000-\u0020\u007f]/.test(value)) return false;
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:")
      && Boolean(url.hostname)
      && !url.username
      && !url.password
      && url.origin !== "null"
    );
  } catch {
    return false;
  }
}

const safeHttpUrl = z.string().min(1).refine(isSafeHttpUrl, "must be a safe HTTP(S) URL");
const nullableSafeHttpUrl = safeHttpUrl.nullable();
const INTERNAL_NAVIGATION_BASE_URL = new URL("https://navigation.invalid/");
const INTERNAL_UNSAFE_CHARACTER_PATTERN = /[\\\u0000-\u0020\u007f]/;
const SEO_PAGE_KEY_PATTERN = /^[a-z0-9][a-z0-9_-]{0,99}$/;
const SEO_URL_MAX_LENGTH = 2_048;

export function isSafeInternalPath(value: unknown): value is string {
  if (
    typeof value !== "string"
    || !value.startsWith("/")
    || value.startsWith("//")
    || INTERNAL_UNSAFE_CHARACTER_PATTERN.test(value)
  ) return false;
  try {
    return new URL(value, INTERNAL_NAVIGATION_BASE_URL).origin === INTERNAL_NAVIGATION_BASE_URL.origin;
  } catch {
    return false;
  }
}

const safeInternalPath = z.string().refine(isSafeInternalPath, "must be a safe internal path");
const seoRoute = safeInternalPath.refine((value) => Array.from(value).length <= SEO_URL_MAX_LENGTH, "route is too long");
const media = z.object({
  id: z.string().min(1),
  url: safeHttpUrl,
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
}).strict();
const nullableMedia = media.nullable();

const action = z.object({ label: z.string().min(1), href: z.string().min(1), external: z.boolean() }).strict().superRefine((value, context) => {
  const valid = value.external ? isSafeHttpUrl(value.href) : isSafeInternalPath(value.href);
  if (!valid) context.addIssue({ code: z.ZodIssueCode.custom, path: ["href"], message: value.external ? "external action must use safe HTTP(S)" : "internal action must use an internal path" });
});
const hero = z.object({
  eyebrow: nullableText,
  title: z.string(),
  description: nullableText,
  image: nullableMedia,
  primaryAction: action.nullable(),
  secondaryAction: action.nullable(),
}).strict();
const seoMetadata = z.object({
  title: nullableText,
  description: nullableText,
  canonicalUrl: nullableSafeHttpUrl,
  openGraphTitle: nullableText,
  openGraphDescription: nullableText,
  openGraphImage: nullableMedia,
  noIndex: z.boolean(),
}).strict();
const author = z.object({ name: z.string().min(1), slug: nullableText, biography: nullableText, photo: nullableMedia }).strict();
const category = z.object({ name: z.string().min(1), slug: z.string().min(1) }).strict();
const articleSummary = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,499}$/),
  title: z.string().min(1),
  subtitle: nullableText,
  excerpt: nullableText,
  coverImage: nullableMedia,
  author,
  category: category.nullable(),
  tags: z.array(z.string()),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  readTimeMinutes: z.number().int().nonnegative(),
}).strict();
const articleDetail = articleSummary.extend({ contentHtml: z.string(), embedUrl: nullableSafeHttpUrl, seo: seoMetadata }).strict();

export const publishedContentV1Schema = z.object({
  schemaVersion: z.literal("1.0"),
  releaseId: z.string().uuid(),
  publishedAt: z.string().datetime(),
  siteSettings: z.object({
    siteName: z.string().min(1), displayName: z.string().min(1), description: z.string().min(1),
    publicUrl: safeHttpUrl, phoneNumber: z.string().min(1), telephoneHref: z.string().regex(/^tel:\S+$/),
    email: z.string().email(), businessAddress: z.string().min(1), lineId: nullableText,
    lineUrl: nullableSafeHttpUrl, bookingUrl: nullableSafeHttpUrl, mapUrl: nullableSafeHttpUrl,
    reviewUrl: nullableSafeHttpUrl, logo: nullableMedia, favicon: nullableMedia,
  }).strict(),
  navigation: z.array(z.object({
    key: z.string().min(1), label: z.string().min(1), path: safeInternalPath, visible: z.boolean(),
    order: z.number().int(), icon: nullableMedia,
  }).strict()),
  pages: z.object({
    home: z.object({ hero, advantages: z.array(z.object({ id: z.string().min(1), title: z.string(), description: z.string(), icon: nullableMedia }).strict()), featuredArticleSlugs: z.array(z.string()) }).strict(),
    about: z.object({
      hero, introductionHtml: z.string(),
      values: z.array(z.object({ id: z.string().min(1), title: z.string(), description: z.string(), icon: nullableMedia }).strict()),
      timeline: z.array(z.object({ id: z.string().min(1), label: z.string(), title: z.string(), description: z.string() }).strict()),
      team: z.array(z.object({ id: z.string().min(1), name: z.string(), role: z.string(), biography: nullableText, photo: nullableMedia }).strict()),
    }).strict(),
    services: z.object({
      hero, introductionHtml: z.string(),
      services: z.array(z.object({
        id: z.string().min(1), slug: z.string().min(1), title: z.string(), summary: z.string(), image: nullableMedia,
        sections: z.array(z.object({ id: z.string().min(1), title: z.string(), bodyHtml: z.string(), image: nullableMedia }).strict()),
        action: action.nullable(),
      }).strict()),
    }).strict(),
    testimonials: z.object({
      hero, introductionHtml: z.string(),
      testimonials: z.array(z.object({ id: z.string().min(1), quote: z.string(), authorName: z.string(), authorRole: nullableText, avatar: nullableMedia, rating: z.number().min(0).max(5).nullable() }).strict()),
    }).strict(),
    contact: z.object({ hero, introductionHtml: z.string() }).strict(),
  }).strict(),
  blog: z.object({ articles: z.array(articleSummary), details: z.array(articleDetail) }).strict(),
  seo: z.object({
    defaults: z.object({
      titleTemplate: z.string().min(1), defaultDescription: z.string().min(1), defaultOpenGraphImage: nullableMedia,
      twitterCard: z.enum(["summary", "summary_large_image"]), canonicalSiteUrl: safeHttpUrl,
      robotsPolicy: z.enum(["index,follow", "index,nofollow", "noindex,follow", "noindex,nofollow"]),
      sitemapIncludeByDefault: z.boolean(),
    }).strict(),
    pageOverrides: z.array(seoMetadata.extend({
      pageKey: z.string().regex(SEO_PAGE_KEY_PATTERN), route: seoRoute, sitemapIncluded: z.boolean(), sitemapPriority: z.number().min(0).max(1).nullable(),
    }).strict()).superRefine((rows, context) => {
      const pageKeys = new Set<string>();
      const routes = new Set<string>();
      rows.forEach((row, index) => {
        if (pageKeys.has(row.pageKey)) {
          context.addIssue({ code: z.ZodIssueCode.custom, path: [index, "pageKey"], message: "pageKey must be unique" });
        }
        if (routes.has(row.route)) {
          context.addIssue({ code: z.ZodIssueCode.custom, path: [index, "route"], message: "route must be unique" });
        }
        pageKeys.add(row.pageKey);
        routes.add(row.route);
      });
    }),
  }).strict(),
}).strict();
