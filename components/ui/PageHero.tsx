import Image from "next/image";
import type { ReactNode } from "react";

interface PageHeroProps {
  title: ReactNode;
  description?: string;
  image: string;
  kicker?: string;
}

export function PageHero({ title, description, image, kicker }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-charcoal text-white">
      <div className="absolute inset-0">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-35" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/80 to-brand-charcoal/40" />
      </div>
      <div className="page-shell relative flex min-h-[52dvh] items-end py-16 sm:py-20">
        <div className="max-w-3xl">
          {kicker ? <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">{kicker}</p> : null}
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {description ? <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{description}</p> : null}
        </div>
      </div>
    </section>
  );
}
