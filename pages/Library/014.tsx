import { ArticlePage } from "@/components/articles/ArticlePage";
import { getArticleStaticProps } from "@/lib/articleStaticProps";

export const getStaticProps = () => getArticleStaticProps("014");

export default ArticlePage;
