"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ArticleCategory, ArticleSummary } from "@/lib/types";

interface InsightsExplorerProps {
  articles: ArticleSummary[];
}

interface MarqueeMetrics {
  shouldAnimate: boolean;
  distance: number;
  duration: number;
}

const filters: Array<"全部" | ArticleCategory> = ["全部", "財稅實務", "公司經營", "誠峰解析"];
const marqueeGapPx = 20;
const marqueePixelsPerSecond = 42;
const minimumMarqueeDuration = 16;

export function InsightsExplorer({ articles }: InsightsExplorerProps) {
  const [filter, setFilter] = useState<"全部" | ArticleCategory>("全部");
  const [query, setQuery] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [metrics, setMetrics] = useState<MarqueeMetrics>({ shouldAnimate: false, distance: 0, duration: minimumMarqueeDuration });
  const viewportRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const categoryMatch = filter === "全部" || article.category === filter;
      const queryMatch =
        !normalizedQuery ||
        `${article.title} ${article.subtitle} ${article.category} ${article.date}`.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [articles, filter, query]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const cycle = cycleRef.current;
    if (!viewport || !cycle) {
      return;
    }

    const updateMetrics = () => {
      const cycleWidth = cycle.scrollWidth;
      const shouldAnimate = filtered.length >= 2 && cycleWidth > viewport.clientWidth + 1;
      const distance = shouldAnimate ? cycleWidth + marqueeGapPx : 0;
      const duration = shouldAnimate ? Math.max(minimumMarqueeDuration, distance / marqueePixelsPerSecond) : minimumMarqueeDuration;

      setMetrics((current) => {
        const roundedDistance = Math.round(distance);
        const roundedDuration = Math.round(duration * 10) / 10;
        if (current.shouldAnimate === shouldAnimate && current.distance === roundedDistance && current.duration === roundedDuration) {
          return current;
        }
        return { shouldAnimate, distance: roundedDistance, duration: roundedDuration };
      });
    };

    updateMetrics();

    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(viewport);
    resizeObserver.observe(cycle);
    return () => resizeObserver.disconnect();
  }, [filtered]);

  const marqueeStyle = {
    "--insight-marquee-distance": `${metrics.distance}px`,
    "--insight-marquee-duration": `${metrics.duration}s`,
    animationPlayState: isPaused ? "paused" : "running",
  } satisfies CSSProperties & Record<"--insight-marquee-distance" | "--insight-marquee-duration", string>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xs border border-brand-light/25 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-xs border px-4 py-2 text-sm font-semibold transition ${
                filter === item ? "border-brand-primary bg-brand-primary text-white" : "border-brand-light/40 bg-brand-cream/40 text-zinc-600 hover:bg-brand-cream"
              }`}
            >
              {item === "全部" ? "顯示全部" : item}
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">搜尋文章</span>
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋文章標題"
            className="w-full rounded-xs border border-brand-light/40 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
          />
        </label>
      </div>

      {filtered.length > 0 ? (
        <div
          ref={viewportRef}
          className={`relative -mx-4 overflow-hidden py-2 sm:-mx-6 lg:-mx-8 ${metrics.shouldAnimate ? "service-marquee-mask" : ""}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className={`flex w-max gap-5 px-4 sm:px-6 lg:px-8 ${metrics.shouldAnimate ? "animate-insight-marquee" : ""}`} style={marqueeStyle}>
            <div ref={cycleRef} className="flex gap-5">
              {filtered.map((article) => (
                <InsightArticleCard key={article.slug} article={article} />
              ))}
            </div>
            {metrics.shouldAnimate ? (
              <div className="flex gap-5" aria-hidden="true">
                {filtered.map((article) => (
                  <InsightArticleCard key={`${article.slug}-duplicate`} article={article} tabIndex={-1} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="rounded-xs border border-brand-light/25 bg-white p-10 text-center">
          <p className="font-semibold text-brand-charcoal">沒有符合條件的文章</p>
          <p className="mt-2 text-sm text-zinc-500">請清除搜尋或切換分類。</p>
        </div>
      )}
    </div>
  );
}

interface InsightArticleCardProps {
  article: ArticleSummary;
  tabIndex?: number;
}

function InsightArticleCard({ article, tabIndex }: InsightArticleCardProps) {
  return (
    <Link
      href={`/Library/${article.slug}`}
      tabIndex={tabIndex}
      className="group w-[310px] flex-shrink-0 overflow-hidden rounded-xs border border-brand-light/30 bg-white shadow-[0_18px_60px_rgb(74_53_37_/_0.08)] transition duration-300 hover:-translate-y-1 hover:border-brand-primary/60 hover:shadow-[0_24px_70px_rgb(74_53_37_/_0.13)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 sm:w-[380px]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-light/20">
        <Image src={article.image} alt={article.alt} fill sizes="380px" className="object-cover transition duration-700 group-hover:scale-[1.05]" />
        <div className="absolute left-4 top-4 rounded-xs bg-white/90 px-3 py-1 text-xs font-bold text-brand-primary shadow-[0_8px_24px_rgb(74_53_37_/_0.12)]">
          {article.category}
        </div>
      </div>

      <div className="p-5">
        <p className="font-display text-xs font-semibold text-zinc-500">{article.date}</p>
        <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-brand-charcoal transition duration-300 group-hover:text-brand-primary">{article.title}</h3>
        {article.subtitle ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">{article.subtitle}</p> : null}
        <div className="mt-5 flex items-center justify-between border-t border-brand-light/35 pt-4 text-xs font-bold tracking-[0.08em] text-brand-primary">
          <span>閱讀文章</span>
          <ArrowRight size={15} weight="bold" className="transition duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
