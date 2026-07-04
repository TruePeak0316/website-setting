import Image from "next/image";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import { TEAM, TIMELINE } from "@/lib/content";

export default function AboutPage() {
  return (
    <SiteLayout>
      <Seo title="關於我們" path="/about" description="誠峰會計師事務所秉持誠信與專業，深耕三鶯地區，致力成為企業長期可靠的財務夥伴。" />
      <PageHero title="關於誠峰" description="從在地記帳服務到會計師專業簽證，誠峰延續務實、穩定與透明的服務精神。" image="/images/AboutUs.jpg" />

      <section className="section-pad bg-brand-cream">
        <div className="page-shell">
          <h2 className="mb-10 font-serif text-3xl font-bold text-brand-charcoal sm:text-4xl">歷史沿革</h2>
          <div className="grid gap-5">
            {TIMELINE.map((item) => (
              <article key={item.year} className="grid gap-4 rounded-xs border border-brand-light/25 bg-white p-6 shadow-[0_14px_40px_rgb(74_53_37_/_0.06)] md:grid-cols-[140px_1fr]">
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

      <section className="section-pad bg-white">
        <div className="page-shell space-y-12">
          {TEAM.map((member, index) => (
            <article key={member.name} className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xs border border-brand-light/30 bg-brand-cream">
                  <Image src={member.image} alt={`${member.name}${member.role}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
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
