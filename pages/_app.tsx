import type { AppProps } from "next/app";
import { Noto_Sans_TC, Playfair_Display, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { SiteContentProvider, type SiteFrame } from "@/lib/cms/site-content";

const notoSansTc = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps<{ siteFrame?: SiteFrame }>) {
  return (
    <div className={`${notoSansTc.variable} ${spaceGrotesk.variable} ${playfair.variable}`}>
      <SiteContentProvider value={pageProps.siteFrame}>
        <Component {...pageProps} />
      </SiteContentProvider>
    </div>
  );
}
