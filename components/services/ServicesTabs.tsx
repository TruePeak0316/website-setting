"use client";

import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { ServiceSection } from "@/lib/types";

interface ServicesTabsProps {
  services: ServiceSection[];
}

export function ServicesTabs({ services }: ServicesTabsProps) {
  const [activeId, setActiveId] = useState(services[0]?.id ?? "");
  const activeService = useMemo(() => services.find((service) => service.id === activeId) ?? services[0], [activeId, services]);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => setActiveId(service.id)}
            className={`flex w-full items-center gap-3 rounded-xs border p-4 text-left transition ${
              activeService.id === service.id
                ? "border-brand-primary bg-white shadow-[0_12px_34px_rgb(74_53_37_/_0.08)]"
                : "border-brand-light/30 bg-white/60 hover:bg-white"
            }`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xs ${activeService.id === service.id ? "bg-brand-primary text-white" : "bg-brand-cream text-brand-primary"}`}>
              <Icon name={service.icon} />
            </span>
            <span>
              <span className="block text-sm font-bold text-brand-charcoal">{service.title}</span>
              <span className="mt-1 line-clamp-1 block text-xs text-zinc-500">{service.summary}</span>
            </span>
          </button>
        ))}
      </div>

      <article className="brand-card overflow-hidden rounded-xs">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[260px] bg-brand-light/20 lg:min-h-full">
            <Image src={activeService.image} alt={activeService.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="space-y-7 p-6 sm:p-8 lg:p-10">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xs bg-brand-cream text-brand-primary">
                <Icon name={activeService.icon} size={24} weight="bold" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-brand-charcoal">{activeService.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{activeService.summary}</p>
            </div>

            <div className="grid gap-5">
              {activeService.sections.map((section) => (
                <section key={section.heading} className="rounded-xs border border-brand-light/25 bg-brand-cream/35 p-5">
                  <h3 className="mb-3 text-sm font-bold text-brand-primary">{section.heading}</h3>
                  <ul className="space-y-2.5">
                    {section.body.map((line) => (
                      <li key={line} className="flex gap-2 text-sm leading-6 text-zinc-600">
                        <ArrowRight size={14} className="mt-1 shrink-0 text-brand-accent" weight="bold" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
