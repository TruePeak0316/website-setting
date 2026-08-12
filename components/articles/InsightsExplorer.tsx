"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { MarqueeControls } from "@/components/ui/MarqueeControls";
import { useLoopingMarqueeScroll } from "@/components/ui/useLoopingMarqueeScroll";
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
  const {
    onScroll: onMarqueeScroll,
    scrollByAmount: scrollMarqueeByAmount,
  } = useLoopingMarqueeScroll({ enabled: metrics.shouldAnimate, cycleWidth: metrics.distance, scrollerRef: viewportRef });
  const activeFilterIndex = filters.indexOf(filter);
  const filterIndicatorStyle: CSSProperties = {
    position: "absolute",
    insetBlock: "0.25rem",
    left: "0.25rem",
    width: "calc((100% - 0.5rem) / 4)",
    borderRadius: "0.125rem",
    background: "var(--color-brand-primary)",
    boxShadow: "0 10px 24px rgb(var(--brand-dark-rgb) / 0.18)",
    transform: `translateX(${activeFilterIndex * 100}%)`,
    transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 280ms ease",
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xs border border-brand-light/25 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar w-full overflow-x-auto sm:w-[460px] sm:flex-none">
          <div
            className="relative grid w-full grid-cols-4 rounded-xs border border-brand-light/35 bg-brand-cream/45 p-1 shadow-inner shadow-brand-light/15"
          >
            <span style={filterIndicatorStyle} aria-hidden="true" />
            {filters.map((item) => {
              const selected = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={selected}
                  className={`relative z-10 h-10 whitespace-nowrap rounded-xs px-2 text-[13px] font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/35 sm:px-4 sm:text-sm ${
                    selected ? "text-white" : "text-zinc-600 hover:bg-white/70 hover:text-brand-dark"
                  }`}
                >
                  {item === "全部" ? "顯示全部" : item}
                </button>
              );
            })}
          </div>
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
        <div className="space-y-3">
          <div className="flex justify-end">
            <MarqueeControls label="文章列表" onPrevious={() => scrollMarqueeByAmount(-420)} onNext={() => scrollMarqueeByAmount(420)} />
          </div>
          <div
            ref={viewportRef}
            className={`marquee-scrollable relative -mx-4 snap-x snap-proximity overflow-x-auto overflow-y-hidden py-2 sm:-mx-6 lg:-mx-8 lg:snap-none ${metrics.shouldAnimate ? "service-marquee-mask" : ""}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onScroll={onMarqueeScroll}
            aria-label="文章列表，可自動或手動左右滑動"
          >
            <div className={`flex w-max gap-5 px-4 sm:px-6 lg:px-8 ${metrics.shouldAnimate ? "insight-marquee-track" : ""}`} style={marqueeStyle}>
              {metrics.shouldAnimate ? (
                <div className="flex gap-5" aria-hidden="true">
                  {filtered.map((article) => (
                    <InsightArticleCard key={`${article.slug}-leading-duplicate`} article={article} tabIndex={-1} />
                  ))}
                </div>
              ) : null}
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
      draggable={false}
      className="group flex h-full w-[310px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-xs border border-brand-light/30 bg-white shadow-[0_18px_60px_rgb(7_86_111_/_0.08)] transition duration-300 hover:-translate-y-1 hover:border-brand-primary/60 hover:shadow-[0_24px_70px_rgb(7_86_111_/_0.13)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 sm:w-[380px] lg:snap-align-none"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-light/20">
        <Image src={article.image} alt={article.alt} fill sizes="380px" className="object-cover transition duration-700 group-hover:scale-[1.05]" />
        <div className="absolute left-4 top-4 rounded-xs bg-white/90 px-3 py-1 text-xs font-bold text-brand-primary shadow-[0_8px_24px_rgb(7_86_111_/_0.12)]">
          {article.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-xs font-semibold text-zinc-500">{article.date}</p>
        <h3 className="mt-3 line-clamp-2 min-h-14 text-xl font-bold leading-snug text-brand-charcoal transition duration-300 group-hover:text-brand-primary">{article.title}</h3>
        {article.subtitle ? <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-600">{article.subtitle}</p> : <span className="mt-3 min-h-12" aria-hidden="true" />}
        <div className="mt-auto flex items-center justify-between border-t border-brand-light/35 pt-4 text-xs font-bold tracking-[0.08em] text-brand-primary">
          <span>閱讀文章</span>
          <ArrowRight size={15} weight="bold" className="transition duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
