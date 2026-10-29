import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import SearchBar from "../components/SearchBar"; 
import Heading from "../components/ui/Heading";
import WelcomeScreen from "../components/WelcomeScreen";
import Card from "../components/ui/Card";
import RecipeCard from "../components/RecipeCard";
import ArticleCard from "../components/ArticleCard";
import FilterCard from "../components/FilterCard";
import ActiveFilters from "../components/ActiveFilters";
import Carousel from "../components/ui/Carousel";
import "./Landing.css";
import { getFruits, getCategories, getDifficulties } from "../api/reference";
import { BUCKETS, getPublicUrl } from "../api/media";
import Onboarding from "../components/Onboarding";
import { useLoader } from "../hooks/useLoader";
import { getRecipes } from "../api/recipes";
import { getArticles } from "../api/article";
import { useChrome } from "../context/ChromeContext"; 
import filterbtn from "../assets/btn-filter.svg"



const ONBOARDING_KEY = "bevar:seen-onboarding";
const WELCOME_VARIANT = "animated"; // Set to "classic" for the original logo and spinner.
const SPLASH_MIN_MS = WELCOME_VARIANT === "animated" ? 2200 : 1100;
const LANDING_FILTERS = { fruitIds: [], categoryIds: [], difficultyIds: [], preparationTime: "all" };

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


