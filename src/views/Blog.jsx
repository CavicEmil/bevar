import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";

import ArticleSearch, {
  createArticleSearchState,
} from "../components/ArticleSearch";

import ArticleCard from "../components/ArticleCard";

export default function Articles() {
  const loadedArticles = useLoaderData();
  const articles = loadedArticles ?? [];

  const [searchValues, setSearchValues] = useState(
    createArticleSearchState
  );

  const results = useMemo(() => {
    const terms = searchValues.search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    /* Match search text and apply the selected filter groups. */
    const filtered = articles.filter((article) => {
      const searchable = [
        article.title,
        article.excerpt,
        article.article_category,
        article.fruit?.name,
        article.preservation_category?.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = terms.every((term) =>
        searchable.includes(term)
      );

      const matchesTopic =
        searchValues.articleCategories.length === 0 ||
        searchValues.articleCategories.includes(
          article.article_category
        );

      const matchesFruit =
        searchValues.fruitIds.length === 0 ||
        searchValues.fruitIds.includes(article.fruit_id);

      const matchesCategory =
        searchValues.categoryIds.length === 0 ||
        searchValues.categoryIds.includes(article.category_id);

      return (
        matchesSearch &&
        matchesTopic &&
        matchesFruit &&
        matchesCategory
      );
    });

    /* Sort a new array without modifying the loaded data. */
    return filtered.sort((a, b) => {
      const titleOrder = a.title.localeCompare(b.title);

      if (searchValues.sort === "a-z") {
        return titleOrder;
      }

      if (searchValues.sort === "read-time") {
        return (
          (a.read_time ?? Infinity) -
            (b.read_time ?? Infinity) ||
          titleOrder
        );
      }

      const aDate = Date.parse(
        a.published_at ?? a.created_at
      ) || 0;

      const bDate = Date.parse(
        b.published_at ?? b.created_at
      ) || 0;

      return bDate - aDate || titleOrder;
    });
  }, [articles, searchValues]);

  return (
    <main
      className="
        flex min-w-0 flex-col gap-section
        p-page pb-28 font-the-one text-dark-humor
      "
    >
      <h1 className="text-[24px] leading-[1.4] font-semibold">
        All Articles
      </h1>

      <ArticleSearch
        value={searchValues}
        onChange={setSearchValues}
      />

      <p role="status" className="text-small">
        {results.length}{" "}
        {results.length === 1 ? "article" : "articles"}
      </p>

      {results.length > 0 ? (
        <div className="grid min-w-0 grid-cols-2 gap-related">
          {results.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="tile"
            />
          ))}
        </div>
      ) : (
        <p className="text-body">
          No articles found. Try another search or remove a filter.
        </p>
      )}
    </main>
  );
}