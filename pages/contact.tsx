import Image from "next/image";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { LineCopyButton } from "@/components/contact/LineCopyButton";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { MarqueeControls } from "@/components/ui/MarqueeControls";
import { PageHero } from "@/components/ui/PageHero";
import { useLoopingMarqueeScroll } from "@/components/ui/useLoopingMarqueeScroll";
import { ENVIRONMENT_IMAGES } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  const photoScrollerRef = useRef<HTMLDivElement>(null);
  const photoTrackRef = useRef<HTMLDivElement>(null);
  const [photoCycleWidth, setPhotoCycleWidth] = useState(0);
  const {
    onScroll: onPhotoScroll,
    scrollByAmount: scrollPhotoByAmount,
  } = useLoopingMarqueeScroll({ enabled: photoCycleWidth > 0, cycleWidth: photoCycleWidth, scrollerRef: photoScrollerRef });

  useEffect(() => {
    const track = photoTrackRef.current;
    if (!track) {
      return;
    }

    const updateCycleWidth = () => {
      setPhotoCycleWidth(Math.round(track.scrollWidth / 3));
    };

    updateCycleWidth();

    const resizeObserver = new ResizeObserver(updateCycleWidth);
    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <SiteLayout>
      <Seo title="聯絡我們" path="/contact" description="歡迎聯絡誠峰會計師事務所，了解更多稅務與財務服務。" />
      <PageHero title="聯絡我們" description="歡迎預約諮詢，讓我們協助您釐清稅務、帳務與公司設立相關問題。" image="/images/environment01.webp" />

      <section className="overflow-hidden bg-white py-8">
        <div className="page-shell mb-4 flex justify-end">
          <MarqueeControls label="辦公環境照片" onPrevious={() => scrollPhotoByAmount(-436)} onNext={() => scrollPhotoByAmount(436)} />
        </div>
        <div
          ref={photoScrollerRef}
          className="contact-photo-marquee marquee-scrollable service-marquee-mask"
          tabIndex={0}
          onScroll={onPhotoScroll}
          aria-label="誠峰會計師事務所辦公環境照片，可自動或手動左右滑動"
        >
          <div ref={photoTrackRef} className="contact-photo-track">
            {[...ENVIRONMENT_IMAGES, ...ENVIRONMENT_IMAGES, ...ENVIRONMENT_IMAGES].map((image, index) => (
              <div key={`${image}-${index}`} className="relative h-56 w-[320px] shrink-0 overflow-hidden rounded-xs border border-brand-light/25 bg-brand-cream md:w-[420px]">
                <Image src={image} alt={index < ENVIRONMENT_IMAGES.length ? "誠峰會計師事務所辦公環境" : ""} fill sizes="420px" className="object-cover" priority={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="page-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="overflow-hidden rounded-xs border border-brand-light/25 bg-white shadow-[0_14px_40px_rgb(0_63_115_/_0.06)]">
            <iframe
              src={SITE.mapEmbedUrl}
              title="誠峰會計師事務所 Google 地圖"
              loading="lazy"
              className="h-[340px] w-full border-0 sm:h-[380px] lg:h-[360px]"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="space-y-5">
            <div className="brand-card rounded-xs p-6">
              <h2 className="font-serif text-2xl font-bold text-brand-charcoal">聯絡資訊</h2>
              <div className="mt-6 space-y-4 text-sm text-zinc-600">
                <p className="flex gap-3">
                  <MapPin size={20} className="shrink-0 text-brand-primary" weight="bold" />
                  <span>{SITE.address}</span>
                </p>
                <a href={SITE.phoneHref} className="flex gap-3 transition hover:text-brand-primary">
                  <Phone size={20} className="shrink-0 text-brand-primary" weight="bold" />
                  <span>{SITE.phone}</span>
                </a>
                <p className="flex gap-3">
                  <EnvelopeSimple size={20} className="shrink-0 text-brand-primary" weight="bold" />
                  <span>{SITE.email}</span>
                </p>
                <p>服務時間：08:30-12:30、13:30-17:30</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={SITE.bookingUrl} target="_blank" rel="noopener" className="brand-button">
                  預約諮詢
                </a>
              </div>
            </div>

            <div className="brand-card grid gap-5 rounded-xs p-6 sm:grid-cols-[150px_1fr] sm:items-center">
              <div className="relative aspect-square overflow-hidden rounded-xs border border-brand-light/25 bg-white">
                <Image src="/images/LineQRcode.webp" alt="誠峰 LINE 官方帳號 QR Code" fill sizes="150px" className="object-contain p-2" />
              </div>
              <div>
                <h3 className="font-bold text-brand-charcoal">官方 LINE 帳號</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600">加入好友後可傳送資料、預約諮詢或確認文件準備方向。</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={SITE.lineUrl} target="_blank" rel="noopener" className="inline-flex items-center text-sm font-bold text-brand-primary transition hover:text-brand-dark">
                    加入好友
                  </a>
                  <LineCopyButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
