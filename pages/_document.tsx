import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="zh-Hant">
      <Head>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href="/images/LOGO.PNG" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
