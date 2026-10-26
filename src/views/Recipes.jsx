import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router";

import Heading from "../components/ui/Heading";
import Button from "../components/ui/Button";
import Sorting from "../components/Sorting";
import RecipeCard from "../components/RecipeCard";

import { getRecipes } from "../api/recipes";

const SORTS = {
  recommended: { column: "created_at", ascending: false },
  "prep-time": { column: "prep_time_minutes", ascending: true },
  "a-z": { column: "title", ascending: true },
};

export default function Recipes() {
  const loaderData = useLoaderData();

  // Use route data when available.
  const routeRecipes = Array.isArray(loaderData)
    ? loaderData
    : null;

  const [loadedRecipes, setLoadedRecipes] = useState([]);
  const [sort, setSort] = useState("recommended");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // Fetch directly when previewing inside your playground.
  useEffect(() => {
    if (routeRecipes !== null) return;

    let cancelled = false;

    async function loadRecipes() {
      setLoading(true);
      setError("");

      try {
        const data = await getRecipes();

        if (!cancelled) {
          setLoadedRecipes(data ?? []);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load recipes. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      cancelled = true;
    };
  }, [routeRecipes, retry]);

  const recipes = routeRecipes ?? loadedRecipes;
  const isLoading = routeRecipes === null && loading;

  const sortedRecipes = useMemo(() => {
    const { column, ascending } =
      SORTS[sort] ?? SORTS.recommended;

    return [...recipes].sort((a, b) => {
      const left = a[column];
      const right = b[column];

      // Keep missing values at the end.
      if (left == null && right == null) return 0;
      if (left == null) return 1;
      if (right == null) return -1;

      let comparison;

      if (column === "title") {
        comparison = String(left).localeCompare(String(right));
      } else if (column === "created_at") {
        comparison =
          (Date.parse(left) || 0) - (Date.parse(right) || 0);
      } else {
        comparison = Number(left) - Number(right);
      }

      return (
        comparison * (ascending ? 1 : -1) ||
        (a.title ?? "").localeCompare(b.title ?? "")
      );
    });
  }, [recipes, sort]);

  return (

      <section
        aria-label="All recipes"
        className="
          mx-auto w-full max-w-[480px]
          min-h-[calc(100dvh-80px)]
          rounded-t-[28px] bg-rose-fantasy
          px-[20px] pt-[20px] pb-[110px]
          font-the-one text-dark-humor
        "
      >
        {/* Add the search bar here later. */}

        <Heading
          level={1}
          variant={1}
          content="What will you preserve?"
          className="text-dark-humor"
        />

        <div className="my-section flex justify-end">
          <Sorting value={sort} onChange={setSort} />
        </div>

        {isLoading ? (
          <p role="status" className="text-body">
            Loading recipes…
          </p>
        ) : error ? (
          <div className="flex flex-col items-start gap-related">
            <p role="alert" className="text-body">
              {error}
            </p>

            <Button
              content="Try again"
              onClick={() => setRetry((value) => value + 1)}
            />
          </div>
        ) : sortedRecipes.length === 0 ? (
          <p className="text-body">
            No recipes available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-[16px]">
            {sortedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                variant="tile"
              />
            ))}
          </div>
        )}
      </section>
  );
}