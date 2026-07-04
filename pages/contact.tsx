import Image from "next/image";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react";
import { LineCopyButton } from "@/components/contact/LineCopyButton";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import { ENVIRONMENT_IMAGES } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  return (
    <SiteLayout>
      <Seo title="聯絡我們" path="/contact" description="歡迎聯絡誠峰會計師事務所，了解更多稅務與財務服務。" />
      <PageHero title="聯絡我們" description="歡迎預約諮詢，讓我們協助您釐清稅務、帳務與公司設立相關問題。" image="/images/environment01.jpg" />

      <section className="overflow-hidden bg-white py-8">
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {ENVIRONMENT_IMAGES.map((image) => (
            <div key={image} className="relative h-56 min-w-[320px] overflow-hidden rounded-xs border border-brand-light/25 bg-brand-cream md:min-w-[420px]">
              <Image src={image} alt="誠峰會計師事務所辦公環境" fill sizes="420px" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="page-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-xs border border-brand-light/25 bg-white shadow-[0_14px_40px_rgb(74_53_37_/_0.06)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.5775814850554!2d121.37145137604894!3d24.94645634180992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34681d18beb9d4fd%3A0x99a2525f6c24dc96!2z6Kqg5bOw5pyD6KiI5bir5LqL5YuZ5omAIC8g5rC46IGW56iF5YuZ6KiY5biz5aOr5LqL5YuZ5omA!5e0!3m2!1szh-TW!2stw!4v1752032398375!5m2!1szh-TW!2stw"
              title="誠峰會計師事務所 Google 地圖"
              loading="lazy"
              className="h-[420px] w-full border-0"
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
                <LineCopyButton />
              </div>
            </div>

            <div className="brand-card grid gap-5 rounded-xs p-6 sm:grid-cols-[150px_1fr] sm:items-center">
              <div className="relative aspect-square overflow-hidden rounded-xs border border-brand-light/25 bg-white">
                <Image src="/images/LineQRcode.png" alt="誠峰 LINE 官方帳號 QR Code" fill sizes="150px" className="object-contain p-2" />
              </div>
              <div>
                <h3 className="font-bold text-brand-charcoal">官方 LINE 帳號</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600">加入好友後可傳送資料、預約諮詢或確認文件準備方向。</p>
                <a href={SITE.lineUrl} target="_blank" rel="noopener" className="mt-4 inline-flex text-sm font-bold text-brand-primary">
                  加入好友
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
