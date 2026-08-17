import { createContext, useContext, type ReactNode } from "react";
import { NAV_ITEMS, SITE } from "../site";
import { SERVICES } from "../content";
import type { PublishedContentV1, PublishedMediaAssetV1, PublishedPageSeoOverrideV1 } from "./published-content-v1";

export interface SiteFrame {
  source: "legacy" | "cms";
  settings: {
    name: string; fullName: string; description: string; url: string; phone: string; phoneHref: string;
    email: string; address: string; lineId: string | null; lineUrl: string | null; bookingUrl: string | null;
    mapUrl: string | null; mapEmbedUrl: string; reviewUrl: string | null;
    logo: PublishedMediaAssetV1 | null; favicon: PublishedMediaAssetV1 | null;
  };
  navigation: Array<{ key: string; href: string; label: string; icon: PublishedMediaAssetV1 | null }>;
  footerServices: Array<{ id: string; href: string; title: string }>;
  seo: PublishedContentV1["seo"];
}

const legacyFrame: SiteFrame = {
  source: "legacy",
  settings: {
    name: SITE.name, fullName: SITE.fullName, description: SITE.description, url: SITE.url, phone: SITE.phone,
    phoneHref: SITE.phoneHref, email: SITE.email, address: SITE.address, lineId: SITE.lineId, lineUrl: SITE.lineUrl,
    bookingUrl: null, mapUrl: SITE.mapUrl, mapEmbedUrl: SITE.mapEmbedUrl, reviewUrl: SITE.googleReviewsUrl,
    logo: null, favicon: null,
  },
  navigation: NAV_ITEMS.map((item) => ({ key: item.href, ...item, icon: null })),
  footerServices: SERVICES.map((service) => ({ id: service.id, href: `/services#${service.id}`, title: service.title })),
  seo: {
    defaults: {
      titleTemplate: `%s｜${SITE.name}`, defaultDescription: SITE.description, defaultOpenGraphImage: null,
      twitterCard: "summary_large_image", canonicalSiteUrl: SITE.url, robotsPolicy: "index,follow", sitemapIncludeByDefault: true,
    },
    pageOverrides: [],
  },
};

export function buildSiteFrame(content: PublishedContentV1 | null): SiteFrame {
  if (!content) return legacyFrame;
  const settings = content.siteSettings;
  const servicesPage = content.pages.services;
  const footerServices = isEmptyManagedPage(servicesPage)
    ? legacyFrame.footerServices
    : servicesPage.services.map((service) => ({
        id: service.id,
        href: `/services#${encodeURIComponent(service.slug || service.id)}`,
        title: service.title,
      }));
  return {
    source: "cms",
    settings: {
      name: settings.siteName, fullName: settings.displayName, description: settings.description, url: settings.publicUrl,
      phone: settings.phoneNumber, phoneHref: settings.telephoneHref, email: settings.email, address: settings.businessAddress,
      lineId: settings.lineId, lineUrl: settings.lineUrl, bookingUrl: settings.bookingUrl, mapUrl: settings.mapUrl,
      mapEmbedUrl: SITE.mapEmbedUrl, reviewUrl: settings.reviewUrl, logo: settings.logo, favicon: settings.favicon,
    },
    navigation: content.navigation.filter(({ visible }) => visible).sort((a, b) => a.order - b.order || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)).map(({ key, path: href, label, icon }) => ({ key, href, label, icon })),
    footerServices,
    seo: content.seo,
  };
}

const SiteContentContext = createContext<SiteFrame>(legacyFrame);

export function SiteContentProvider({ value, children }: { value?: SiteFrame; children: ReactNode }) {
  return <SiteContentContext.Provider value={value ?? legacyFrame}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteFrame {
  return useContext(SiteContentContext);
}

export function findSeoOverride(frame: SiteFrame, route: string): PublishedPageSeoOverrideV1 | undefined {
  return frame.seo.pageOverrides.find((item) => item.route === route);
}

export function isEmptyManagedPage(page: PublishedContentV1["pages"][keyof PublishedContentV1["pages"]]): boolean {
  const heroEmpty = page.hero.eyebrow === null && page.hero.title === "" && page.hero.description === null && page.hero.image === null && page.hero.primaryAction === null && page.hero.secondaryAction === null;
  if (!heroEmpty) return false;
  if ("introductionHtml" in page && page.introductionHtml !== "") return false;
  if ("advantages" in page && (page.advantages.length > 0 || page.featuredArticleSlugs.length > 0)) return false;
  if ("values" in page && (page.values.length > 0 || page.timeline.length > 0 || page.team.length > 0)) return false;
  if ("services" in page && page.services.length > 0) return false;
  if ("testimonials" in page && page.testimonials.length > 0) return false;
  return true;
}
