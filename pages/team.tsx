import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { TeamMemberCard } from "@/components/team/TeamProfile";
import { PageHero } from "@/components/ui/PageHero";
import { TEAM_PROFILES } from "@/lib/team";
import { getSiteFrame } from "@/lib/cms/static-content";

export default function TeamPage() {
  return (
    <SiteLayout>
      <Seo title="專業團隊" path="/team" description="認識誠峰會計師事務所的專業團隊，了解我們如何陪伴企業處理財務與稅務需求。" />
      <PageHero title="專業團隊" description="由不同專業與經驗組成的團隊，陪伴企業穩健面對每一個財稅決策。" image="/images/home-trust-team.webp" />
      <section className="section-pad min-h-[44dvh] bg-brand-cream" aria-label="專業團隊內容區">
        <div className="page-shell">
          <div className="mx-auto grid max-w-[540px] grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 sm:gap-10">
            {TEAM_PROFILES.map((profile) => (
              <TeamMemberCard key={profile.slug} profile={profile} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export const getStaticProps = () => ({ props: { siteFrame: getSiteFrame() } });
