import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { validateCmsMedia } from '../scripts/validate-cms-media.mjs';

const directories: string[] = [];
afterEach(() => directories.splice(0).forEach((directory) => fs.rmSync(directory, { recursive: true, force: true })));

it('requires managed images, including inline images, in the checked out content tree', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-media-'));
  directories.push(root);
  fs.mkdirSync(path.join(root, 'images/cms'), { recursive: true });
  fs.writeFileSync(path.join(root, 'images/cms/photo.webp'), 'fixture');
  const snapshot = { image: { url: 'https://example.test/images/cms/photo.webp' }, html: '<img src="/images/cms/photo.webp">' };
  expect(() => validateCmsMedia(snapshot, root)).not.toThrow();
  expect(() => validateCmsMedia({ html: '<img src="/images/cms/missing.webp">' }, root)).toThrow('CMS image is missing');
  expect(() => validateCmsMedia({ image: '/images/cms/%2fetc' }, root)).toThrow('Unsafe CMS image path');
  expect(() => validateCmsMedia({ image: '/images/cms/%2e%2e/secret' }, root)).toThrow('Unsafe CMS image path');
});
