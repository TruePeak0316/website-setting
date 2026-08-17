export type TwitterCard = "summary" | "summary_large_image";

export interface PublishedMediaAssetV1 {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface PublishedActionLinkV1 {
  label: string;
  href: string;
  external: boolean;
}

export interface PublishedHeroV1 {
  eyebrow: string | null;
  title: string;
  description: string | null;
  image: PublishedMediaAssetV1 | null;
  primaryAction: PublishedActionLinkV1 | null;
  secondaryAction: PublishedActionLinkV1 | null;
}

export interface PublishedSiteSettingsV1 {
  siteName: string;
  displayName: string;
  description: string;
  publicUrl: string;
  phoneNumber: string;
  telephoneHref: string;
  email: string;
  businessAddress: string;
  lineId: string | null;
  lineUrl: string | null;
  bookingUrl: string | null;
  mapUrl: string | null;
  reviewUrl: string | null;
  logo: PublishedMediaAssetV1 | null;
  favicon: PublishedMediaAssetV1 | null;
}

export interface PublishedNavigationItemV1 {
  key: string;
  label: string;
  path: string;
  visible: boolean;
  order: number;
  icon: PublishedMediaAssetV1 | null;
}

export interface PublishedHomeAdvantageV1 {
  id: string;
  title: string;
  description: string;
  icon: PublishedMediaAssetV1 | null;
}

export interface PublishedHomePageV1 {
  hero: PublishedHeroV1;
  advantages: PublishedHomeAdvantageV1[];
  featuredArticleSlugs: string[];
}

export interface PublishedAboutPageV1 {
  hero: PublishedHeroV1;
  introductionHtml: string;
  values: Array<{ id: string; title: string; description: string; icon: PublishedMediaAssetV1 | null }>;
  timeline: Array<{ id: string; label: string; title: string; description: string }>;
  team: Array<{ id: string; name: string; role: string; biography: string | null; photo: PublishedMediaAssetV1 | null }>;
}

export interface PublishedServiceV1 {
  id: string;
  slug: string;
  title: string;
  summary: string;
  image: PublishedMediaAssetV1 | null;
  sections: Array<{ id: string; title: string; bodyHtml: string; image: PublishedMediaAssetV1 | null }>;
  action: PublishedActionLinkV1 | null;
}

export interface PublishedServicesPageV1 {
  hero: PublishedHeroV1;
  introductionHtml: string;
  services: PublishedServiceV1[];
}

export interface PublishedTestimonialV1 {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  avatar: PublishedMediaAssetV1 | null;
  rating: number | null;
}

export interface PublishedTestimonialsPageV1 {
  hero: PublishedHeroV1;
  introductionHtml: string;
  testimonials: PublishedTestimonialV1[];
}

export interface PublishedContactPageV1 {
  hero: PublishedHeroV1;
  introductionHtml: string;
}

export interface PublishedPagesV1 {
  home: PublishedHomePageV1;
  about: PublishedAboutPageV1;
  services: PublishedServicesPageV1;
  testimonials: PublishedTestimonialsPageV1;
  contact: PublishedContactPageV1;
}

export interface PublishedSeoMetadataV1 {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  openGraphImage: PublishedMediaAssetV1 | null;
  noIndex: boolean;
}

export interface PublishedPageSeoOverrideV1 extends PublishedSeoMetadataV1 {
  pageKey: string;
  route: string;
  sitemapIncluded: boolean;
  sitemapPriority: number | null;
}

export interface PublishedSeoV1 {
  defaults: {
    titleTemplate: string;
    defaultDescription: string;
    defaultOpenGraphImage: PublishedMediaAssetV1 | null;
    twitterCard: TwitterCard;
    canonicalSiteUrl: string;
    robotsPolicy: string;
    sitemapIncludeByDefault: boolean;
  };
  pageOverrides: PublishedPageSeoOverrideV1[];
}

export interface PublishedBlogArticleSummaryV1 {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  coverImage: PublishedMediaAssetV1 | null;
  author: { name: string; slug: string | null; biography: string | null; photo: PublishedMediaAssetV1 | null };
  category: { name: string; slug: string } | null;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
}

export interface PublishedBlogArticleDetailV1 extends PublishedBlogArticleSummaryV1 {
  contentHtml: string;
  embedUrl: string | null;
  seo: PublishedSeoMetadataV1;
}

export interface PublishedContentV1 {
  schemaVersion: "1.0";
  releaseId: string;
  publishedAt: string;
  siteSettings: PublishedSiteSettingsV1;
  navigation: PublishedNavigationItemV1[];
  pages: PublishedPagesV1;
  blog: { articles: PublishedBlogArticleSummaryV1[]; details: PublishedBlogArticleDetailV1[] };
  seo: PublishedSeoV1;
}
