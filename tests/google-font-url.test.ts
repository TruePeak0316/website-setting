import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { afterEach, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const loaderPath = require.resolve('next/dist/compiled/@next/font/dist/google/loader');
const originalMock = process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES;
let directory: string | undefined;
afterEach(() => {
  if (originalMock === undefined) delete process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES;
  else process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES = originalMock;
  delete require.cache[loaderPath];
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
});

it.each([
  'https://fonts.gstatic.com/s/font/fixture.woff2',
  'https://fonts.gstatic.com/l/font?kit=fixture&skey=fixture&v=v1',
])('self-hosts a Google font whose URL is %s without network access', async (fontUrl) => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-font-url-'));
  const mocked = path.join(directory, 'responses.cjs');
  fs.writeFileSync(mocked, `module.exports = ${JSON.stringify({
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400&display=swap':
      `@font-face { font-family: 'Space Grotesk'; src: url(${fontUrl}) format('woff2'); }`,
  })};`);
  process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES = mocked;
  delete require.cache[loaderPath];
  const { default: loader } = require(loaderPath);
  const result = await loader({ functionName: 'Space_Grotesk',
    data: [{ weight: '400', subsets: ['latin'], adjustFontFallback: false }],
    isDev: false, isServer: true,
    emitFontFile: (_buffer: Buffer, extension: string) => `/fonts/fixture.${extension}`,
  });
  expect(result.css).toContain('/fonts/fixture.woff2');
  expect(result.css).not.toContain('fonts.gstatic.com');
});
