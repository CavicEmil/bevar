import { useEffect, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import Heading from "../components/ui/Heading";
import Button from "../components/ui/Button";
import Sorting from "../components/Sorting";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/ui/Spinner";
import Card from "../components/ui/Card";
import { ONBOARDING_TIMES } from "../constants/onboarding";


import { getRecipes } from "../api/recipes";

const SORTS = {
  "recommended": { column: "created_at",        ascending: false },
  "prep-time": { column: "prep_time_minutes", ascending: true  },
  "a-z":       { column: "title",             ascending: true  },
};

export default function Recipes() {
  const loaderData = useLoaderData();
  const routeRecipes = Array.isArray(loaderData) ? loaderData : null;

  const [loadedRecipes, setLoadedRecipes] = useState([]);
  const [sort, setSort] = useState("recommended");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [searchParams] = useSearchParams();
  const fruitIds = searchParams.get("fruitIds")?.split(",").filter(Boolean) ?? [];
  const categoryIds = searchParams.get("categoryIds")?.split(",").filter(Boolean) ?? [];
  const timeKey = searchParams.get("time");
  const prepTimeRange = timeKey 
    ? ONBOARDING_TIMES.find((time) => time.id === timeKey) ?? null
    : null;

  const activeSort = SORTS[sort] ?? SORTS.recommended;

  useEffect(() => {
      let cancelled = false;

      async function loadRecipes() {
        setLoading(true);
        setError("");
        try {
          const data = await getRecipes({
            orderBy: activeSort.column,
            ascending: activeSort.ascending,
            fruitIds,
            categoryIds,
            prepTimeRange: prepTimeRange,
          });
          if (!cancelled) setLoadedRecipes(data ?? []);
        } catch (err) {
          console.log("searchParams is", );
  console.error("Recipes fetch failed:", [searchParams]);
  if (!cancelled) setError("Could not load recipes. Please try again.");
} /* {
          if (!cancelled) setError("Could not load recipes. Please try again.");
        } finally {
          if (!cancelled) setLoading(false);
        } */
      }

      loadRecipes();
      return () => { cancelled = true; };
    }, [activeSort.column, activeSort.ascending, retry]);



  const recipes = routeRecipes ?? loadedRecipes;
  const isLoading = routeRecipes === null && loading;

  const [hero, ...tiles] = recipes ?? [];

console.log("loaderData:", loaderData, "| sort:", sort, "| recipes[0]:", recipes?.[0]?.title);
  return (
    <Card className="min-h-screen p-4" variant="viewbg"
    >
      {/* Add the search bar here later. */}

      <Heading
        level={1}
        variant={1}
        content="What will you preserve?"
        className="text-dark-humor"
      />

      <div className="relative p-4">
        <Sorting value={sort} onChange={setSort} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className="flex flex-col items-start gap-related">
          <p role="alert" className="text-body">
            {error}
          </p>
          <Button content="Try again" onClick={() => setRetry((value) => value + 1)} />
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-body">No recipes available yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-[16px]">
          {/* hero spans the full width — both columns of the mobile shell */}
          <div className="col-span-2">
            <RecipeCard recipe={hero} variant="hero" />
          </div>

          {tiles.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} variant="tile" />
          ))}
        </div>
      )}
    </Card>
  );
}