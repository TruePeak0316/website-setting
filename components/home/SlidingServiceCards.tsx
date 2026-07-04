"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { ServiceSection } from "@/lib/types";

interface SlidingServiceCardsProps {
  services: ServiceSection[];
}

interface MarqueeServiceItem {
  service: ServiceSection;
  duplicateIndex: number;
}

export function SlidingServiceCards({ services }: SlidingServiceCardsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceSection | null>(null);
  const marqueeItems = useMemo<MarqueeServiceItem[]>(
    () =>
      [...services, ...services].map((service, index) => ({
        service,
        duplicateIndex: Math.floor(index / services.length),
      })),
    [services],
  );

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedService(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedService]);

  return (
    <section className="section-pad overflow-hidden bg-white">
      <div className="page-shell mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-bold text-brand-charcoal sm:text-4xl">核心服務</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">從日常帳務到公司設立與簽證，協助企業把財稅風險放回可管理的範圍內。</p>
        </div>
        <Link href="/services" className="brand-button-secondary w-fit">
          查看全部
          <ArrowRight size={15} weight="bold" />
        </Link>
      </div>

      <div
        className="service-marquee-mask relative overflow-hidden py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className="animate-service-marquee flex w-max gap-5 px-4 sm:px-6 lg:px-8" style={{ animationPlayState: isPaused ? "paused" : "running" }}>
          {marqueeItems.map(({ service, duplicateIndex }, index) => (
            <button
              key={`${service.id}-${duplicateIndex}-${index}`}
              type="button"
              className="group w-[310px] flex-shrink-0 rounded-xs border border-brand-light/30 bg-brand-cream/45 p-5 text-left shadow-[0_18px_60px_rgb(74_53_37_/_0.08)] transition duration-300 hover:-translate-y-1 hover:border-brand-primary/60 hover:bg-white hover:shadow-[0_24px_70px_rgb(74_53_37_/_0.13)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 sm:w-[370px]"
              onClick={() => setSelectedService(service)}
              aria-label={`查看${service.title}服務詳情`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xs border border-brand-light/45 bg-white text-brand-primary transition duration-300 group-hover:bg-brand-primary group-hover:text-white">
                  <Icon name={service.icon} weight="bold" />
                </span>
                <span className="font-display text-xs font-semibold text-brand-primary/50">{String((index % services.length) + 1).padStart(2, "0")}</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-brand-charcoal transition duration-300 group-hover:text-brand-primary">{service.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{service.summary}</p>

              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xs border border-brand-light/25 bg-white">
                <Image src={service.image} alt={service.title} fill sizes="370px" className="object-cover transition duration-700 group-hover:scale-[1.05]" />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-brand-light/35 pt-4 text-xs font-bold tracking-[0.08em] text-brand-primary">
                <span>查看服務詳情</span>
                <ArrowRight size={15} weight="bold" className="transition duration-300 group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedService ? <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} /> : null}
    </section>
  );
}

interface ServiceDetailModalProps {
  service: ServiceSection;
  onClose: () => void;
}

function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onMouseDown={onClose}>
      <div
        className="service-modal-panel relative max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xs border border-brand-light/40 bg-white p-6 shadow-[0_30px_100px_rgb(30_27_24_/_0.28)] sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xs border border-brand-light/50 text-brand-charcoal transition duration-300 hover:bg-brand-cream hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
          aria-label="關閉服務詳情"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="flex items-start gap-4 pr-12">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xs bg-brand-cream text-brand-primary">
            <Icon name={service.icon} weight="bold" />
          </span>
          <div>
            <h3 id="service-modal-title" className="font-serif text-2xl font-bold text-brand-charcoal">
              {service.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{service.summary}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {service.sections.map((section) => (
            <div key={section.heading} className="rounded-xs border border-brand-light/35 bg-brand-cream/55 p-4">
              <h4 className="text-sm font-bold text-brand-charcoal">{section.heading}</h4>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{section.body[0]}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-brand-light/40 pt-6 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="brand-button-secondary">
            關閉視窗
          </button>
          <Link href={`/services#${service.id}`} onClick={onClose} className="brand-button">
            前往完整服務
            <ArrowRight size={15} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
