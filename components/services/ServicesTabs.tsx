"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { PublishedAction, PublishedMediaImage } from "@/components/cms/PublishedHero";
import type { ServiceSection } from "@/lib/types";

interface ServicesTabsProps {
  services: ServiceSection[];
}

export function ServicesTabs({ services }: ServicesTabsProps) {
  const router = useRouter();
  const [desktopActiveId, setDesktopActiveId] = useState(services[0]?.id ?? "");
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextHashScrollRef = useRef(false);
  const serviceIds = useMemo(() => new Set(services.map((service) => service.id)), [services]);
  const activeService = useMemo(() => services.find((service) => service.id === desktopActiveId) ?? services[0], [desktopActiveId, services]);

  const selectService = useCallback((serviceId: string, shouldScroll = false) => {
    setDesktopActiveId(serviceId);
    setMobileOpenId(serviceId);

    if (shouldScroll) {
      window.requestAnimationFrame(() => containerRef.current?.scrollIntoView({ block: "start" }));
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const encodedHash = window.location.hash.slice(1);
      const shouldScroll = !skipNextHashScrollRef.current;
      skipNextHashScrollRef.current = false;
      let hash = encodedHash;
      try {
        hash = decodeURIComponent(encodedHash);
      } catch {
        hash = encodedHash;
      }
      if (!hash) return;

      if (serviceIds.has(hash)) {
        selectService(hash, shouldScroll);
        return;
      }

      const firstServiceId = services[0]?.id;
      if (firstServiceId) {
        selectService(firstServiceId, true);
        void router.replace(`${window.location.pathname}${window.location.search}`, undefined, { shallow: true, scroll: false });
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    router.events.on("hashChangeComplete", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
      router.events.off("hashChangeComplete", syncFromHash);
    };
  }, [router.events, selectService, serviceIds, services]);

  const updateHash = useCallback((serviceId: string | null) => {
    const nextUrl = serviceId
      ? `${window.location.pathname}${window.location.search}#${encodeURIComponent(serviceId)}`
      : `${window.location.pathname}${window.location.search}`;
    skipNextHashScrollRef.current = true;
    void router.push(nextUrl, undefined, { shallow: true, scroll: false });
  }, [router]);

  if (!activeService) return null;

  return (
    <div ref={containerRef} className="scroll-mt-28">
      <div className="lg:hidden">
        <div className="space-y-3">
          {services.map((service, index) => (
            <MobileServiceAccordionItem
              key={service.id}
              service={service}
              expanded={mobileOpenId === service.id}
              priorityImage={index === 0}
              onSelect={() => {
                const nextId = mobileOpenId === service.id ? null : service.id;
                setMobileOpenId(nextId);
                if (nextId) setDesktopActiveId(nextId);
                updateHash(nextId);
              }}
            />
          ))}
        </div>
      </div>

      <div className="hidden gap-8 lg:grid lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              aria-pressed={activeService.id === service.id}
              onClick={() => {
                selectService(service.id);
                updateHash(service.id);
              }}
              className={`group flex w-full items-center gap-3 rounded-xs border p-4 text-left transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-px ${
                activeService.id === service.id
                  ? "translate-x-1 border-brand-primary bg-white shadow-[0_18px_44px_rgb(7_86_111_/_0.12)]"
                  : "border-brand-light/30 bg-white/60 hover:-translate-y-0.5 hover:border-brand-primary/45 hover:bg-white hover:shadow-[0_16px_38px_rgb(7_86_111_/_0.08)]"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xs transition duration-300 ${
                  activeService.id === service.id ? "bg-brand-primary text-white" : "bg-brand-cream text-brand-primary group-hover:bg-brand-primary/10"
                }`}
              >
                <Icon name={service.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-brand-charcoal">{service.title}</span>
                <span className="mt-1 line-clamp-1 block text-xs text-zinc-500">{service.summary}</span>
              </span>
              <ArrowRight
                size={16}
                weight="bold"
                className={`shrink-0 text-brand-primary transition duration-300 ${
                  activeService.id === service.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>

        <ServiceDetailCard key={activeService.id} service={activeService} />
      </div>
    </div>
  );
}

function MobileServiceAccordionItem({
  service,
  expanded,
  priorityImage,
  onSelect,
}: {
  service: ServiceSection;
  expanded: boolean;
  priorityImage: boolean;
  onSelect: () => void;
}) {
  const panelId = `${service.id}-mobile-panel`;

  return (
    <article className={`overflow-hidden rounded-xs border bg-white transition duration-300 ${expanded ? "border-brand-primary shadow-[0_18px_52px_rgb(7_86_111_/_0.1)]" : "border-brand-light/30"}`}>
      <button type="button" onClick={onSelect} aria-expanded={expanded} aria-controls={panelId} className="flex w-full items-center gap-3 p-4 text-left">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xs transition duration-300 ${expanded ? "bg-brand-primary text-white" : "bg-brand-cream text-brand-primary"}`}>
          <Icon name={service.icon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-brand-charcoal">{service.title}</span>
          <span className="mt-1 line-clamp-2 block text-sm leading-6 text-zinc-500">{service.summary}</span>
        </span>
        <CaretDown size={18} weight="bold" className={`shrink-0 text-brand-primary transition duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>

      <div id={panelId} aria-hidden={!expanded} className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className={`border-t border-brand-light/25 transition-opacity duration-300 ${expanded ? "opacity-100" : "opacity-0"}`}>
            <div className="relative aspect-[16/10] bg-brand-light/20">
              <ServiceImage service={service} sizes="100vw" priority={priorityImage} />
            </div>
            <div className="space-y-5 p-4">
              <ServiceSections sections={service.sections} />
              {service.action ? <PublishedAction action={service.action} /> : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ServiceDetailCard({ service, anchorId, priorityImage = false }: { service: ServiceSection; anchorId?: string; priorityImage?: boolean }) {
  return (
    <article id={anchorId} className="service-detail-panel brand-card group scroll-mt-32 overflow-hidden rounded-xs">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[240px] bg-brand-light/20 sm:min-h-[320px] lg:min-h-full">
          <ServiceImage
            service={service}
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority={priorityImage}
            className="transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover:scale-[1.035]"
          />
        </div>
        <div className="space-y-6 p-5 sm:p-8 lg:space-y-7 lg:p-10">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xs bg-brand-cream text-brand-primary">
              <Icon name={service.icon} size={24} weight="bold" />
            </div>
            <h2 className="font-serif text-2xl font-bold leading-tight text-brand-charcoal sm:text-3xl">{service.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{service.summary}</p>
          </div>

          <ServiceSections sections={service.sections} />
          {service.action ? <PublishedAction action={service.action} /> : null}
        </div>
      </div>
    </article>
  );
}

function ServiceSections({ sections }: { sections: ServiceSection["sections"] }) {
  return (
    <div className="grid gap-4 lg:gap-5">
      {sections.map((section) => (
        <section key={section.heading} className="rounded-xs border border-brand-light/25 bg-brand-cream/35 p-4 transition duration-300 sm:p-5 lg:hover:-translate-y-0.5 lg:hover:border-brand-primary/30 lg:hover:bg-white lg:hover:shadow-[0_12px_30px_rgb(7_86_111_/_0.07)]">
          {section.image ? (
            <PublishedMediaImage media={section.image} className="mb-4 h-auto w-full rounded-xs object-cover" />
          ) : null}
          <h3 className="mb-3 text-sm font-bold text-brand-primary">{section.heading}</h3>
          {section.bodyHtml ? <div className="article-rich text-sm leading-6 text-zinc-600" dangerouslySetInnerHTML={{ __html: section.bodyHtml }} /> : <ul className="space-y-2.5">
            {section.body.map((line) => (
              <li key={line} className="group/item flex gap-2 text-sm leading-6 text-zinc-600">
                <ArrowRight size={14} className="mt-1 shrink-0 text-brand-accent transition duration-300 lg:group-hover/item:translate-x-1" weight="bold" />
                <span>{line}</span>
              </li>
            ))}
          </ul>}
        </section>
      ))}
    </div>
  );
}

function ServiceImage({
  service,
  sizes,
  priority,
  className = "",
}: {
  service: ServiceSection;
  sizes: string;
  priority: boolean;
  className?: string;
}) {
  if (service.imageMedia) {
    return (
      <PublishedMediaImage
        media={service.imageMedia}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  if (service.image) {
    return <Image src={service.image} alt={service.title} fill sizes={sizes} className={`object-cover ${className}`} priority={priority} />;
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-brand-light/15 text-brand-primary/35 ${className}`} aria-hidden="true">
      <Icon name={service.icon} size={48} weight="duotone" />
    </div>
  );
}
