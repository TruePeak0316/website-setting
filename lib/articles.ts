import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { ARTICLE_INDEX } from "@/lib/content";
import type { ArticleBlock, ArticleDetail, ArticleSummary } from "@/lib/types";

const ARTICLE_DIR = path.join(process.cwd(), "Library");

function resolveAsset(src: string | undefined, fallback: string): string {
  if (!src) return fallback;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/Library/${src}`;
}

function normalizeHtml(html: string): string {
  const $ = cheerio.load(`<main>${html}</main>`);
  $("script, style").remove();
  $("[style]").removeAttr("style");
  $("[class]").removeAttr("class");
  $("a").each((_, element) => {
    const link = $(element);
    const href = link.attr("href");
    if (href) link.attr("href", href.replace("../truepeakinsights.html", "/truepeakinsights"));
    link.attr("rel", "noopener");
  });
  return $("main").html() ?? "";
}

function pickSummary(slug: string): ArticleSummary {
  const summary = ARTICLE_INDEX.find((item) => item.slug === slug);
  if (!summary) {
    throw new Error(`Unknown article slug: ${slug}`);
  }
  return summary;
}

export function loadArticle(slug: string): ArticleDetail {
  const summary = pickSummary(slug);
  const filePath = path.join(ARTICLE_DIR, `${slug}.html`);
  const html = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(html);
  const contentRoot = $(".insights-text").first();
  const title = contentRoot.find("h1").first().text().trim() || summary.title;
  const subtitle = contentRoot.find("h2").first().text().trim() || summary.subtitle;
  const authorText = contentRoot
    .find("p")
    .toArray()
    .map((node) => $(node).text().trim())
    .find((text) => text.startsWith("撰文："));
  const image = resolveAsset(contentRoot.find("img").first().attr("src"), summary.image);
  const youtube = contentRoot.find("iframe").first().attr("src");
  const blocks: ArticleBlock[] = [];

  for (const element of contentRoot.children().toArray()) {
    const tagName = "tagName" in element ? element.tagName.toLowerCase() : "";
    if (!tagName || ["img", "iframe", "h1", "h2", "br", "div"].includes(tagName)) continue;

    if (tagName === "p") {
      const text = $(element).text().trim();
      if (!text || text.startsWith("撰文：")) continue;
      blocks.push({ type: "html", html: normalizeHtml($.html(element)) });
      continue;
    }

    if (tagName === "h3") {
      const text = $(element).text().trim();
      if (text) blocks.push({ type: "heading", text });
      continue;
    }

    if (["ul", "ol", "table"].includes(tagName)) {
      blocks.push({ type: "html", html: normalizeHtml($.html(element)) });
    }
  }

  const index = ARTICLE_INDEX.findIndex((article) => article.slug === slug);
  const previousSlug = ARTICLE_INDEX[index + 1]?.slug;
  const nextSlug = ARTICLE_INDEX[index - 1]?.slug;

  return {
    ...summary,
    title,
    subtitle,
    image,
    metaTitle: $("title").first().text().trim() || `${title}｜誠峰會計師事務所`,
    author: authorText?.replace("撰文：", "").trim() || "彭裕峰 會計師",
    blocks,
    ...(youtube ? { youtube } : {}),
    ...(previousSlug ? { previousSlug } : {}),
    ...(nextSlug ? { nextSlug } : {}),
  };
}

export function loadAllArticles(): ArticleSummary[] {
  return ARTICLE_INDEX;
}
