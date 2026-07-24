import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";

export default function TeamPage() {
  return (
    <SiteLayout>
      <Seo title="專業團隊" path="/team" description="認識誠峰會計師事務所的專業團隊，了解我們如何陪伴企業處理財務與稅務需求。" />
      <PageHero title="專業團隊" description="由不同專業與經驗組成的團隊，陪伴企業穩健面對每一個財稅決策。" image="/images/home-trust-team.webp" />
      <section className="section-pad min-h-[44dvh] bg-brand-cream" aria-label="專業團隊內容區">
        <div className="page-shell flex justify-center">
          <article className="group/card w-full max-w-[250px] overflow-hidden rounded-[4px] border border-brand-light/45 bg-white shadow-[0_18px_60px_rgb(7_86_111_/_0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgb(7_86_111_/_0.16)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-light/35">
              <Image
                src="/images/彭裕峰.jpg"
                alt="彭裕峰會計師"
                fill
                sizes="(min-width: 640px) 384px, calc(100vw - 2rem)"
                className="object-cover object-center transition duration-700 group-hover/card:scale-[1.03]"
              />
              <p className="absolute bottom-0 left-0 rounded-tr-[4px] bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white">
                主持會計師
              </p>
            </div>
            <Link href="/team/peng-yu-feng" className="group/info relative isolate flex items-center justify-between gap-4 overflow-hidden px-3 py-3 text-brand-dark" aria-label="查看彭裕峰介紹">
              <span className="absolute inset-y-0 left-0 z-0 w-0 bg-brand-primary transition-[width] duration-500 ease-out group-hover/info:w-full" aria-hidden="true" />
              <h2 className="relative z-10 text-lg font-bold transition-colors duration-300 group-hover/info:text-white">彭裕峰</h2>
              <span className="relative z-10 text-brand-dark transition-colors duration-300 group-hover/info:text-white" aria-hidden="true">
                <ArrowRight size={18} weight="bold" />
              </span>
            </Link>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
