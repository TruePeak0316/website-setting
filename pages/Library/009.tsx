import { ArticlePage } from "@/components/articles/ArticlePage";
import { getArticleStaticProps } from "@/lib/articleStaticProps";

export const getStaticProps = () => getArticleStaticProps("009");

export default ArticlePage;
