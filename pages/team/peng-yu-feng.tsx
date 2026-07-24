import Image from "next/image";
import { Briefcase, Certificate, Check, EnvelopeSimple, GraduationCap, Lightbulb, Phone } from "@phosphor-icons/react";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";

const EXPERIENCE = [
  "安侯建業聯合會計師事務所審計部小組長",
  "北區國稅局桃園分局遺贈稅值班會計師",
  "新北市政府經濟發展局值班會計師",
  "經濟部投資審議司值班會計師",
  "中華會審財稅專業協會會員",
  "會計師公會國際暨兩岸服務委員會成員",
];

const SPECIALTIES = [
  "稅務與帳務整合規劃",
  "財務報表查核簽證與稅務簽證",
  "公司設立與投資架構規劃",
  "節稅策略與稅務風險評估",
  "內控制度與帳務流程建置",
  "專業諮詢與其他確信服務",
];

function ProfileSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-xl font-bold text-brand-charcoal">
        <span className="text-brand-primary" aria-hidden="true">{icon}</span>
        <span>{title}</span>
      </h2>
      <div className="mt-4 text-[15px] leading-8 text-zinc-700">{children}</div>
    </section>
  );
}

export default function PengYuFengPage() {
  return (
    <SiteLayout>
      <Seo title="彭裕峰｜主持會計師" path="/team/peng-yu-feng" description="彭裕峰主持會計師的資格、學歷、經歷與專長介紹。" />
      <PageHero
        title={
          <>
            專業團隊 &gt; <span className="hero-gradient-text-on-dark">彭裕峰</span>
          </>
        }
        image="/images/home-trust-team.webp"
      />
      <section className="section-pad bg-white" aria-label="彭裕峰專業介紹內容區">
        <div className="page-shell grid gap-12 lg:grid-cols-[350px_minmax(0,1fr)] lg:items-start lg:gap-20">
          <div className="mx-auto w-full max-w-[350px] lg:mx-0">
            <div className="relative aspect-square w-full overflow-hidden rounded-[4px] bg-brand-light/35">
              <Image src="/images/彭裕峰.jpg" alt="彭裕峰主持會計師" fill sizes="(min-width: 1024px) 350px, 100vw" className="object-cover" priority />
            </div>
            <div className="pt-5">
              <p className="text-sm font-medium text-brand-primary">主持會計師</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-brand-charcoal">彭裕峰</h2>
            </div>
            <div className="mt-6 border-t border-brand-light/40 pt-5">
              <div className="grid gap-3 text-sm text-brand-dark">
                <a href="tel:0286720074" className="inline-flex items-center gap-3 transition-colors hover:text-brand-primary">
                  <Phone size={17} weight="regular" aria-hidden="true" />
                  <span>02-86720074</span>
                </a>
                <a href="mailto:anguspeng@tpcpa.com.tw" className="inline-flex items-center gap-3 transition-colors hover:text-brand-primary">
                  <EnvelopeSimple size={17} weight="regular" aria-hidden="true" />
                  <span>anguspeng@tpcpa.com.tw</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10">
            <ProfileSection title="資格" icon={<Certificate size={23} weight="regular" />}>
              <p>中華民國會計師高考及格</p>
            </ProfileSection>

            <ProfileSection title="學歷" icon={<GraduationCap size={23} weight="regular" />}>
              <p>國立台北大學會計系學士</p>
              <p>國立台北大學應用外語系學士</p>
            </ProfileSection>

            <ProfileSection title="經歷" icon={<Briefcase size={23} weight="regular" />}>
              <ul className="space-y-1">
                {EXPERIENCE.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </ProfileSection>

            <ProfileSection title="專長" icon={<Lightbulb size={23} weight="regular" />}>
              <ul className="space-y-1">
                {SPECIALTIES.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={16} weight="bold" className="mt-1 shrink-0 text-brand-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
