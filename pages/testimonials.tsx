import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight, ChatCircleText, ShieldCheck, Star } from "@phosphor-icons/react";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { MarqueeControls } from "@/components/ui/MarqueeControls";
import { PageHero } from "@/components/ui/PageHero";
import { useLoopingMarqueeScroll } from "@/components/ui/useLoopingMarqueeScroll";
import { GOOGLE_REVIEWS } from "@/lib/content";
import { SITE } from "@/lib/site";

const REVIEW_STATS = [
  { value: "4.9", label: "Google 評分" },
  { value: "28+", label: "公開評論" },
  { value: "5★", label: "客戶推薦" },
];

export default function TestimonialsPage() {
  const featuredReview = GOOGLE_REVIEWS[0];
  const supportingReviews = GOOGLE_REVIEWS.slice(1);
  const reviewScrollerRef = useRef<HTMLDivElement>(null);
  const reviewRailRef = useRef<HTMLDivElement>(null);
  const [reviewCycleWidth, setReviewCycleWidth] = useState(0);
  const {
    onScroll: onReviewScroll,
    scrollByAmount: scrollReviewByAmount,
  } = useLoopingMarqueeScroll({ enabled: reviewCycleWidth > 0, cycleWidth: reviewCycleWidth, scrollerRef: reviewScrollerRef });

  useEffect(() => {
    const rail = reviewRailRef.current;
    if (!rail) {
      return;
    }

    const updateCycleWidth = () => {
      setReviewCycleWidth(Math.round(rail.scrollWidth / 3));
    };

    updateCycleWidth();

    const resizeObserver = new ResizeObserver(updateCycleWidth);
    resizeObserver.observe(rail);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <SiteLayout>
      <Seo title="客戶見證" path="/testimonials" description="看看客戶如何評價誠峰會計師事務所的專業服務與合作經驗。" />
      <PageHero title="客戶見證" description="來自 Google 地圖的合作回饋，記錄客戶對誠峰服務品質與溝通方式的評價。" image="/images/AboutUs.webp" />

      <section className="testimonial-section section-pad overflow-hidden bg-brand-cream">
        <div className="page-shell">
          <div className="testimonial-summary relative overflow-hidden rounded-xs border border-brand-light/30 bg-white p-6 shadow-[0_18px_60px_rgb(0_63_115_/_0.08)] sm:p-8">
            <div className="testimonial-orbit testimonial-orbit-a" />
            <div className="testimonial-orbit testimonial-orbit-b" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-xs border border-brand-light/30 bg-brand-cream px-3 py-2 text-xs font-bold text-brand-primary">
                  <ShieldCheck size={16} weight="bold" />
                  Google 客戶回饋
                </div>
                <h2 className="font-serif text-3xl font-bold leading-tight text-brand-charcoal sm:text-4xl">被推薦的原因，來自每一次清楚回覆</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">以下摘錄自既有客戶回饋，呈現誠峰在專業度、回覆效率與溝通溫度上的服務經驗。</p>
              </div>

              <div className="grid grid-cols-3 divide-x divide-brand-light/40 border-y border-brand-light/30 py-4 lg:border-y-0 lg:py-0">
                {REVIEW_STATS.map((stat) => (
                  <div key={stat.label} className="px-4 text-center first:pl-0 last:pr-0">
                    <p className="font-serif text-3xl font-bold text-brand-primary sm:text-4xl">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold text-zinc-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <article className="testimonial-feature testimonial-card rounded-xs border border-brand-primary/25 bg-brand-dark p-6 text-white shadow-[0_22px_70px_rgb(0_63_115_/_0.16)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-1 text-brand-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={18} weight="fill" className="testimonial-star" />
                  ))}
                </div>
                <ChatCircleText size={34} className="text-white/20" weight="duotone" />
              </div>
              <p className="mt-8 font-serif text-2xl font-bold leading-relaxed sm:text-3xl">「{featuredReview.content}」</p>
              <div className="mt-8 border-t border-white/15 pt-5">
                <p className="text-sm font-bold">{featuredReview.author}</p>
                <p className="mt-1 text-xs text-white/55">{featuredReview.age}</p>
              </div>
            </article>

            <div className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-4 md:hidden">
                <p className="text-sm font-bold text-brand-charcoal">更多客戶回饋</p>
                <p className="text-xs font-semibold text-brand-primary">自然滑動</p>
              </div>
              <div className="mb-3 flex justify-end md:hidden">
                <MarqueeControls label="客戶回饋" onPrevious={() => scrollReviewByAmount(-340)} onNext={() => scrollReviewByAmount(340)} />
              </div>
              <div
                ref={reviewScrollerRef}
                className="testimonial-review-window marquee-scrollable -mx-4 px-4 md:mx-0 md:px-0"
                tabIndex={0}
                onScroll={onReviewScroll}
                aria-label="更多客戶回饋，可自動或手動左右滑動"
              >
                <div ref={reviewRailRef} className="testimonial-review-rail no-scrollbar flex gap-4 pb-4 pt-1 md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
                  {[...supportingReviews, ...supportingReviews, ...supportingReviews].map((review, index) => (
                    <article
                      key={`${review.author}-${review.age}-${index}`}
                      aria-hidden={index < supportingReviews.length || index >= supportingReviews.length * 2}
                      className={`testimonial-card testimonial-review-card w-[82vw] shrink-0 rounded-xs border border-brand-light/25 bg-white p-5 shadow-[0_14px_40px_rgb(0_63_115_/_0.06)] sm:w-[58vw] md:w-auto md:min-w-0 ${index < supportingReviews.length || index >= supportingReviews.length * 2 ? "md:hidden" : ""}`}
                      style={{ "--testimonial-index": index % supportingReviews.length } as CSSProperties}
                    >
                      <div className="mb-4 flex gap-1 text-brand-accent">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star key={starIndex} size={15} weight="fill" className="testimonial-star" />
                        ))}
                      </div>
                      <p className="text-sm leading-7 text-zinc-600">{review.content}</p>
                      <div className="mt-5 flex items-end justify-between gap-4 border-t border-brand-light/25 pt-4">
                        <div>
                          <p className="text-sm font-bold text-brand-charcoal">{review.author}</p>
                          <p className="mt-1 text-xs text-zinc-400">{review.age}</p>
                        </div>
                        <span className="testimonial-card-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-brand-cream text-brand-primary">
                          <ArrowRight size={16} weight="bold" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div className="testimonial-carousel-cue mt-2 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
                {supportingReviews.slice(0, 3).map((review, index) => (
                  <span key={review.author} className={`h-1.5 rounded-full bg-brand-primary/35 ${index === 0 ? "w-6" : "w-1.5"}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-brand-light/35 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-7 text-zinc-600">想看完整評論或留下合作回饋，可以前往 Google 地圖查看最新公開評價。</p>
            <a href={SITE.googleReviewsUrl} target="_blank" rel="noopener" className="testimonial-cta brand-button w-fit">
              查看更多 Google 地圖評論
              <ArrowRight size={16} weight="bold" className="testimonial-cta-icon" />
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
