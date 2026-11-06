import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { validateCmsMedia } from '../scripts/validate-cms-media.mjs';

const directories: string[] = [];
afterEach(() => directories.splice(0).forEach((directory) => fs.rmSync(directory, { recursive: true, force: true })));

it('requires every image to resolve to a local file at the public site origin', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-media-'));
  directories.push(root);
  fs.mkdirSync(path.join(root, 'images/cms'), { recursive: true });
  fs.writeFileSync(path.join(root, 'images/cms/photo.webp'), 'fixture');
  const siteSettings = { publicUrl: 'https://example.test' };
  const image = { id: 'photo', url: 'https://example.test/images/cms/photo.webp', width: 1, height: 1 };
  expect(() => validateCmsMedia({ siteSettings, image, html: '<img src="/images/cms/photo.webp">' }, root)).not.toThrow();
  expect(() => validateCmsMedia({ siteSettings, html: '<img src="/images/cms/missing.webp">' }, root)).toThrow('CMS image is missing');
  expect(() => validateCmsMedia({ siteSettings, html: '<img src="/images/cms/%2fetc">' }, root)).toThrow('Unsafe CMS image path');
  expect(() => validateCmsMedia({ siteSettings, html: '<img src="/images/cms/%2e%2e/secret">' }, root)).toThrow('Unsafe CMS image path');
  expect(() => validateCmsMedia({ siteSettings, image: { ...image, url: 'https://cdn.example.test/images/cms/photo.webp' } }, root)).toThrow('public website origin');
});

for (const css of [
  'background-image: url(https://outside.example/missing.png)',
  'background: url(/images/cms/missing.webp)',
  'background: url(/images/cms/photo.webp)',
  'background: image-set("https://outside.example/photo.webp" 1x)',
  '@import "https://outside.example/styles.css";',
  'background: u/**/rl(/images/cms/missing.webp)',
  String.raw`background: u\72l(/images/cms/missing.webp)`,
]) {
  it(`rejects CSS resources in blocks and attributes: ${css}`, () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-css-'));
    directories.push(root);
    const siteSettings = { publicUrl: 'https://example.test' };
    expect(() => validateCmsMedia({ siteSettings, html: `<style>.banner { ${css} }</style>` }, root)).toThrow('CSS resource');
    expect(() => validateCmsMedia({ siteSettings, html: `<div style='${css}'>text</div>` }, root)).toThrow('CSS resource');
  });
}

it('allows ordinary CSS without resource references', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-css-'));
  directories.push(root);
  expect(() => validateCmsMedia({ siteSettings: { publicUrl: 'https://example.test' },
    html: '<style>/* layout */ .banner { color: red; display: grid }</style><div style="padding: 2px">Text</div>',
  }, root)).not.toThrow();
});
