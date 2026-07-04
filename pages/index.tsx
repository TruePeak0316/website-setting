import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Star } from "@phosphor-icons/react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { SlidingServiceCards } from "@/components/home/SlidingServiceCards";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";
import { ADVANTAGES, ARTICLE_INDEX, SERVICES } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <SiteLayout>
      <Seo title="誠峰會計師事務所 - 彭裕峰會計師" path="/" />

      <section className="bg-brand-cream">
        <div className="page-shell grid min-h-[calc(100dvh-72px)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">三峽北大特區專業會計師</p>
            <h1 className="hero-gradient-text font-serif text-4xl font-bold leading-[1.12] sm:text-5xl lg:text-6xl">
              誠信為本，峰頂為志
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">
              深耕三峽與鶯歌，提供記帳、報稅、公司設立、財務顧問與會計師簽證服務。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={SITE.bookingUrl} target="_blank" rel="noopener" className="brand-button">
                預約諮詢
                <ArrowRight size={17} weight="bold" />
              </a>
              <Link href="/services" className="brand-button-secondary">
                查看服務
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-brand-light/50 pt-6">
              {[
                ["1998", "在地服務起點"],
                ["2024", "誠峰成立"],
                ["1:1", "會計師諮詢"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-2xl font-bold text-brand-primary">{value}</dt>
                  <dd className="mt-1 text-xs text-zinc-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs border border-brand-light/35 bg-white shadow-[0_30px_90px_rgb(74_53_37_/_0.14)]">
              <Image src="/images/about.jpg" alt="誠峰會計師事務所服務形象" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" priority />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 rounded-xs border border-brand-light/40 bg-white p-5 shadow-[0_18px_60px_rgb(74_53_37_/_0.12)]">
              <p className="flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                <CalendarCheck size={18} className="text-brand-primary" weight="bold" />
                清楚、合規、可長期合作的財稅節奏
              </p>
            </div>
          </div>
        </div>
      </section>

      <SlidingServiceCards services={SERVICES} />

      <section className="section-pad bg-brand-cream">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-charcoal sm:text-4xl">為什麼選擇誠峰</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">我們把傳統事務所的穩定度，結合會計師親自判斷與清楚溝通，讓財務資訊真正能被經營使用。</p>
            <Link href="/about" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
              認識團隊
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {ADVANTAGES.map((item) => (
              <div key={item.id} className="rounded-xs border border-brand-light/30 bg-white p-6 shadow-[0_14px_40px_rgb(74_53_37_/_0.06)]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xs bg-brand-cream text-brand-primary">
                    <Icon name={item.icon} weight="bold" />
                  </span>
                  {item.stat ? <span className="font-serif text-3xl font-bold text-brand-light">{item.stat}</span> : null}
                </div>
                <h3 className="font-bold text-brand-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="page-shell">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-brand-charcoal sm:text-4xl">最新誠峰觀點</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">用白話整理稅務申報、公司經營與財稅解析。</p>
            </div>
            <Link href="/truepeakinsights" className="brand-button-secondary w-fit">
              查看全部
              <ArrowRight size={15} weight="bold" />
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
        <div className="page-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-accent">
              <Star size={17} weight="fill" />
              Google 地圖五星好評
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold">讓財稅問題回到可理解、可處理的狀態</h2>
          </div>
          <a href={SITE.bookingUrl} target="_blank" rel="noopener" className="brand-button bg-brand-accent text-brand-charcoal hover:bg-brand-light">
            預約會計師諮詢
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
