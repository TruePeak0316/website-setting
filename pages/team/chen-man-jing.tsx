import { TeamProfilePage } from "@/components/team/TeamProfile";
import { CHEN_MAN_JING_PROFILE } from "@/lib/team";
import { getSiteFrame } from "@/lib/cms/static-content";

export default function ChenManJingPage() {
  return <TeamProfilePage profile={CHEN_MAN_JING_PROFILE} />;
}

export const getStaticProps = () => ({ props: { siteFrame: getSiteFrame() } });
