import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { load } from 'cheerio';

export function validateCmsMedia(snapshot, publicDirectory) {
  const publicUrl = new URL(snapshot.siteSettings.publicUrl);
  const urls = new Set();
  function collect(value) {
    if (Array.isArray(value)) return value.forEach(collect);
    if (value && typeof value === 'object') {
      if (typeof value.id === 'string' && typeof value.url === 'string' &&
          typeof value.width === 'number' && typeof value.height === 'number') urls.add(value.url);
      return Object.values(value).forEach(collect);
    }
    if (typeof value === 'string' && value.includes('<')) {
      const $ = load(value);
      $('style, [style]').each((_, element) => {
        const css = element.tagName === 'style' ? $(element).text() : $(element).attr('style');
        // Fail closed instead of maintaining a second CSS URL parser. Escapes and
        // resource functions can bypass a simple url(...) extraction expression.
        const normalized = (css ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
        if (/\\|@import\b|(?:url|(?:-webkit-)?image-set|image|src)\s*\(/i.test(normalized)) {
          throw new Error('CMS CSS resource references are not supported; use managed img elements');
        }
      });
      if ($('[srcset]').length) throw new Error('CMS srcset references are not supported; use managed img elements');
      $('img[src]').each((_, image) => urls.add($(image).attr('src')));
    }
  }
  collect(snapshot);
  const root = fs.realpathSync(publicDirectory);
  for (const value of urls) {
    if (!value) throw new Error('CMS image URL is empty');
    const rawPath = value.match(/^(?:https?:\/\/[^/?#]+)?(\/[^?#]*)/i)?.[1];
    let url;
    try { url = new URL(value, publicUrl); } catch { throw new Error('Invalid CMS image URL'); }
    if (!rawPath || url.origin !== publicUrl.origin || url.username || url.password) {
      throw new Error('CMS image must use the public website origin and an absolute path');
    }
    let segments;
    try { segments = rawPath.slice(1).split('/').map(decodeURIComponent); } catch { throw new Error('Invalid CMS image path'); }
    if (segments.some((segment) => !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(segment) || segment === '..')) {
      throw new Error('Unsafe CMS image path');
    }
    const target = path.join(root, ...segments);
    let resolved;
    try { resolved = fs.realpathSync(target); } catch { throw new Error(`CMS image is missing: ${rawPath}`); }
    if (!resolved.startsWith(`${root}${path.sep}`) || !fs.statSync(resolved).isFile()) {
      throw new Error(`CMS image is not a file under public: ${rawPath}`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const snapshotPath = process.env.CMS_PUBLISHED_CONTENT_PATH;
  if (!snapshotPath) throw new Error('CMS_PUBLISHED_CONTENT_PATH is missing');
  validateCmsMedia(JSON.parse(fs.readFileSync(snapshotPath, 'utf8')), path.resolve('public'));
}
