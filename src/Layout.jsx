import {
  Outlet,
  useMatch,
  useLocation,
  useMatches,
  useNavigate,
  useSearchParams,
} from "react-router";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "./components/ui/Container";
import { useChrome } from "./context/ChromeContext";

export default function Layout() {
  const { chromeless } = useChrome();
  const { pathname, state } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const recipeRoute = useMatch("/recipes/:id");
  const articleRoute = useMatch("/articles/:slug");
  const blogRoute = useMatch("/blog");

  const matches = useMatches();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const recipe = recipeRoute
    ? matches
        .map((match) => match.loaderData)
        .find((data) => data?.id === recipeRoute.params.id)
    : null;

  const isGuide =
    Boolean(recipeRoute) && searchParams.get("guide") === "1";

  const isArticleResults =
    Boolean(blogRoute) && searchParams.get("view") === "all";
  const isEditingProfile = pathname === "/profile" && searchParams.get("edit") === "1";
  const isHomeMethodResults = pathname === "/recipes" && state?.fromHome === true;

  function handleBack() {
    if (isHomeMethodResults) {
      navigate("/");
      window.scrollTo(0, 0);
      return;
    }
    if (isEditingProfile) {
      const next = new URLSearchParams(searchParams);
      next.delete("edit");
      setSearchParams(next);
      window.scrollTo(0, 0);
      return;
    }
    if (articleRoute) {
      navigate("/blog");
      window.scrollTo(0, 0);
      return;
    }

    if (isArticleResults) {
      const next = new URLSearchParams(searchParams);
      next.delete("view");
      setSearchParams(next, { replace: true });
      window.scrollTo(0, 0);
      return;
    }

    if (isGuide) {
      const next = new URLSearchParams(searchParams);
      next.delete("guide");
      setSearchParams(next, { replace: true });
      window.scrollTo(0, 0);
      return;
    }

    navigate("/recipes");
    window.scrollTo(0, 0);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {!chromeless && (
        <Header
          variant={
            recipeRoute || articleRoute || isArticleResults || isEditingProfile || isHomeMethodResults
              ? "title"
              : "logo"
          }
          title={recipe?.title ?? ""}
          isGuide={isGuide}
          backLabel={
            isHomeMethodResults ? "Back to home" : isEditingProfile ? "Back to profile" : articleRoute || isArticleResults ? "Learn" : undefined
          }
          onBack={handleBack}
        />
      )}

      <Container className={recipeRoute && !isGuide ? "flex flex-1 flex-col" : ""}>
        <main className={recipeRoute && !isGuide ? "flex flex-1 flex-col" : "flex-1"}>
          <Outlet />
        </main>
      </Container>

      {!chromeless && !isAuthPage && <Footer />}
    </div>
  );
}
