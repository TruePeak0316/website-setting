import { InsightsExplorer } from "@/components/articles/InsightsExplorer";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import { ARTICLE_INDEX } from "@/lib/content";

export default function TruePeakInsightsPage() {
  return (
    <SiteLayout>
      <Seo title="誠峰觀點" path="/truepeakinsights" description="誠峰會計師事務所分享稅務與財務實務觀點，解析常見問題與法規。" />
      <PageHero title="誠峰觀點" description="整理稅務申報、公司經營與財稅解析，協助企業主用清楚資訊做決策。" image="/Library/PictureOf011.jpg" />
      <section className="section-pad bg-brand-cream">
        <div className="page-shell">
          <InsightsExplorer articles={ARTICLE_INDEX} />
        </div>
      </section>
    </SiteLayout>
  );
}
