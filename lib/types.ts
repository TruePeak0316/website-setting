export type IconName =
  | "award"
  | "book"
  | "briefcase"
  | "building"
  | "calculator"
  | "chart"
  | "check"
  | "file"
  | "globe"
  | "map"
  | "receipt"
  | "shield"
  | "users";

export interface ServiceSection {
  id: string;
  title: string;
  summary: string;
  image?: string;
  imageMedia?: import("@/lib/cms/published-content-v1").PublishedMediaAssetV1;
  icon: IconName;
  sections: Array<{
    heading: string;
    body: string[];
    bodyHtml?: string;
    image?: import("@/lib/cms/published-content-v1").PublishedMediaAssetV1;
  }>;
  action?: import("@/lib/cms/published-content-v1").PublishedActionLinkV1;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  paragraphs: string[];
  highlights?: string[];
}

export interface ReviewItem {
  author: string;
  age: string;
  content: string;
}

export type ArticleCategory = string;

export interface ArticleSummary {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  year: string;
  category: ArticleCategory;
  image: string;
  alt: string;
}

export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "html"; html: string };

export interface ArticleDetail extends ArticleSummary {
  metaTitle: string;
  metaDescription: string;
  author: string;
  youtube?: string;
  blocks: ArticleBlock[];
  seo?: import("@/lib/cms/published-content-v1").PublishedSeoMetadataV1;
  previousSlug?: string;
  nextSlug?: string;
}
