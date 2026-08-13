import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import type { ArticleSummary } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleSummary;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/Library/${article.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xs border border-brand-light/25 bg-white shadow-[0_14px_40px_rgb(7_86_111_/_0.07)]">
      <div className="relative aspect-square overflow-hidden bg-brand-light/20">
        <Image src={article.image} alt={article.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between gap-3 text-xs">
          <span className="rounded-xs bg-brand-cream px-2.5 py-1 font-semibold text-brand-primary">{article.category}</span>
          <time className="font-medium text-zinc-400">{article.date}</time>
        </div>
        <h3 className="line-clamp-2 min-h-12 text-lg font-bold leading-snug text-brand-charcoal transition group-hover:text-brand-primary">{article.title}</h3>
        {article.subtitle ? <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-500">{article.subtitle}</p> : <span className="mt-2 min-h-12" aria-hidden="true" />}
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-brand-primary">
          閱讀文章
          <ArrowRight size={15} weight="bold" />
        </span>
      </div>
    </Link>
  );
}
