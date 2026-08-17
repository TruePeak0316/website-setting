import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { loadPublishedContent, resetPublishedContentCacheForTests } from "../lib/cms/load-published-content";
import { buildSiteFrame, isEmptyManagedPage } from "../lib/cms/site-content";
import { createRobotsText, createSitemapXml } from "../scripts/cms-artifacts.mjs";
import { loadArticle } from "../lib/articles";

const fixturePath = path.join(process.cwd(), "tests/fixtures/published-content-v1.json");
const originalEnv = { ...process.env };
const temporaryDirectories: string[] = [];

afterEach(() => {
  process.env = { ...originalEnv };
  resetPublishedContentCacheForTests();
  for (const directory of temporaryDirectories.splice(0)) fs.rmSync(directory, { recursive: true, force: true });
});

function withSnapshot(mutator: (value: Record<string, unknown>) => void): string {
  const value = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as Record<string, unknown>;
  mutator(value);
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "stage5-content-"));
  temporaryDirectories.push(directory);
  const target = path.join(directory, "snapshot.json");
  fs.writeFileSync(target, JSON.stringify(value));
  return target;
}

describe("loadPublishedContent", () => {
  it("loads and validates the V1 fixture", () => {
    process.env.CMS_CONTENT_REQUIRED = "1";
    process.env.CMS_PUBLISHED_CONTENT_PATH = fixturePath;
    process.env.CMS_EXPECTED_RELEASE_ID = "11111111-1111-4111-8111-111111111111";
    expect(loadPublishedContent()?.siteSettings.siteName).toBe("Stage 5 Canary Site");
  });

  it("uses legacy mode only when content is not required and no path is supplied", () => {
    delete process.env.CMS_CONTENT_REQUIRED;
    delete process.env.CMS_PUBLISHED_CONTENT_PATH;
    expect(loadPublishedContent()).toBeNull();
  });

  it("fails closed when CMS content is required without a configured path", () => {
    process.env.CMS_CONTENT_REQUIRED = "1";
    delete process.env.CMS_PUBLISHED_CONTENT_PATH;
    expect(() => loadPublishedContent()).toThrow("CMS_PUBLISHED_CONTENT_PATH is missing");
  });

  it("fails closed for a missing file", () => {
    process.env.CMS_CONTENT_REQUIRED = "1";
    process.env.CMS_PUBLISHED_CONTENT_PATH = "/missing/stage5.json";
    expect(() => loadPublishedContent()).toThrow("Unable to read CMS snapshot");
  });

  it("fails closed for invalid JSON", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "stage5-json-"));
    temporaryDirectories.push(directory);
    const target = path.join(directory, "bad.json");
    fs.writeFileSync(target, "{");
    process.env.CMS_CONTENT_REQUIRED = "1";
    process.env.CMS_PUBLISHED_CONTENT_PATH = target;
    expect(() => loadPublishedContent()).toThrow("not valid JSON");
  });

  it("rejects an incompatible schema", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => { value.schemaVersion = "2.0"; });
    expect(() => loadPublishedContent()).toThrow("malformed");
  });

  it("rejects a release mismatch", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = fixturePath;
    process.env.CMS_EXPECTED_RELEASE_ID = "22222222-2222-4222-8222-222222222222";
    expect(() => loadPublishedContent()).toThrow("releaseId mismatch");
  });

  it("rejects malformed required content", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      (value.siteSettings as Record<string, unknown>).email = "not-an-email";
    });
    expect(() => loadPublishedContent()).toThrow("siteSettings.email");
  });

  it.each([
    ["javascript Settings URL", "siteSettings.publicUrl", (value: Record<string, unknown>) => {
      (value.siteSettings as Record<string, unknown>).publicUrl = "javascript:alert(1)";
    }],
    ["data Settings URL", "siteSettings.lineUrl", (value: Record<string, unknown>) => {
      (value.siteSettings as Record<string, unknown>).lineUrl = "data:text/html,unsafe";
    }],
    ["ftp media URL", "siteSettings.logo.url", (value: Record<string, unknown>) => {
      const settings = value.siteSettings as { logo: Record<string, unknown> };
      settings.logo.url = "ftp://fixture.example.com/logo.webp";
    }],
    ["userinfo canonical URL", "seo.defaults.canonicalSiteUrl", (value: Record<string, unknown>) => {
      const seo = value.seo as { defaults: Record<string, unknown> };
      seo.defaults.canonicalSiteUrl = "https://user:secret@fixture.example.com";
    }],
    ["file Blog embed URL", "blog.details.0.embedUrl", (value: Record<string, unknown>) => {
      const blog = value.blog as { details: Array<Record<string, unknown>> };
      blog.details[0]!.embedUrl = "file:///tmp/embed.html";
    }],
    ["control characters", "siteSettings.reviewUrl", (value: Record<string, unknown>) => {
      (value.siteSettings as Record<string, unknown>).reviewUrl = "https://fixture.example.com/review\nunsafe";
    }],
  ])("rejects unsafe external URLs: %s", (_label, expectedPath, mutate) => {
    process.env.CMS_CONTENT_REQUIRED = "1";
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot(mutate);
    expect(() => loadPublishedContent()).toThrow(expectedPath);
  });

  it("rejects unsafe external hero actions", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const pages = value.pages as { home: { hero: { primaryAction: Record<string, unknown> } } };
      pages.home.hero.primaryAction.href = "javascript:alert(1)";
    });
    expect(() => loadPublishedContent()).toThrow("pages.home.hero.primaryAction.href");
  });

  it("rejects absolute URLs declared as internal actions", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const pages = value.pages as { home: { hero: { primaryAction: Record<string, unknown> } } };
      pages.home.hero.primaryAction.href = "https://fixture.example.com/contact";
    });
    expect(() => loadPublishedContent()).toThrow("pages.home.hero.primaryAction.href");
  });

  it.each([
    ["NUL", "/contact\u0000evil"],
    ["space", "/contact bad"],
    ["backslash", "/contact\\evil"],
    ["protocol-relative", "//evil.example/contact"],
  ])("rejects unsafe internal action paths containing %s", (_label, href) => {
    process.env.CMS_CONTENT_REQUIRED = "1";
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const pages = value.pages as { home: { hero: { primaryAction: Record<string, unknown> } } };
      pages.home.hero.primaryAction.href = href;
    });
    expect(() => loadPublishedContent()).toThrow("pages.home.hero.primaryAction.href");
  });

  it("rejects external service actions containing credentials", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const pages = value.pages as { services: { services: Array<{ action: Record<string, unknown> }> } };
      pages.services.services[0]!.action.href = "https://user:secret@fixture.example.com/book";
    });
    expect(() => loadPublishedContent()).toThrow("pages.services.services.0.action.href");
  });

  it("accepts query and anchor components on safe internal and external actions", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const pages = value.pages as {
        home: { hero: { primaryAction: Record<string, unknown> } };
        services: { services: Array<{ action: Record<string, unknown> }> };
      };
      pages.home.hero.primaryAction.href = "/services?from=home#tax-service";
      pages.services.services[0]!.action.href = "https://fixture.example.com/book?from=services#form";
    });
    expect(loadPublishedContent()?.pages.home.hero.primaryAction?.href).toBe("/services?from=home#tax-service");
  });

  it("filters and deterministically sorts navigation and maps SEO/settings", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = fixturePath;
    const content = loadPublishedContent();
    const frame = buildSiteFrame(content);
    expect(frame.navigation.map(({ href }) => href)).toEqual(["/", "/contact"]);
    expect(frame.source).toBe("cms");
    expect(frame.settings.name).toBe("Stage 5 Canary Site");
    expect(frame.settings.mapEmbedUrl).toContain("google.com/maps/embed");
    expect(frame.navigation[1]?.icon?.alt).toBe("Fixture contact navigation icon");
    expect(frame.footerServices).toEqual([{ id: "fixture-service", href: "/services#fixture-service", title: "Fixture service" }]);
    expect(frame.seo.pageOverrides[0]?.title).toBe("Fixture Home SEO");
  });

  it("preserves managed-page media metadata and service actions", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = fixturePath;
    const pages = loadPublishedContent()!.pages;
    expect(pages.home.advantages[0]?.icon).toMatchObject({ alt: "Fixture advantage icon", width: 96, height: 96 });
    expect(pages.about.values[0]?.icon).toMatchObject({ alt: "Fixture value icon", width: 80, height: 80 });
    expect(pages.services.services[0]?.sections[0]?.image).toMatchObject({ alt: "Fixture service section image", width: 900, height: 600 });
    expect(pages.services.services[0]?.action).toMatchObject({ external: true, label: "Fixture external action" });
    expect(pages.testimonials.testimonials[0]?.avatar).toMatchObject({ alt: "Fixture reviewer avatar", width: 160, height: 160 });
  });

  it("recognizes the producer's exact empty page shape without treating non-empty pages as empty", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = fixturePath;
    const content = loadPublishedContent();
    expect(isEmptyManagedPage(content!.pages.home)).toBe(false);
    content!.pages.home = { hero: { eyebrow: null, title: "", description: null, image: null, primaryAction: null, secondaryAction: null }, advantages: [], featuredArticleSlugs: [] };
    expect(isEmptyManagedPage(content!.pages.home)).toBe(true);
  });

  it("rejects visible unknown navigation paths and inconsistent Blog slugs", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const navigation = value.navigation as Array<Record<string, unknown>>;
      navigation[1]!.visible = true;
    });
    expect(() => loadPublishedContent()).toThrow("unknown route");
    resetPublishedContentCacheForTests();
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const blog = value.blog as { details: Array<Record<string, unknown>> };
      blog.details[0]!.slug = "different-slug";
    });
    expect(() => loadPublishedContent()).toThrow("identical ordered slugs");
  });

  it.each([
    ["protocol-relative", "//evil.example/path"],
    ["cross-origin", "https://evil.example/path"],
    ["space", "/bad path"],
    ["backslash", "/bad\\path"],
    ["control character", "/bad\u0000path"],
  ])("rejects unsafe SEO override routes: %s", (_label, route) => {
    process.env.CMS_CONTENT_REQUIRED = "1";
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const seo = value.seo as { pageOverrides: Array<Record<string, unknown>> };
      seo.pageOverrides[0]!.route = route;
    });
    expect(() => loadPublishedContent()).toThrow("seo.pageOverrides.0.route");
  });

  it.each(["Bad Key", "-leading-hyphen", `${"a".repeat(101)}`])("rejects producer-invalid SEO pageKey %s", (pageKey) => {
    process.env.CMS_CONTENT_REQUIRED = "1";
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const seo = value.seo as { pageOverrides: Array<Record<string, unknown>> };
      seo.pageOverrides[0]!.pageKey = pageKey;
    });
    expect(() => loadPublishedContent()).toThrow("seo.pageOverrides.0.pageKey");
  });

  it("rejects duplicate SEO pageKeys and routes independently", () => {
    process.env.CMS_CONTENT_REQUIRED = "1";
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const seo = value.seo as { pageOverrides: Array<Record<string, unknown>> };
      seo.pageOverrides.push({ ...seo.pageOverrides[0], route: "/contact" });
    });
    expect(() => loadPublishedContent()).toThrow("seo.pageOverrides.1.pageKey");

    resetPublishedContentCacheForTests();
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const seo = value.seo as { pageOverrides: Array<Record<string, unknown>> };
      seo.pageOverrides.push({ ...seo.pageOverrides[0], pageKey: "contact" });
    });
    expect(() => loadPublishedContent()).toThrow("seo.pageOverrides.1.route");
  });

  it("generates robots and sitemap content from the snapshot", () => {
    const snapshot = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
    expect(createRobotsText(snapshot)).toContain("Allow: /");
    const sitemap = createSitemapXml(snapshot);
    expect(sitemap).toContain("https://fixture.example.com/Library/cms-fixture-article");
    expect(sitemap).toContain("<priority>1.00</priority>");
    snapshot.seo.pageOverrides[0].noIndex = true;
    expect(createSitemapXml(snapshot)).not.toContain("<loc>https://fixture.example.com/</loc>");
    snapshot.blog.details[0].seo.noIndex = true;
    expect(createSitemapXml(snapshot)).not.toContain("/Library/cms-fixture-article");
    snapshot.blog.details[0].seo.noIndex = false;
    snapshot.seo.defaults.sitemapIncludeByDefault = false;
    expect(createSitemapXml(snapshot)).not.toContain("/Library/cms-fixture-article");
  });

  it("uses article excerpt then CMS global default when article SEO description is null", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = fixturePath;
    expect(loadArticle("cms-fixture-article").metaDescription).toBe("Fixture excerpt");

    resetPublishedContentCacheForTests();
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const blog = value.blog as { details: Array<Record<string, unknown>> };
      blog.details[0]!.excerpt = null;
    });
    expect(loadArticle("cms-fixture-article").metaDescription).toBe("Fixture SEO default");
  });

  it("derives previous and next links from published Blog order", () => {
    process.env.CMS_PUBLISHED_CONTENT_PATH = withSnapshot((value) => {
      const blog = value.blog as { articles: Array<Record<string, unknown>>; details: Array<Record<string, unknown>> };
      blog.articles.push({ ...blog.articles[0], id: "article-2", slug: "second-article" });
      blog.details.push({ ...blog.details[0], id: "article-2", slug: "second-article" });
    });
    expect(loadArticle("cms-fixture-article").previousSlug).toBe("second-article");
    expect(loadArticle("second-article").nextSlug).toBe("cms-fixture-article");
  });
});
