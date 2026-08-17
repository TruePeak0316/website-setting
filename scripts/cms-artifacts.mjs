const fixedRoutes = ["/", "/services", "/about", "/team", "/team/peng-yu-feng", "/team/chen-man-jing", "/truepeakinsights", "/testimonials", "/contact", "/caculators"];

export function createRobotsText(snapshot) {
  const baseUrl = snapshot.seo.defaults.canonicalSiteUrl.replace(/\/$/, "");
  const disallowAll = snapshot.seo.defaults.robotsPolicy.startsWith("noindex");
  return `User-agent: *\n${disallowAll ? "Disallow: /" : "Allow: /"}\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
}

export function createSitemapXml(snapshot) {
  const baseUrl = snapshot.seo.defaults.canonicalSiteUrl.replace(/\/$/, "");
  const overrideByRoute = new Map(snapshot.seo.pageOverrides.map((item) => [item.route, item]));
  const entries = fixedRoutes.filter((route) => {
    const override = overrideByRoute.get(route);
    return !override?.noIndex && (override ? override.sitemapIncluded : snapshot.seo.defaults.sitemapIncludeByDefault);
  }).map((route) => ({ route, lastmod: snapshot.publishedAt.slice(0, 10), priority: overrideByRoute.get(route)?.sitemapPriority }));
  snapshot.blog.articles.forEach((article, index) => {
    const detail = snapshot.blog.details[index];
    if (!detail || detail.slug !== article.slug) {
      throw new Error(`Blog summary/detail order mismatch at index ${index}`);
    }
    if (snapshot.seo.defaults.sitemapIncludeByDefault && !detail.seo.noIndex) {
      entries.push({ route: `/Library/${article.slug}`, lastmod: article.updatedAt.slice(0, 10), priority: null });
    }
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(({ route, lastmod, priority }) => `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${lastmod}</lastmod>${priority === null || priority === undefined ? "" : `\n    <priority>${priority.toFixed(2)}</priority>`}\n  </url>`).join("\n")}\n</urlset>\n`;
}
