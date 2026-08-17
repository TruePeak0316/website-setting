import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesTabs } from "@/components/services/ServicesTabs";
import { SERVICES } from "@/lib/content";
import { getManagedPage, getSiteFrame } from "@/lib/cms/static-content";
import type { PublishedServicesPageV1 } from "@/lib/cms/published-content-v1";
import type { ServiceSection } from "@/lib/types";
import { PublishedHero, PublishedHtml } from "@/components/cms/PublishedHero";

export default function ServicesPage({ cmsPage }: { cmsPage?: PublishedServicesPageV1 | null }) {
  if (cmsPage) {
    return <CmsServicesPage cmsPage={cmsPage} />;
  }
  return (
    <SiteLayout>
      <Seo title="服務項目" path="/services" description="誠峰會計師事務所提供稅務申報、記帳、財務顧問、公司設立、簽證審計、遺產與贈與稅等專業服務，協助企業穩健經營。" />
      <PageHero title="我們的服務" description="從日常申報到公司設立與資產傳承，讓每個財稅決策都有清楚依據。" image="/images/Tax Filling.webp" />
      <section className="section-pad bg-brand-cream">
        <div className="page-shell">
          <ServicesTabs services={SERVICES} />
        </div>
      </section>
    </SiteLayout>
  );
}

function CmsServicesPage({ cmsPage }: { cmsPage: PublishedServicesPageV1 }) {
  const services: ServiceSection[] = cmsPage.services.map((service) => ({
    id: service.slug || service.id,
    title: service.title,
    summary: service.summary,
    ...(service.image ? { image: service.image.url, imageMedia: service.image } : {}),
    icon: "briefcase",
    sections: service.sections.map((section) => ({
      heading: section.title,
      body: [],
      bodyHtml: section.bodyHtml,
      ...(section.image ? { image: section.image } : {}),
    })),
    ...(service.action ? { action: service.action } : {}),
  }));

  return (
    <SiteLayout>
      <Seo title={cmsPage.hero.title} path="/services" />
      <PublishedHero hero={cmsPage.hero} />
      <section className="section-pad bg-brand-cream">
        <div className="page-shell">
          <PublishedHtml html={cmsPage.introductionHtml} className="mb-10" />
          <ServicesTabs services={services} />
        </div>
      </section>
    </SiteLayout>
  );
}

export const getStaticProps = () => ({ props: { siteFrame: getSiteFrame(), cmsPage: getManagedPage("services") } });
