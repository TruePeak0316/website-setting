import { readFile, writeFile } from "node:fs/promises";

// Only rewrite string literals that point at converted raster images under
// /images/ or /Library/. Keep .html sources and apple-touch-icon PNG untouched.
const FILES = [
  "pages/services.tsx",
  "pages/testimonials.tsx",
  "pages/about.tsx",
  "pages/contact.tsx",
  "pages/caculators.tsx",
  "pages/index.tsx",
  "pages/truepeakinsights.tsx",
  "components/layout/Seo.tsx",
  "components/layout/SiteHeader.tsx",
  "lib/content.ts",
];

// match "/images/...ext" or "/Library/...ext" inside single/double quotes
const RE = /((?:\/images\/|\/Library\/)[^"']+?)\.(jpg|jpeg|png)(?=["'])/gi;

for (const file of FILES) {
  const src = await readFile(file, "utf8");
  let count = 0;
  const out = src.replace(RE, (_m, base) => {
    count++;
    return `${base}.webp`;
  });
  if (count > 0) {
    await writeFile(file, out);
    console.log(`${file}: rewrote ${count} reference(s)`);
  } else {
    console.log(`${file}: no change`);
  }
}
