import { useLayoutEffect } from "react";
import useSavedArticles from "../hooks/useSavedArticles";
import ArticleCard from "./ArticleCard";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function MyArticles() {
  const saved = useSavedArticles();
  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Card variant="viewbg" className="flex flex-col gap-section !p-page font-the-one text-dark-humor">
      <h1 className="text-[24px] font-semibold">My articles</h1>
      {saved.isLoading && <p role="status">Loading saved articles…</p>}
      {saved.error && <div><p role="alert">{saved.error}</p><Button content="Try again" onClick={saved.refresh} /></div>}
      {!saved.isLoading && !saved.error && saved.articles.length === 0 && <p>You have not saved any articles yet.</p>}
      <div className="grid grid-cols-2 gap-related">
        {saved.articles.map(article => <ArticleCard key={article.id} article={article} variant="tile" />)}
      </div>
    </Card>
  );
}
