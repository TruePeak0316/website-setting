import fs from "node:fs";
import path from "node:path";
import type { PublishedContentV1 } from "./published-content-v1";
import { publishedContentV1Schema } from "./published-content-schema";

let cached: PublishedContentV1 | null | undefined;

export function loadPublishedContent(): PublishedContentV1 | null {
  if (cached !== undefined) return cached;
  const configuredPath = process.env.CMS_PUBLISHED_CONTENT_PATH?.trim();
  const required = process.env.CMS_CONTENT_REQUIRED === "1";
  if (!configuredPath) {
    if (required) throw new Error("CMS content is required but CMS_PUBLISHED_CONTENT_PATH is missing");
    cached = null;
    return cached;
  }

  const snapshotPath = path.resolve(configuredPath);
  let raw: string;
  try {
    raw = fs.readFileSync(snapshotPath, "utf8");
  } catch (error) {
    throw new Error(`Unable to read CMS snapshot at ${snapshotPath}`, { cause: error });
  }
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch (error) {
    throw new Error("CMS snapshot is not valid JSON", { cause: error });
  }
  const parsed = publishedContentV1Schema.safeParse(input);
  if (!parsed.success) throw new Error(`CMS snapshot is malformed: ${parsed.error.issues[0]?.path.join(".") || "root"}`);
  const expectedRelease = process.env.CMS_EXPECTED_RELEASE_ID?.trim();
  if (expectedRelease && parsed.data.releaseId !== expectedRelease) {
    throw new Error(`CMS snapshot releaseId mismatch: expected ${expectedRelease}`);
  }
  validateSemanticContent(parsed.data);
  cached = parsed.data;
  return cached;
}

const navigationRoutes = new Set(["/", "/services", "/about", "/team", "/truepeakinsights", "/testimonials", "/caculators", "/contact"]);

function validateSemanticContent(content: PublishedContentV1): void {
  const visibleKeys = new Set<string>();
  const visiblePaths = new Set<string>();
  for (const item of content.navigation.filter(({ visible }) => visible)) {
    if (!navigationRoutes.has(item.path)) throw new Error(`CMS navigation targets an unknown route: ${item.path}`);
    if (visibleKeys.has(item.key) || visiblePaths.has(item.path)) throw new Error("CMS visible navigation keys and paths must be unique");
    visibleKeys.add(item.key);
    visiblePaths.add(item.path);
  }
  const summarySlugs = content.blog.articles.map(({ slug }) => slug);
  const detailSlugs = content.blog.details.map(({ slug }) => slug);
  if (new Set(summarySlugs).size !== summarySlugs.length || new Set(detailSlugs).size !== detailSlugs.length) {
    throw new Error("CMS blog slugs must be unique");
  }
  if (summarySlugs.length !== detailSlugs.length || summarySlugs.some((slug, index) => detailSlugs[index] !== slug)) {
    throw new Error("CMS blog summaries and details must have identical ordered slugs");
  }
  const knownSlugs = new Set(summarySlugs);
  for (const slug of content.pages.home.featuredArticleSlugs) {
    if (!knownSlugs.has(slug)) throw new Error(`CMS home references an unknown featured article: ${slug}`);
  }
}

export function resetPublishedContentCacheForTests(): void {
  cached = undefined;
}
