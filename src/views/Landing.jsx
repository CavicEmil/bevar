// views/Landing.jsx
import { useEffect, useState } from "react";
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

export default function Landing() {
  const { setChromeless } = useChrome();
  /* ---- phase machine: "splash" -> "onboarding" | "content" ---- */
  const [phase, setPhase] = useState("splash");
  const [splashDone, setSplashDone] = useState(false);

  const { data: recipes, loading: recipesLoading, error: recipesError } = useLoader(() => getRecipes());
  const { data: articles, loading: articlesLoading, error: articlesError } = useLoader(() => getArticles());

  const dataReady = !recipesLoading && !articlesLoading;

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
      {phase === "onboarding" ? <Onboarding onComplete={finishOnboarding} />
      :

      <div className="mx-auto w-full max-w-[480px] px-[20px] py-[20px] font-the-one text-dark-humor">
        <SearchBar />

        {/* Popular recipes — heading left, tag-link right */}
        <div className="flex items-center justify-between">
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
      </div>
      }
    </Card>
  );
}