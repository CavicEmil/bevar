import { useState } from "react";
import { Link, useLocation, useMatch, useNavigate } from "react-router";
import Button from "./ui/Button";
import logo from "../assets/logo-big.png";

export default function Header({
  variant = "logo",
  title = "",
  isGuide = false,
  onBack,
}) {
  const collectionRoute = useMatch("/profile/recipes");
  const recipeRoute = useMatch("/recipes/:id");
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.recipeReturnTo;
  const origin = typeof source === "string" && source.startsWith("/") && !source.startsWith("//")
    ? source
    : null;
  const currentPath = location.pathname + location.search;
  const [navigation, setNavigation] = useState({
    key: location.key,
    path: currentPath,
    returnTo: origin ?? "/recipes",
  });

  // Keep the origin when opening or closing the guide on the same recipe.
  if (navigation.key !== location.key) {
    setNavigation({
      key: location.key,
      path: currentPath,
      returnTo: origin ?? (
        navigation.path.split("?")[0] !== location.pathname
          ? navigation.path
          : navigation.returnTo
      ),
    });
  }

  const pageLabels = {
    "/": "Home",
    "/recipes": "Recipes",
    "/profile/recipes": "My recipes",
    "/profile": "My profile",
    "/blog": "Learn",
    "/login": "Log in",
    "/signup": "Sign up",
  };
  const returnPath = navigation.returnTo.split("?")[0];
  const returnLabel = collectionRoute
    ? "My profile"
    : window.history.state?.idx > 0
      ? pageLabels[returnPath] ?? "Back"
      : "Recipes";

  function handleBack() {
    if (isGuide) {
      onBack?.();
      return;
    }

    if (collectionRoute) {
      navigate("/profile");
      return;
    }

    if (recipeRoute) {
      if (window.history.state?.idx > 0) {
        navigate(-1);
      } else {
        navigate("/recipes", { replace: true });
      }
      return;
    }

    onBack?.();
  }

  return (
    <header className="w-full text-white">
      <div className="flex min-h-20 items-center gap-related px-page py-4 sm:py-5">
        {variant === "logo" && !collectionRoute ? (
          <Link to="/" aria-label="Go to home" className="inline-flex">
            <img
              src={logo}
              alt="BEVAR"
              className="h-auto w-28 max-w-full sm:w-32"
            />
          </Link>
        ) : (
          <>
            <Button
              variant="ghost"
              icon={isGuide ? "exit" : "back"}
              content={isGuide ? "Exit" : returnLabel}
              ariaLabel={isGuide ? "Exit guide" : "Go back"}
              onClick={handleBack}
              className={isGuide
                ? "shrink-0 text-heading-3! [&_svg]:rotate-180"
                : "min-w-0 justify-start! text-left text-heading-3!"}
            />

            {isGuide && (
              <span className="min-w-0 flex-1 break-words text-right text-heading-3">
                {title}
              </span>
            )}
          </>
        )}
      </div>
    </header>
  );
}
