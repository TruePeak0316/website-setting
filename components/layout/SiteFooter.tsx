import Link from "next/link";
import { MapPin, Phone, ShieldCheck } from "@phosphor-icons/react";
import { FirebaseViewCounter } from "@/components/layout/FirebaseViewCounter";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { SERVICES } from "@/lib/content";

interface SiteFooterProps {
  showViewCounter?: boolean;
}

export function SiteFooter({ showViewCounter = false }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="page-shell py-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-2 xl:grid-cols-[1.25fr_0.72fr_1fr_1.45fr]">
          <div className="space-y-5">
            <div>
              <p className="font-serif text-2xl font-bold">誠峰會計師事務所</p>
              <p className="mt-1 text-sm tracking-[0.18em] text-brand-accent">TRUEPEAK CPA</p>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/65">
              以誠信、專業與清楚溝通，協助企業建立穩定帳務、合規申報與可執行的財務判斷。
            </p>
            <div className="space-y-2 text-sm text-brand-accent">
              <p className="flex items-center gap-2">
                <ShieldCheck size={17} weight="bold" />
                台北大學會計背景與四大審計經驗
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={17} weight="bold" />
                {SITE.address}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-brand-light">站內導覽</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-brand-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-brand-light">服務項目</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link href={`/services#${service.id}`} className="transition hover:text-brand-accent">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-brand-light">聯絡資訊</h3>
            <div className="space-y-3 text-sm text-white/65">
              <a href={SITE.phoneHref} className="flex items-center gap-2 transition hover:text-brand-accent">
                <Phone size={16} />
                {SITE.phone}
              </a>
              <p>{SITE.email}</p>
              <div className="aspect-video w-full overflow-hidden border border-white/20 bg-white/5">
                <iframe
                  src={SITE.mapEmbedUrl}
                  title={`${SITE.name} Google 地圖位置`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {year} 誠峰會計師事務所｜彭裕峰會計師 All Rights Reserved.</p>
          <div className="flex flex-col gap-2 md:items-end">
            {showViewCounter ? <FirebaseViewCounter /> : null}
            <p>本網站資訊為一般說明，個案仍須依實際資料與主管機關規定判斷。</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