export default function Landing() {
  const { setChromeless } = useChrome();
  /* ---- phase machine: "splash" -> "onboarding" | "content" ---- */
  const [phase, setPhase] = useState("splash");
  const [splashDone, setSplashDone] = useState(false);
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState(LANDING_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const term = query.trim().toLowerCase();

  const { data: recipes, loading: recipesLoading, error: recipesError } = useLoader(() => getRecipes());
  const { data: articles, loading: articlesLoading, error: articlesError } = useLoader(() => getArticles());

  const { data: filterOptions, loading: filterOptionsLoading } = useLoader(() =>
    Promise.all([getFruits(), getCategories(), getDifficulties()]).then(
      ([fruits, categories, difficulties]) => ({
        fruits: fruits ?? [],
        categories: categories ?? [],
        difficulties: difficulties ?? [],
      })
    )
  );

  const dataReady = !recipesLoading && !articlesLoading;

   /* filter per entity type — used by both suggestions and the results layout */
/*   const visibleRecipes = useMemo(() => {
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
  }, [articles, term]);  */

  const isSearching = term.length > 0;

  function handleApply(filters) {
    setApplied(filters);
    setFilterOpen(false);
  }

  /* does an entity match the applied fruit/category/difficulty filters? */
  function matchesFilters(item) {
    if (applied.fruitIds.length && !applied.fruitIds.includes(item.fruits?.id ?? item.fruit?.id))
      return false;
    if (applied.categoryIds.length && !applied.categoryIds.includes(item.category?.id ?? item.preservation_category?.id))
      return false;
    return true;
  }

  const visibleRecipes = useMemo(() => {
    const base = (recipes ?? []).filter(matchesFilters);
    if (!term) return base;
    return base.filter((recipe) =>
      [recipe.title, recipe.fruits?.name, recipe.category?.category, recipe.method?.method]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [recipes, term, applied]);

  const visibleArticles = useMemo(() => {
    const base = (articles ?? []).filter(matchesFilters);
    if (!term) return base;
    return base.filter((article) =>
      [article.title, article.excerpt, article.article_category]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [articles, term, applied]);

  /* anything constraining the view? — decides browse vs. search/filter mode */
  const hasFilters = applied.fruitIds.length > 0 || applied.categoryIds.length > 0 || applied.difficultyIds.length > 0 || applied.preparationTime !== "all";
  const isConstrained = isSearching || hasFilters;

  function handleRemoveFilter(field, id) {
    setApplied((current) =>
      field === "preparationTime"
        ? { ...current, preparationTime: "all" }
        : { ...current, [field]: current[field].filter((value) => value !== id) }
    );
  }

  function handleClearFilters() {
    setApplied(LANDING_FILTERS);
  }

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

  /* splash: minimum display time, but never longer than data needs */
  useEffect(() => {
    if (!splashDone && dataReady) {
      const timer = setTimeout(() => {
        setPhase(localStorage.getItem(ONBOARDING_KEY) ? "content" : "onboarding");
      }, SPLASH_MIN_MS);
      return () => clearTimeout(timer);
    }
  }, [splashDone, dataReady]);

  useEffect(() => {
    setChromeless(phase === "splash");
    }, [phase, setChromeless]);

  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setPhase("content");
  };

  const topRecipes = (recipes ?? []).slice(0, 5);
  const topArticles = (articles ?? []).slice(0, 5);

  /* ---- phases ---- */
  if (phase === "splash") {
    return <WelcomeScreen variant={WELCOME_VARIANT} />;
  }


  return (
    <Card variant="viewbg">
      {phase === "onboarding" ? (
        <Onboarding onComplete={finishOnboarding} />
      ) : (
        <div className="mx-auto w-full max-w-[480px] px-[20px] py-[20px] font-the-one text-dark-humor">

          {/* ---------- 1. SEARCH ROW ---------- */}
          <div className="flex gap-related py-4">
            <div className="min-w-0 flex-1">
              <SearchBar
                value={query}
                onChange={setQuery}
                suggestions={suggestions}
                onSelect={(item) => setQuery(item.label)}
              />
            </div>

            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}   /* ← toggle, not just open */
              aria-label={filterOpen ? "Close filters" : "Open filters"}
              aria-expanded={filterOpen}
              className="w-1/7 shrink-0 cursor-pointer rounded-button--icons bg-white
                        focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-spicy-berry"
            >
              <img src={filterbtn} alt="" aria-hidden="true" className="mx-auto h-full w-auto" />
            </button>
            
          </div>
          <ActiveFilters
            filters={applied}
            options={filterOptions}
            onRemove={handleRemoveFilter}
            onClear={handleClearFilters}
          />

          {/* ---------- 2. INLINE FILTER FORM — pushes content down ---------- */}
          {filterOpen && (
            <FilterCard
              initialFilters={applied}
              onApply={handleApply}
              className="mb-section"
            />
          )}

          {/* ---------- 2. APPLIED-FILTER BADGES ---------- */}
          {isConstrained && hasFilters && (
            <div className="flex flex-wrap items-center gap-related pb-4">
              <span className="text-small text-rhodophobia">Filters:</span>

              {/* map applied selections to Badge chips here, when you have
                  reference data handy — minimal version for now: */}
              <button
                type="button"
                onClick={() => setApplied(LANDING_FILTERS)}
                className="cursor-pointer text-small text-spicy-berry underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* ---------- 3. MODE SWITCH ---------- */}
          {isConstrained ? (

            /* ======== RESULTS MODE ======== */
            <div className="flex flex-col gap-section">
              <SearchResults
                heading="Recipes"
                count={visibleRecipes.length}
                empty={`No recipes match ${hasFilters ? "your filters" : `“${query}”`}.`}
              >
                {visibleRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} variant="tile" />
                ))}
              </SearchResults>

              <SearchResults
                heading="Articles"
                count={visibleArticles.length}
                empty={`No articles match ${hasFilters ? "your filters" : `“${query}”`}.`}
              >
                {visibleArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="tile" />
                ))}
              </SearchResults>

              {/* hand the landing's constraints off to the Recipes pipeline */}
              {visibleRecipes.length > 0 && (
                <Link
                  to={`/recipes?${
                    new URLSearchParams(
                      Object.entries({
                        fruitIds: applied.fruitIds.join(","),
                        categoryIds: applied.categoryIds.join(","),
                        difficultyIds: applied.difficultyIds.join(","),
                        time: applied.preparationTime !== "all" ? applied.preparationTime : "",
                        q: query,
                      }).filter(([, v]) => v)
                    ).toString()
                  }`}
                  className="w-fit self-end text-small text-spicy-berry"
                >
                  All matching recipes →
                </Link>
              )}
            </div>

          ) : (

            /* ======== BROWSE MODE (your existing landing, unchanged) ======== */
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

              {/* Browse preserving methods */}
              <section aria-label="Browse preserving methods" className="py-[20px]">
                <Heading level={2} variant={3} content="What would you like to try?" />
                {filterOptionsLoading && (
                  <p role="status" className="mt-[12px] text-small">Loading methods…</p>
                )}
                {!filterOptions.categories && (
                  <p role="alert" className="mt-[12px] text-small">
                    Methods couldn’t be loaded. Please refresh to try again.
                  </p>
                )}
                <div
                  className="mt-[12px] flex flex-nowrap gap-[10px] overflow-x-auto pb-[8px]"
                  tabIndex={0}
                  role="region"
                  aria-label="Method categories, scroll horizontally"
                >
                  {(filterOptions.categories ?? []).map((category) => (
                    <Link
                      key={category.id}
                      to={`/recipes?categoryIds=${encodeURIComponent(category.id)}`}
                      state={{ fromHome: true }}
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-[8px] whitespace-nowrap
                                 rounded-[14px] bg-white px-[16px] py-[10px] text-small text-dark-humor
                                 transition-colors hover:bg-poplar-pink
                                 focus-visible:outline-2 focus-visible:outline-spicy-berry"
                    >
                      {category.category_image_path && (
                        <span
                          aria-hidden="true"
                          className="size-[22px] shrink-0 bg-spicy-berry"
                          style={{
                            maskImage: `url("${getPublicUrl(BUCKETS.categoryImages, category.category_image_path)}")`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                          }}
                        />
                      )}
                      {category.category}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Learn more — heading left, tag-link right */}
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
      )}
      
    </Card>
  );
}