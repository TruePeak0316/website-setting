import type { GetStaticPropsResult } from "next";
import { loadArticle } from "@/lib/articles";
import type { ArticlePageProps } from "@/components/articles/ArticlePage";
import { getSiteFrame } from "@/lib/cms/static-content";

export function getArticleStaticProps(slug: string): GetStaticPropsResult<ArticlePageProps> {
  return {
    props: {
      article: loadArticle(slug),
      siteFrame: getSiteFrame(),
    },
  };
}
