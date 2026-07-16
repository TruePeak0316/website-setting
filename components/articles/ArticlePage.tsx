import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import type { ArticleDetail } from "@/lib/types";

export interface ArticlePageProps {
  article: ArticleDetail;
}

export function ArticlePage({ article }: ArticlePageProps) {
  return (
    <SiteLayout>
      <Seo
        title={article.metaTitle}
        description={article.subtitle || article.title}
        path={`/Library/${article.slug}`}
        image={article.image}
        type="article"
      />
      <article className="bg-brand-cream">
        <header className="border-b border-brand-light/25 bg-white">
          <div className="page-shell grid gap-8 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:py-16">
            <div>
              <Link href="/truepeakinsights" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
                <ArrowLeft size={15} weight="bold" />
                返回文章列表
              </Link>
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-xs bg-brand-cream px-2.5 py-1 font-semibold text-brand-primary">{article.category}</span>
                <time className="font-medium text-zinc-400">{article.date}</time>
              </div>
              <h1 className="font-serif text-4xl font-bold leading-tight text-brand-charcoal sm:text-5xl">{article.title}</h1>
              {article.subtitle ? <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{article.subtitle}</p> : null}
              <p className="mt-6 text-sm font-semibold text-zinc-500">撰文：{article.author}</p>
            </div>

            <div className="relative overflow-hidden rounded-xs border border-brand-light/30 bg-brand-cream shadow-[0_18px_60px_rgb(0_63_115_/_0.10)]">
              {article.youtube ? (
                <div className="aspect-video">
                  <iframe
                    src={article.youtube}
                    title={article.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/3]">
                  <Image src={article.image} alt={article.alt} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" priority />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-shell py-12 lg:py-16">
          <div className="mx-auto max-w-3xl rounded-xs border border-brand-light/25 bg-white p-6 shadow-[0_18px_60px_rgb(0_63_115_/_0.08)] sm:p-10">
            <div className="article-rich">
              {article.blocks.map((block, index) =>
                block.type === "heading" ? (
                  <h2 key={`${block.text}-${index}`} className="mt-9 font-serif text-2xl font-bold leading-snug text-brand-charcoal">
                    {block.text}
                  </h2>
                ) : (
                  <div key={`${block.html.slice(0, 24)}-${index}`} dangerouslySetInnerHTML={{ __html: block.html }} />
                ),
              )}
            </div>

            <nav className="mt-10 grid gap-3 border-t border-brand-light/30 pt-6 sm:grid-cols-3">
              <Link href="/truepeakinsights" className="brand-button-secondary">
                文章列表
              </Link>
              {article.previousSlug ? (
                <Link href={`/Library/${article.previousSlug}`} className="brand-button-secondary">
                  <ArrowLeft size={15} weight="bold" />
                  上一篇
                </Link>
              ) : (
                <span className="rounded-xs border border-brand-light/30 px-5 py-3 text-center text-sm font-semibold text-zinc-400">沒有上一篇</span>
              )}
              {article.nextSlug ? (
                <Link href={`/Library/${article.nextSlug}`} className="brand-button">
                  下一篇
                  <ArrowRight size={15} weight="bold" />
                </Link>
              ) : (
                <span className="rounded-xs border border-brand-light/30 px-5 py-3 text-center text-sm font-semibold text-zinc-400">敬請期待</span>
              )}
            </nav>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
