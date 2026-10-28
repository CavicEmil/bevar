// Isolated homepage layout experiment; the production landing page stays unchanged.
import { useState, useMemo } from "react";
import { Link } from "react-router";
import SearchBar from "../../components/SearchBar"; 
import Heading from "../../components/ui/Heading";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import RecipeCard from "../../components/RecipeCard";
import ArticleCard from "../../components/ArticleCard";
import Carousel from "../../components/ui/Carousel";
import "./HomePreview.css";
import { useLoader } from "../../hooks/useLoader";
import { getRecipes } from "../../api/recipes";
import { getArticles } from "../../api/article";
import { BUCKETS, getPublicUrl } from "../../api/media";
import { getCategories } from "../../api/reference";

function SearchResults({ heading, count, empty, children }) {
  return (
    <section aria-label={`Search results: ${heading}`} className="flex flex-col gap-related">
      <div className="flex items-center justify-between">
        <Heading variant={1} content={heading} />
        <span className="text-small text-dark-humor">{count} found</span>
      </div>

      {count === 0 ? (
        <p className="text-body">{empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-[16px]">{children}</div>
      )}
    </section>
  );
}


export default function HomePreview() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  const { data: recipes, loading: recipesLoading, error: recipesError } = useLoader(() => getRecipes());
  const { data: articles, loading: articlesLoading, error: articlesError } = useLoader(() => getArticles());

  const { data: categories, loading: categoriesLoading, error: categoriesError } = useLoader(() => getCategories());

   /* filter per entity type — used by both suggestions and the results layout */
  const visibleRecipes = useMemo(() => {
    if (!term) return [];
    return (recipes ?? []).filter((recipe) =>
      [recipe.title, recipe.fruits?.name, recipe.category?.category, recipe.method?.method]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [recipes, term]);

  const visibleArticles = useMemo(() => {
    if (!term) return [];
    return (articles ?? []).filter((article) =>
      [article.title, article.excerpt, article.article_category]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [articles, term]);

  /* mixed suggestions SearchBar's `type` chip labels which is which, very smart */
  const suggestions = useMemo(() => {
    if (!term) return [];

    return [
      ...visibleRecipes.slice(0, 3).map((recipe) => ({
        id: recipe.id,
        type: "recipe",
        label: recipe.title,
      })),
      ...visibleArticles.slice(0, 3).map((article) => ({
        id: article.id,
        type: "article",
        label: article.title,
      })),
    ];
  }, [visibleRecipes, visibleArticles, term]);

  const isSearching = term.length > 0;

  const topRecipes = (recipes ?? []).slice(0, 5);
  const topArticles = (articles ?? []).slice(0, 5);

  return (
    <Card variant="viewbg">
        <div className="mx-auto w-full max-w-[480px] px-[20px] py-[20px] font-the-one text-dark-humor">
          <SearchBar 
            value={query}
            onChange={setQuery}
            suggestions={suggestions}
            onSelect={(item) => setQuery(item.label)}
          />
          {(recipesLoading || articlesLoading) && <Spinner label="Loading home…" />}
          {(recipesError || articlesError) && <p role="alert" className="text-body">Some home content could not be loaded. Please refresh to try again.</p>}
          {/* ---------------- SEARCH MODE ---------------- */}
          {isSearching ? (
            <div className="flex flex-col gap-section pt-4">
              <SearchResults
                heading="Recipes"
                count={visibleRecipes.length}
                empty={`No recipes match “${query}”.`}
              >
                {visibleRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} variant="tile" />
                ))}
              </SearchResults>

              <SearchResults
                heading="Articles"
                count={visibleArticles.length}
                empty={`No articles match “${query}”.`}
              >
                {visibleArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="tile" />
                ))}
              </SearchResults>
            </div>
          ) : (
          <>
            {/* Popular recipes — heading left, tag-link right */}
            <div className="flex items-center justify-between py-4">
              <Heading variant={1} content="Popular recipes" />
              <Link to="/recipes" className="w-fit text-small text-spicy-berry hover:text-spicy-berry">
                All recipes →
              </Link>
            </div>

            <Carousel className="home-recipes">
              {topRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} variant="hero" />
              ))}
            </Carousel>
          
            <section aria-label="Browse preserving methods" className="py-[20px]">
              <Heading level={2} variant={3} content="What would you like to try?" />
              {categoriesLoading && <p role="status" className="mt-[12px] text-small">Loading methods…</p>}
              {categoriesError && <p role="alert" className="mt-[12px] text-small">Methods couldn’t be loaded. Please refresh to try again.</p>}
              <div className="mt-[12px] flex flex-nowrap gap-[10px] overflow-x-auto pb-[8px]" tabIndex={0} role="region" aria-label="Method categories, scroll horizontally">
                {(categories ?? []).map(category => (
                  <Link key={category.id} to={`/recipes?categoryIds=${encodeURIComponent(category.id)}`} state={{ fromHome: true }}
                    className="inline-flex min-h-[44px] shrink-0 items-center gap-[8px] whitespace-nowrap rounded-[14px] bg-white px-[16px] py-[10px] text-small text-dark-humor transition-colors hover:bg-poplar-pink focus-visible:outline-2 focus-visible:outline-spicy-berry">
                    {category.category_image_path && <img src={getPublicUrl(BUCKETS.categoryImages, category.category_image_path)} alt="" className="size-[22px] object-contain" />}
                    {category.category}
                  </Link>
                ))}
              </div>
            </section>

            {/* Learn more — same header pattern, second section */}
            <div className="flex items-center justify-between pt-4">
              <Heading variant={1} content="Learn more" />
              <Link to="/blog" className="w-fit text-small text-spicy-berry hover:text-spicy-berry">
                All articles →
              </Link>
            </div>

            <Carousel ariaLabel="Learn more articles" itemsPerSlide={2} className="home-articles mt-[16px]">
              {topArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="tile" />
              ))}
            </Carousel>
          </>
          )}
        </div>
    </Card>
  );
}
