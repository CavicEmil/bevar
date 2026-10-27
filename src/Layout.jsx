import {
  Outlet,
  useMatch,
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
  const recipeRoute = useMatch("/recipes/:id");
  const matches = useMatches();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const recipe = recipeRoute
    ? matches
        .map(match => match.loaderData)
        .find(data => data?.id === recipeRoute.params.id)
    : null;

  const isGuide =
    Boolean(recipeRoute) && searchParams.get("guide") === "1";

  function handleBack() {
    if (isGuide) {
      const next = new URLSearchParams(searchParams);
      next.delete("guide");
      setSearchParams(next, { replace: true });
    } else {
      navigate("/recipes");
    }

    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {!chromeless && 
      <Header
        variant={recipeRoute ? "title" : "logo"}
        title={recipe?.title ?? ""}
        isGuide={isGuide}
        onBack={handleBack}
      />
      }

      <Container>
        <main className="flex-1">
          <Outlet />
        </main>
      </Container>

      {!chromeless && <Footer />}
    </div>
  );
}