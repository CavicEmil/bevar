import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";

import ArticleCard from "../components/ArticleCard";
import ArticleCategory from "../components/ArticleCategory";
import ArticleSearch, {
  createArticleSearchState,
} from "../components/ArticleSearch";
import Card from "../components/ui/Card";

const TOPICS = [
  { variant: "methods", name: "Methods" },
  { variant: "storage", name: "Storage" },
  { variant: "hygiene", name: "Hygiene & Safety" },
  { variant: "equipment", name: "Equipment" },
  { variant: "seasonal", name: "Seasonal note" },
];

export default function Blog() {
  const articles = useLoaderData() ?? [];
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValues, setSearchValues] = useState(
    createArticleSearchState
  );

  const showResults = searchParams.get("view") === "all";

  /* Clear search and filters when returning to the Learn overview. */
  useEffect(() => {
    if (!showResults) {
      setSearchValues(createArticleSearchState());
    }
  }, [showResults]);

  const featured =
    articles.find(
      (article) =>
        article.slug === "a-big-bag-of-apples-a-small-plan"
    ) ?? articles[0];

  const moreArticles = articles
    .filter((article) => article.id !== featured?.id)
    .slice(0, 2);

  const results = useMemo(() => {
    const terms = searchValues.search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

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

      const matchesPreservationCategory =
        searchValues.categoryIds.length === 0 ||
        searchValues.categoryIds.includes(article.category_id);

      return (
        matchesSearch &&
        matchesTopic &&
        matchesFruit &&
        matchesPreservationCategory
      );
    });

    return filtered.sort((a, b) => {
      if (searchValues.sort === "a-z") {
        return a.title.localeCompare(b.title);
      }

      if (searchValues.sort === "read-time") {
        const timeDifference =
          (a.read_time ?? Infinity) - (b.read_time ?? Infinity);

        return (
          timeDifference ||
          a.title.localeCompare(b.title)
        );
      }

      const aDate =
        Date.parse(a.published_at ?? a.created_at) || 0;
      const bDate =
        Date.parse(b.published_at ?? b.created_at) || 0;

      return (
        bDate - aDate ||
        a.title.localeCompare(b.title)
      );
    });
  }, [articles, searchValues]);

  function openResults(nextValues) {
    setSearchValues(nextValues);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("view", "all");
    setSearchParams(nextParams);
  }

  function viewAllArticles() {
    openResults(createArticleSearchState());
  }

  function viewTopic(name) {
    openResults({
      ...createArticleSearchState(),
      articleCategories: [name],
    });
  }

  return (
    <Card
      variant="viewbg"
      className="
        flex min-w-0 flex-col gap-section
        !p-page pb-28 font-the-one text-dark-humor
      "
    >
      {showResults ? (
        <>
          <h1 className="text-[24px] leading-[1.4] font-semibold">
            All Articles
          </h1>

          <ArticleSearch
            value={searchValues}
            onChange={openResults}
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
        </>
      ) : (
        <>
          <h1 className="text-[24px] leading-[1.4] font-semibold">
            Learn &amp; Preserve
          </h1>

          <ArticleSearch
            value={searchValues}
            onChange={openResults}
          />

          {featured ? (
            <section aria-label="Featured article">
              <ArticleCard
                article={featured}
                variant="hero"
              />
            </section>
          ) : (
            <p role="status" className="text-body">
              No articles available yet.
            </p>
          )}

          <section
            aria-labelledby="learn-topics"
            className="flex flex-col gap-related"
          >
            <h2
              id="learn-topics"
              className="text-[16px] leading-[1.4] font-semibold"
            >
              What would you like to know?
            </h2>

            {TOPICS.map((topic) => (
              <ArticleCategory
                key={topic.variant}
                variant={topic.variant}
                buttonLabel="View articles"
                onClick={() => viewTopic(topic.name)}
              />
            ))}
          </section>

          <section
            aria-labelledby="more-articles"
            className="flex flex-col gap-related"
          >
            <div className="flex items-center justify-between gap-related">
              <h2
                id="more-articles"
                className="text-[16px] leading-[1.4] font-semibold"
              >
                More Articles
              </h2>

              <button
                type="button"
                onClick={viewAllArticles}
                className="
                  cursor-pointer border-0 bg-transparent p-0
                  text-small text-spicy-berry
                "
              >
                View Articles →
              </button>
            </div>

            {moreArticles.length > 0 ? (
              <div className="grid min-w-0 grid-cols-2 gap-related">
                {moreArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="tile"
                  />
                ))}
              </div>
            ) : (
              <p className="text-body">
                More articles will appear here.
              </p>
            )}
          </section>
        </>
      )}
    </Card>
  );
}