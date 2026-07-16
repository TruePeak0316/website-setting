"use client";

import Image from "next/image";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { ServiceSection } from "@/lib/types";

interface ServicesTabsProps {
  services: ServiceSection[];
}

export function ServicesTabs({ services }: ServicesTabsProps) {
  const [desktopActiveId, setDesktopActiveId] = useState(services[0]?.id ?? "");
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const activeService = useMemo(() => services.find((service) => service.id === desktopActiveId) ?? services[0], [desktopActiveId, services]);

  if (!activeService) return null;

  return (
    <>
      <div className="lg:hidden">
        <div className="space-y-3">
          {services.map((service, index) => (
            <MobileServiceAccordionItem
              key={service.id}
              service={service}
              expanded={mobileOpenId === service.id}
              priorityImage={index === 0}
              onSelect={() => setMobileOpenId((current) => (current === service.id ? null : service.id))}
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
              onClick={() => setDesktopActiveId(service.id)}
              className={`group flex w-full items-center gap-3 rounded-xs border p-4 text-left transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-px ${
                activeService.id === service.id
                  ? "translate-x-1 border-brand-primary bg-white shadow-[0_18px_44px_rgb(0_63_115_/_0.12)]"
                  : "border-brand-light/30 bg-white/60 hover:-translate-y-0.5 hover:border-brand-primary/45 hover:bg-white hover:shadow-[0_16px_38px_rgb(0_63_115_/_0.08)]"
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
    </>
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
    <article className={`overflow-hidden rounded-xs border bg-white transition duration-300 ${expanded ? "border-brand-primary shadow-[0_18px_52px_rgb(0_63_115_/_0.1)]" : "border-brand-light/30"}`}>
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
              <Image src={service.image} alt={service.title} fill sizes="100vw" className="object-cover" priority={priorityImage} />
            </div>
            <div className="space-y-5 p-4">
              <ServiceSections sections={service.sections} />
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
          <Image src={service.image} alt={service.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover:scale-[1.035]" priority={priorityImage} />
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
        </div>
      </div>
    </article>
  );
}

function ServiceSections({ sections }: { sections: ServiceSection["sections"] }) {
  return (
    <div className="grid gap-4 lg:gap-5">
      {sections.map((section) => (
        <section key={section.heading} className="rounded-xs border border-brand-light/25 bg-brand-cream/35 p-4 transition duration-300 sm:p-5 lg:hover:-translate-y-0.5 lg:hover:border-brand-primary/30 lg:hover:bg-white lg:hover:shadow-[0_12px_30px_rgb(0_63_115_/_0.07)]">
          <h3 className="mb-3 text-sm font-bold text-brand-primary">{section.heading}</h3>
          <ul className="space-y-2.5">
            {section.body.map((line) => (
              <li key={line} className="group/item flex gap-2 text-sm leading-6 text-zinc-600">
                <ArrowRight size={14} className="mt-1 shrink-0 text-brand-accent transition duration-300 lg:group-hover/item:translate-x-1" weight="bold" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
