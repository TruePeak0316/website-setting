"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { ArrowRight, List, Phone, X } from "@phosphor-icons/react";
import { useState } from "react";
import { NAV_ITEMS, SITE } from "@/lib/site";

export function SiteHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-light/25 bg-brand-cream/95 backdrop-blur-md">
      <div className="page-shell">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="回到首頁">
            <span className="relative h-11 w-11 overflow-hidden rounded-xs border border-brand-light bg-white">
              <Image src="/images/LOGO.PNG" alt="誠峰會計師事務所標誌" fill sizes="44px" className="object-contain p-1" priority />
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block font-serif text-xl font-bold tracking-wide text-brand-charcoal">誠峰</span>
              <span className="block text-[11px] font-medium tracking-[0.18em] text-brand-primary">CPA OFFICE</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="主選單">
            {NAV_ITEMS.map((item) => {
              const active = item.href === "/" ? router.pathname === "/" : router.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap text-sm font-medium transition hover:text-brand-primary ${
                    active ? "text-brand-primary" : "text-zinc-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition hover:text-brand-primary">
              <Phone size={16} weight="bold" />
              {SITE.phone}
            </a>
            <a href={SITE.bookingUrl} className="brand-button px-4 py-2.5" target="_blank" rel="noopener">
              預約諮詢
              <ArrowRight size={15} weight="bold" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xs border border-brand-light/50 bg-white text-brand-primary lg:hidden"
            aria-label={open ? "關閉主選單" : "開啟主選單"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <List size={24} />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-brand-light/30 py-4 lg:hidden">
            <nav className="grid gap-2" aria-label="手機主選單">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xs px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-white hover:text-brand-primary"
                >
                  {item.label}
                </Link>
              ))}
              <a href={SITE.phoneHref} className="rounded-xs bg-white px-3 py-3 text-sm font-semibold text-brand-primary">
                諮詢電話：{SITE.phone}
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
