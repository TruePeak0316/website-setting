import Head from "next/head";
import { SITE } from "@/lib/site";

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

export function Seo({ title, description = SITE.description, path = "", image = "/images/LOGO.webp", type = "website" }: SeoProps) {
  const absoluteTitle = title.includes(SITE.name) ? title : `${title}｜${SITE.name}`;
  const url = `${SITE.url}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE.url}${image}`;

  return (
    <Head>
      <title>{absoluteTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={SITE.name} />
      <meta
        name="keywords"
        content="三峽會計師, 北大會計師, 鶯歌會計師, 記帳, 報稅, 財務顧問, 公司設立, 審計, 會計師簽證"
      />
      <meta property="og:title" content={absoluteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={absoluteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="canonical" href={url} />
    </Head>
  );
}
