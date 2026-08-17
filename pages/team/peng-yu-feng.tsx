import { TeamProfilePage } from "@/components/team/TeamProfile";
import { PENG_YU_FENG_PROFILE } from "@/lib/team";
import { getSiteFrame } from "@/lib/cms/static-content";

export default function PengYuFengPage() {
  return <TeamProfilePage profile={PENG_YU_FENG_PROFILE} />;
}

export const getStaticProps = () => ({ props: { siteFrame: getSiteFrame() } });
