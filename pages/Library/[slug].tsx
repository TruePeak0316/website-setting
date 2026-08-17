import type { GetStaticPaths, GetStaticProps } from "next";
import { ArticlePage, type ArticlePageProps } from "@/components/articles/ArticlePage";
import { getArticleStaticProps } from "@/lib/articleStaticProps";
import { loadAllArticles } from "@/lib/articles";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: loadAllArticles().map(({ slug }) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<ArticlePageProps> = ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  return getArticleStaticProps(slug);
};

export default ArticlePage;
