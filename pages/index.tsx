import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Star } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { SlidingServiceCards } from "@/components/home/SlidingServiceCards";
import { TrustScaleSection } from "@/components/home/TrustScaleSection";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ARTICLE_INDEX, SERVICES } from "@/lib/content";

const heroDescription = "深耕三峽與鶯歌，提供記帳、報稅、公司設立、財務顧問與會計師簽證服務。";

export default function HomePage() {
  return (
    <SiteLayout showViewCounter>
      <Seo title="誠峰會計師事務所 - 彭裕峰會計師" path="/" />

      <section className="home-hero relative overflow-hidden bg-brand-cream">
        <div className="home-hero-grid" aria-hidden="true" />
        <div className="home-hero-shape home-hero-square" aria-hidden="true" />
        <div className="home-hero-shape home-hero-diamond" aria-hidden="true" />
        <div className="home-hero-shape home-hero-triangle" aria-hidden="true" />
        <div className="home-hero-line home-hero-line-a" aria-hidden="true" />
        <div className="home-hero-line home-hero-line-b" aria-hidden="true" />
        <div className="page-shell relative grid min-h-[calc(100dvh-72px)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 max-w-2xl">
            <div className="mx-auto mb-9 w-72 max-w-[78vw] sm:w-80 lg:mx-0 lg:w-[400px]">
              <Image src="/images/LOGO.webp" alt="誠峰會計師事務所" width={520} height={180} className="h-auto w-full object-contain" priority />
            </div>
            <p className="eyebrow mb-5">三峽北大特區專業會計師</p>
            <h1 className="hero-gradient-text font-serif text-4xl font-bold leading-[1.12] sm:text-5xl lg:text-6xl">
              誠信為本，峰頂為志
            </h1>
            <LoopingHeroText text={heroDescription} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className="brand-button-secondary hero-cta-secondary">
                查看服務
                <ArrowRight size={15} weight="bold" className="hero-cta-icon" />
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-brand-light/50 pt-6">
              {[
                ["1998", "在地服務起點"],
                ["2024", "誠峰成立"],
                ["1v1", "會計師諮詢"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-2xl font-bold text-brand-primary">{value}</dt>
                  <dd className="mt-1 text-xs text-zinc-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="home-hero-photo-wrap relative">
            <div className="home-hero-photo-frame relative aspect-[4/5] overflow-hidden">
              <div className="home-hero-photo-soft-edge absolute inset-0">
                <Image src="/images/about.webp" alt="誠峰會計師事務所服務形象" fill sizes="(min-width: 1024px) 42vw, 100vw" className="home-hero-photo-image object-cover" style={{ objectPosition: "82% center" }} priority />
              </div>
            </div>
            <div className="absolute -bottom-5 left-5 right-5 z-20 rounded-xs border border-brand-light/40 bg-white p-5 shadow-[0_18px_60px_rgb(7_86_111_/_0.12)]">
              <p className="flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                <CalendarCheck size={18} className="text-brand-primary" weight="bold" />
                清楚、合規、可長期合作的財稅節奏
              </p>
            </div>
          </div>
        </div>
      </section>

      <SlidingServiceCards services={SERVICES} />

      <TrustScaleSection />

      <section className="section-pad bg-white">
        <div className="page-shell">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-brand-charcoal sm:text-4xl">最新誠峰觀點</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">用白話整理稅務申報、公司經營與財稅解析。</p>
            </div>
            <Link href="/truepeakinsights" className="brand-button-secondary hero-cta-secondary w-fit">
              查看全部
              <ArrowRight size={15} weight="bold" className="hero-cta-icon" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {ARTICLE_INDEX.slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-charcoal py-14 text-white">
        <div className="page-shell">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-accent">
              <Star size={17} weight="fill" />
              Google 地圖五星好評
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold">讓財稅問題回到可理解、可處理的狀態</h2>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function LoopingHeroText({ text }: { text: string }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const characters = Array.from(text);

  useEffect(() => {
    const delay = visibleCount >= characters.length ? 3000 : 38;
    const timer = window.setTimeout(() => {
      setVisibleCount((current) => (current >= characters.length ? 0 : current + 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [characters.length, visibleCount]);

  return (
    <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600" aria-label={text}>
      {characters.map((char, index) => (
        <span key={`${char}-${index}`} className={`hero-copy-char ${index < visibleCount ? "is-visible" : ""}`} aria-hidden="true">
          {char}
        </span>
      ))}
    </p>
  );
}
