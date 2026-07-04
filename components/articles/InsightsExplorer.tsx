"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import type { ArticleCategory, ArticleSummary } from "@/lib/types";

interface InsightsExplorerProps {
  articles: ArticleSummary[];
}

const filters: Array<"全部" | ArticleCategory> = ["全部", "財稅實務", "公司經營", "誠峰解析"];

export function InsightsExplorer({ articles }: InsightsExplorerProps) {
  const [filter, setFilter] = useState<"全部" | ArticleCategory>("全部");
  const [query, setQuery] = useState("");

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
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
