import Image from "next/image";
import Link from "next/link";
import type { PublishedActionLinkV1, PublishedHeroV1, PublishedMediaAssetV1 } from "@/lib/cms/published-content-v1";

export function PublishedHero({ hero }: { hero: PublishedHeroV1 }) {
  return (
    <section className="relative overflow-hidden bg-brand-charcoal text-white">
      {hero.image ? (
        <div className="absolute inset-0">
          <Image src={hero.image.url} alt={hero.image.alt} fill sizes="100vw" className="object-cover opacity-35" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/80 to-brand-charcoal/40" />
        </div>
      ) : null}
      <div className="page-shell relative flex min-h-[52dvh] items-end py-16 sm:py-20">
        <div className="max-w-3xl">
          {hero.eyebrow ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">{hero.eyebrow}</p>
          ) : null}
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{hero.title}</h1>
          {hero.description ? (
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{hero.description}</p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            {[hero.primaryAction, hero.secondaryAction]
              .filter((item): item is PublishedActionLinkV1 => item !== null)
              .map((action, index) => (
                <PublishedAction key={`${action.href}:${action.label}`} action={action} primary={index === 0} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PublishedAction({ action, primary = true }: { action: PublishedActionLinkV1; primary?: boolean }) {
  const className = primary ? "brand-button" : "brand-button-secondary";
  return action.external ? (
    <a href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
      {action.label}
    </a>
  ) : (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export function PublishedMediaImage({ media, className = "" }: { media: PublishedMediaAssetV1; className?: string }) {
  return <Image src={media.url} alt={media.alt} width={media.width} height={media.height} className={className} />;
}

export function PublishedHtml({ html, className = "" }: { html: string; className?: string }) {
  return html ? <div className={`article-rich ${className}`} dangerouslySetInnerHTML={{ __html: html }} /> : null;
}
