import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesTabs } from "@/components/services/ServicesTabs";
import { SERVICES } from "@/lib/content";

export default function ServicesPage() {
  return (
    <SiteLayout>
      <Seo title="服務項目" path="/services" description="誠峰會計師事務所提供稅務申報、記帳、財務顧問、公司設立、簽證審計、遺產與贈與稅等專業服務。" />
      <PageHero title="我們的服務" description="從日常申報到公司設立與資產傳承，讓每個財稅決策都有清楚依據。" image="/images/Tax Filling.jpg" />
      <section className="section-pad bg-brand-cream">
        <div className="page-shell">
          <ServicesTabs services={SERVICES} />
        </div>
      </section>
    </SiteLayout>
  );
}
