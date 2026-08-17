import Head from "next/head";
import { findSeoOverride, useSiteContent } from "@/lib/cms/site-content";
import type { PublishedSeoMetadataV1 } from "@/lib/cms/published-content-v1";

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  metadata?: PublishedSeoMetadataV1;
}

export function Seo({ title, description, path = "", image, type = "website", metadata }: SeoProps) {
  const frame = useSiteContent();
  const override = metadata ?? findSeoOverride(frame, path);
  const rawTitle = override?.title ?? title;
  const absoluteTitle = frame.seo.defaults.titleTemplate.includes("%s") ? frame.seo.defaults.titleTemplate.replace("%s", rawTitle) : `${rawTitle}｜${frame.seo.defaults.titleTemplate}`;
  const resolvedDescription = override?.description
    ?? (metadata
      ? description ?? frame.seo.defaults.defaultDescription
      : frame.source === "cms" ? frame.seo.defaults.defaultDescription : description ?? frame.seo.defaults.defaultDescription);
  const baseUrl = frame.seo.defaults.canonicalSiteUrl.replace(/\/$/, "");
  const url = override?.canonicalUrl ?? `${baseUrl}${path}`;
  const media = override?.openGraphImage ?? frame.seo.defaults.defaultOpenGraphImage;
  const rawImage = media?.url ?? image ?? frame.settings.logo?.url ?? "/images/LOGO.webp";
  const imageUrl = rawImage.startsWith("http") ? rawImage : `${baseUrl}${rawImage}`;
  const robots = override?.noIndex ? frame.seo.defaults.robotsPolicy.replace(/^index/, "noindex") : frame.seo.defaults.robotsPolicy;

  return (
    <Head>
      <title>{absoluteTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="author" content={frame.settings.name} />
      <meta name="robots" content={robots} />
      <meta
        name="keywords"
        content="三峽會計師, 北大會計師, 鶯歌會計師, 記帳, 報稅, 財務顧問, 公司設立, 審計, 會計師簽證"
      />
      <meta property="og:title" content={override?.openGraphTitle ?? absoluteTitle} />
      <meta property="og:description" content={override?.openGraphDescription ?? resolvedDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content={frame.seo.defaults.twitterCard} />
      <meta name="twitter:title" content={absoluteTitle} />
      <meta name="twitter:description" content={override?.openGraphDescription ?? resolvedDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="canonical" href={url} />
      <link rel="icon" href={frame.settings.favicon?.url ?? "/favicon.ico?v=2"} />
    </Head>
  );
}
