import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const redirects = [
  ["about.html", "/about/"],
  ["services.html", "/services/"],
  ["contact.html", "/contact/"],
  ["testimonials.html", "/testimonials/"],
  ["truepeakinsights.html", "/truepeakinsights/"],
  ["caculators.html", "/caculators/"],
  ...Array.from({ length: 14 }, (_, index) => {
    const slug = String(index + 1).padStart(3, "0");
    return [`Library/${slug}.html`, `/Library/${slug}/`];
  }),
];

const outputDirectory = path.resolve("out");

for (const [legacyPath, destination] of redirects) {
  const outputPath = path.join(outputDirectory, legacyPath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${destination}">
    <link rel="canonical" href="${destination}">
    <title>頁面移動中</title>
  </head>
  <body>
    <p>頁面已移動，請前往 <a href="${destination}">${destination}</a>。</p>
  </body>
</html>
`,
  );
}

console.log(`Generated ${redirects.length} legacy HTML redirects in ${outputDirectory}`);
