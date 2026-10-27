
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import ArticleCard from "../../components/ArticleCard";
import { getArticles } from "../../api/article";
import { useLoader } from "../../hooks/useLoader";

export default function Articles() {
  const { data: articles, loading, error } = useLoader(() => getArticles());

  const [hero, ...tiles] = articles ?? [];

  return (
    <Container className="flex flex-col gap-[20px] py-[20px]">
      <Card variant="viewbg">
      <Heading variant={2} content="Articles" />

      {loading && <p className="text-body text-rhodophobia">Loading articles…</p>}

      {error && (
        <p className="text-body text-spicy-berry">
          Couldn't load articles. Please try again.
        </p>
      )}

      {!loading && !error && articles?.length === 0 && (
        <p className="text-body text-rhodophobia">No articles yet.</p>
      )}

      {hero && (
        <div className="grid gap-[20px] lg:grid-cols-5">
          {/* hero: 2 of 5 columns = 40% on desktop, full width on mobile */}
          <div className="lg:col-span-2">
            <ArticleCard article={hero} variant="hero" />
          </div>

          {/* tiles: column of 2 in the remaining 60% */}
          <div className="grid gap-[20px] grid-cols-2">
            {tiles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="tile" />
            ))}
          </div>
        </div>
      )}
      </Card>
    </Container>
  );
}