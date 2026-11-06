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
