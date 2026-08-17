import { InsightsExplorer } from "@/components/articles/InsightsExplorer";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import { ARTICLE_INDEX } from "@/lib/content";
import { getSiteFrame } from "@/lib/cms/static-content";
import { loadAllArticles } from "@/lib/articles";
import type { ArticleSummary } from "@/lib/types";

export default function TruePeakInsightsPage({ articles = ARTICLE_INDEX }: { articles?: ArticleSummary[] }) {
  return (
    <SiteLayout>
      <Seo title="誠峰觀點" path="/truepeakinsights" description="誠峰會計師事務所分享稅務與財務實務文章，整理營業稅、扣繳、公司設立、遺產及贈與稅等常見問題與法規。" />
      <PageHero title="誠峰觀點" description="整理稅務申報、公司經營與財稅解析，協助企業主用清楚資訊做決策。" image="/Library/PictureOf011.webp" />
      <section className="section-pad bg-brand-cream">
        <div className="page-shell">
          <InsightsExplorer articles={articles} />
        </div>
      </section>
    </SiteLayout>
  );
}

export const getStaticProps = () => ({ props: { siteFrame: getSiteFrame(), articles: loadAllArticles() } });
