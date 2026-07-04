import { Star } from "@phosphor-icons/react";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import { GOOGLE_REVIEWS } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function TestimonialsPage() {
  return (
    <SiteLayout>
      <Seo title="客戶見證" path="/testimonials" description="看看客戶如何評價誠峰會計師事務所的專業服務與合作經驗。" />
      <PageHero title="客戶見證" description="來自 Google 地圖的合作回饋，記錄客戶對誠峰服務品質與溝通方式的評價。" image="/images/AboutUs.jpg" />
      <section className="section-pad bg-brand-cream">
        <div className="page-shell">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-serif text-3xl font-bold text-brand-charcoal sm:text-4xl">來自 Google 地圖的五星好評</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">以下摘錄自既有客戶回饋，呈現誠峰在專業度、回覆效率與溝通溫度上的服務經驗。</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {GOOGLE_REVIEWS.map((review) => (
              <article key={`${review.author}-${review.age}`} className="rounded-xs border border-brand-light/25 bg-white p-6 shadow-[0_14px_40px_rgb(74_53_37_/_0.06)]">
                <div className="mb-4 flex gap-1 text-brand-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} weight="fill" />
                  ))}
                </div>
                <p className="text-sm leading-7 text-zinc-600">{review.content}</p>
                <p className="mt-5 text-sm font-bold text-brand-charcoal">{review.author}</p>
                <p className="mt-1 text-xs text-zinc-400">{review.age}</p>
              </article>
            ))}
          </div>
          <a href={SITE.googleReviewsUrl} target="_blank" rel="noopener" className="brand-button mt-8">
            查看更多 Google 地圖評論
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
