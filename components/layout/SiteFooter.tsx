import Link from "next/link";
import { MapPin, Phone, ShieldCheck } from "@phosphor-icons/react";
import { FirebaseViewCounter } from "@/components/layout/FirebaseViewCounter";
import { useSiteContent } from "@/lib/cms/site-content";
import { PublishedMediaImage } from "@/components/cms/PublishedHero";

interface SiteFooterProps {
  showViewCounter?: boolean;
}

export function SiteFooter({ showViewCounter = false }: SiteFooterProps) {
  const { footerServices, navigation, settings, source } = useSiteContent();
  const year = new Date().getFullYear();
  const brandTitle = source === "cms" ? settings.fullName : "誠峰會計師事務所";
  const brandSubtitle = source === "cms" ? settings.name : "TRUEPEAK CPA";
  const brandDescription = source === "cms"
    ? settings.description
    : "以誠信、專業與清楚溝通，協助企業建立穩定帳務、合規申報與可執行的財務判斷。";
  const copyrightName = source === "cms" ? settings.fullName : "誠峰會計師事務所｜彭裕峰會計師";

  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="page-shell py-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-2 xl:grid-cols-[1.25fr_0.72fr_1fr_1.45fr]">
          <div className="space-y-5">
            <div>
              <p className="font-serif text-2xl font-bold">{brandTitle}</p>
              <p className="mt-1 text-sm tracking-[0.18em] text-brand-accent">{brandSubtitle}</p>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/65">{brandDescription}</p>
            <div className="space-y-2 text-sm text-brand-accent">
              {source === "legacy" ? <p className="flex items-center gap-2">
                <ShieldCheck size={17} weight="bold" />
                台北大學會計背景與四大審計經驗
              </p> : null}
              <p className="flex items-center gap-2">
                <MapPin size={17} weight="bold" />
                {settings.address}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-brand-light">站內導覽</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-brand-accent">
                    {item.icon ? <PublishedMediaImage media={item.icon} className="mr-2 inline-block h-4 w-4 object-contain" /> : null}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-brand-light">服務項目</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              {footerServices.map((service) => (
                <li key={service.id}>
                  <Link href={service.href} className="transition hover:text-brand-accent">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-brand-light">聯絡資訊</h3>
            <div className="space-y-3 text-sm text-white/65">
              <a href={settings.phoneHref} className="flex items-center gap-2 transition hover:text-brand-accent">
                <Phone size={16} />
                {settings.phone}
              </a>
              <p>{settings.email}</p>
              <div className="aspect-video w-full overflow-hidden border border-white/20 bg-white/5">
                <iframe
                  src={settings.mapEmbedUrl}
                  title={`${settings.name} Google 地圖位置`}
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
          <p>© {year} {copyrightName} All Rights Reserved.</p>
          <div className="flex flex-col gap-2 md:items-end">
            {showViewCounter ? <FirebaseViewCounter /> : null}
            <p>本網站資訊為一般說明，個案仍須依實際資料與主管機關規定判斷。</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
