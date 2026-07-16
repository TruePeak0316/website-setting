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
  image: string;
  icon: IconName;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
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

export type ArticleCategory = "財稅實務" | "公司經營" | "誠峰解析";

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
  author: string;
  youtube?: string;
  blocks: ArticleBlock[];
  previousSlug?: string;
  nextSlug?: string;
}
