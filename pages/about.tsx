import Image from "next/image";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import { TEAM, TIMELINE } from "@/lib/content";

const ABOUT_VALUES = [
  {
    title: "透明",
    description: "服務範圍、申報風險與費用安排都先說清楚，讓客戶能安心判斷下一步。",
  },
  {
    title: "穩定",
    description: "從日常帳務到年度申報，建立可持續的流程，讓財務工作不再只靠臨時補救。",
  },
  {
    title: "可理解",
    description: "把稅務與會計語言轉成經營者聽得懂的判斷依據，協助做出務實決策。",
  },
];

export default function AboutPage() {
  return (
    <SiteLayout>
      <Seo title="關於我們" path="/about" description="誠峰會計師事務所秉持誠信與專業，深耕三鶯地區，致力成為企業長期可靠的財務夥伴。" />
      <PageHero title="關於誠峰" description="從在地記帳服務到會計師專業簽證，誠峰延續務實、穩定與透明的服務精神。" image="/images/AboutUs.webp" />

      <section className="about-scroll-section section-pad bg-white">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-brand-primary">誠信為本，峰頂為志</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-brand-charcoal sm:text-4xl">把會計專業變成企業能長期依靠的制度</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {ABOUT_VALUES.map((value) => (
              <article key={value.title} className="rounded-xs border border-brand-light/30 bg-brand-cream/55 p-5">
                <h3 className="text-lg font-bold text-brand-primary">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-scroll-section section-pad bg-brand-cream">
        <div className="page-shell grid gap-10 lg:grid-cols-[280px_1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-semibold text-brand-primary">歷史沿革</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-brand-charcoal sm:text-4xl">從在地服務走向會計師專業</h2>
            <p className="mt-5 text-sm leading-7 text-zinc-600">每一次搬遷、加入與成立，都延續同一件事：讓客戶在稅務與財務上有人可以信任。</p>
          </div>
          <div className="grid gap-5">
            {TIMELINE.map((item) => (
              <article key={item.year} className="about-timeline-card grid gap-4 rounded-xs border border-brand-light/25 bg-white p-6 shadow-[0_14px_40px_rgb(0_63_115_/_0.06)] md:grid-cols-[140px_1fr]">
                <p className="font-serif text-4xl font-bold text-brand-primary">{item.year}</p>
                <div>
                  <h3 className="text-lg font-bold text-brand-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-scroll-section section-pad bg-white">
        <div className="page-shell space-y-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand-primary">專業團隊</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-brand-charcoal sm:text-4xl">用不同世代的經驗，一起把關每個決策</h2>
          </div>
          {TEAM.map((member, index) => (
            <article key={member.name} className="about-team-section grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xs border border-brand-light/30 bg-brand-cream">
                  <Image src={member.image} alt={`${member.name}${member.role}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-700 lg:hover:scale-[1.03]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-primary">{member.role}</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-brand-charcoal">{member.name}</h2>
                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-600">
                  {member.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {member.highlights ? (
                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {member.highlights.map((highlight) => (
                      <p key={highlight} className="rounded-xs border border-brand-light/30 bg-brand-cream/50 px-3 py-2 text-xs font-semibold text-brand-primary">
                        {highlight}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
