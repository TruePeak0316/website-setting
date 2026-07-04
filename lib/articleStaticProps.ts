import type { GetStaticPropsResult } from "next";
import { loadArticle } from "@/lib/articles";
import type { ArticlePageProps } from "@/components/articles/ArticlePage";

export function getArticleStaticProps(slug: string): GetStaticPropsResult<ArticlePageProps> {
  return {
    props: {
      article: loadArticle(slug),
    },
  };
}
