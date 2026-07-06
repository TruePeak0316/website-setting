import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const TARGET_DIRS = ["public/images", "public/Library"];
const CONVERTIBLE = new Set([".jpg", ".jpeg", ".png"]);
const QUALITY = 82;

async function convertDir(dir) {
  const entries = await readdir(dir);
  const results = [];

  for (const entry of entries) {
    const ext = extname(entry).toLowerCase();
    if (!CONVERTIBLE.has(ext)) continue;

    const inputPath = join(dir, entry);
    const outputPath = join(dir, entry.slice(0, -ext.length) + ".webp");

    const before = (await stat(inputPath)).size;
    await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);
    const after = (await stat(outputPath)).size;

    results.push({ file: inputPath, before, after });
  }

  return results;
}

const all = [];
for (const dir of TARGET_DIRS) {
  all.push(...(await convertDir(dir)));
}

const fmt = (n) => `${(n / 1024).toFixed(1)} KiB`;
let totalBefore = 0;
let totalAfter = 0;

for (const r of all.sort((a, b) => b.before - a.before)) {
  totalBefore += r.before;
  totalAfter += r.after;
  const saved = ((1 - r.after / r.before) * 100).toFixed(0);
  console.log(`${r.file.padEnd(58)} ${fmt(r.before).padStart(11)} -> ${fmt(r.after).padStart(11)}  (-${saved}%)`);
}

console.log("─".repeat(96));
console.log(
  `TOTAL ${all.length} files`.padEnd(58) +
    `${fmt(totalBefore).padStart(11)} -> ${fmt(totalAfter).padStart(11)}  (-${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`,
);
