// views/Landing.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import SearchBar from "../components/SearchBar"; 
import Heading from "../components/ui/Heading";
import Spinner from "../components/ui/Spinner";
import Card from "../components/ui/Card";
import RecipeCard from "../components/RecipeCard";
import ArticleCard from "../components/ArticleCard";
import Carousel from "../components/ui/Carousel";
import Onboarding from "../components/Onboarding";
import { useLoader } from "../hooks/useLoader";
import { getRecipes } from "../api/recipes";
import { getArticles } from "../api/article";
import logo from '../assets/logo-big.png';
import { useChrome } from "../context/ChromeContext"; 

const ONBOARDING_KEY = "bevar:seen-onboarding";
const SPLASH_MIN_MS = 1100;

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
  const term = query.trim().toLowerCase();

  const { data: recipes, loading: recipesLoading, error: recipesError } = useLoader(() => getRecipes());
  const { data: articles, loading: articlesLoading, error: articlesError } = useLoader(() => getArticles());

  const dataReady = !recipesLoading && !articlesLoading;

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
    return (
      <div className="flex min-h-[100dvh] bg-dark-humor flex-col items-center justify-center gap-related">
        <img src={logo} alt="Bevar" className="w-[200px]" /> 
        <Spinner />
      </div>
    );
  }


  return (
    <Card variant="viewbg">
      {/* onboarding overlays the ready content underneath */}
      {phase === "onboarding" ? ( <Onboarding onComplete={finishOnboarding} />
        ) : (
        <div className="mx-auto w-full max-w-[480px] px-[20px] py-[20px] font-the-one text-dark-humor">
          <SearchBar 
            value={query}
            onChange={setQuery}
            suggestions={suggestions}
            onSelect={(item) => setQuery(item.label)}
          />
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

            <Carousel>
              {topRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} variant="hero" />
              ))}
            </Carousel>
          
            {/* Learn more — same header pattern, second section */}
            <div className="flex items-center justify-between pt-4">
              <Heading variant={1} content="Learn more" />
              <Link to="/blog" className="w-fit text-small text-spicy-berry hover:text-spicy-berry">
                All articles →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-[16px]">
              {topArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="tile" />
              ))}
            </div>
          </>
          )}
        </div>
        )}
    </Card>
  );
}