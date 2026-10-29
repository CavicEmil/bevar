import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useLoader } from "../hooks/useLoader";
import { getFruits, getCategories, getDifficulties } from "../api/reference";
import ActiveFilters from "../components/ActiveFilters";
import Heading from "../components/ui/Heading";
import Button from "../components/ui/Button";
import Sorting from "../components/Sorting";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/ui/Spinner";
import Card from "../components/ui/Card";
import SearchBar from "../components/SearchBar";
import FilterCard from "../components/FilterCard";
import { ONBOARDING_TIMES } from "../constants/onboarding";
import filterbtn from "../assets/btn-filter.svg";


import { getRecipes } from "../api/recipes";
import useSavedRecipes from "../hooks/useSavedRecipes";

const SORTS = {
  "recommended": { column: "created_at",        ascending: false },
  "prep-time": { column: "prep_time_minutes", ascending: true  },
  "a-z":       { column: "title",             ascending: true  },
};

export default function Recipes() {
  const { data: filterOptions } = useLoader(() =>
  Promise.all([getFruits(), getCategories(), getDifficulties()]).then(
    ([fruits, categories, difficulties]) => ({
      fruits: fruits ?? [],
      categories: categories ?? [],
      difficulties: difficulties ?? [],
    })
  ));
  const saved = useSavedRecipes();
  const [loadedRecipes, setLoadedRecipes] = useState([]);
  const [sort, setSort] = useState("recommended");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const fruitIdsParam = searchParams.get("fruitIds") ?? "";
  const categoryIdsParam = searchParams.get("categoryIds") ?? "";
  const timeKey = searchParams.get("time") ?? "";
  const fruitIds = fruitIdsParam.split(",").filter(Boolean);
  const categoryIds = categoryIdsParam.split(",").filter(Boolean);
  const prepTimeRange = timeKey 
    ? ONBOARDING_TIMES.find((time) => time.id === timeKey) ?? null
    : null;
  const difficultyIdsParam = searchParams.get("difficultyIds") ?? "";
  const difficultyIds = difficultyIdsParam.split(",").filter(Boolean);

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
            difficultyIds,
            prepTimeRange: prepTimeRange,
          });
          if (!cancelled) setLoadedRecipes(data ?? []);
        } catch (err) {
          if (!cancelled) setError("Could not load recipes. Please try again.");
        } finally {
          if (!cancelled) setLoading(false);
        } 
      }

      loadRecipes();
      return () => { cancelled = true; };
  }, [fruitIdsParam, categoryIdsParam, difficultyIdsParam, timeKey, activeSort.column, activeSort.ascending, retry]);

    const initialFilters = {
      fruitIds,
      categoryIds,
      difficultyIds,
      preparationTime: timeKey || "all",
    };
  /* filtering for search bar queries on title, fruit, category/method */
  const visibleRecipes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return loadedRecipes;

    return loadedRecipes.filter((recipe) =>
      [
        recipe.title,
        recipe.fruits?.name,          
        recipe.category?.category,
        recipe.method?.method,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [loadedRecipes, query]);

  /* suggestions: matching titles, typed for the SearchBar's contract */
  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return visibleRecipes.slice(0, 5).map((recipe) => ({
      id: recipe.id,
      type: "recipe",
      label: recipe.title,
    }));
  }, [visibleRecipes, query]);


  const recipes = loadedRecipes;
  const isLoading = loading;

  function handleApply(filters) {
    const next = new URLSearchParams();

    if (filters.fruitIds?.length)    next.set("fruitIds", filters.fruitIds.join(","));
    if (filters.categoryIds?.length) next.set("categoryIds", filters.categoryIds.join(","));
    if (filters.difficultyIds?.length) next.set("difficultyIds", filters.difficultyIds.join(","));
    if (filters.preparationTime && filters.preparationTime !== "all")
      next.set("time", filters.preparationTime);

    setSearchParams(next);        // ← the URL is the single source of truth
    setFilterOpen(false);
  }

  function handleRemoveFilter(field, id) {
    const next = new URLSearchParams(searchParams);

    if (field === "preparationTime") {
      next.delete("time");
    } else {
      const remaining = (next.get(field) ?? "")
        .split(",")
        .filter(Boolean)
        .filter((value) => value !== id);

      if (remaining.length) next.set(field, remaining.join(","));
      else next.delete(field);
    }

    setSearchParams(next);   // effect refetches with the reduced filter
  }

  function handleClearFilters() {
    const next = new URLSearchParams(searchParams);
    ["fruitIds", "categoryIds", "difficultyIds", "time"].forEach((key) => next.delete(key));
    setSearchParams(next);
  }

  return (
    <Card className="min-h-screen p-4" variant="viewbg"
    >
      <div className="flex gap-related p-4">
        {/* SearchBar grows to fill what the button doesn't take */}
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
          onClick={() => setFilterOpen((open) => !open)}
          aria-label={filterOpen ? "Close filters" : "Open filters"}
          aria-expanded={filterOpen}
          className="w-1/7 shrink-0 cursor-pointer rounded-button--icons bg-white
                    focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-spicy-berry"
        >
          <img src={filterbtn} alt="" aria-hidden="true" className="mx-auto h-full w-auto" />
        </button>
      </div>
      <div className="px-4 pb-4">
        <Sorting value={sort} onChange={setSort} />
      </div>

      {/* ---------- ACTIVE FILTERS — chips under the search row ---------- */}
      <ActiveFilters
        filters={initialFilters}
        options={filterOptions}
        onRemove={handleRemoveFilter}
        onClear={handleClearFilters}
      />
      {/* ---------- INLINE FILTER FORM — pushes content down ---------- */}
      {filterOpen && (
        <FilterCard
          initialFilters={initialFilters}
          onApply={handleApply}
        />
      )}

      <Heading
        level={1}
        variant={1}
        content="What will you preserve?"
        className="mb-section text-dark-humor pt-4"
      />

      {saved.error && (
        <div className="mb-section flex flex-col items-start gap-related">
          <p role="alert" className="text-small">{saved.error}</p>
          <Button content="Try again" variant="secondary" onClick={saved.refresh} />
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className="flex flex-col items-start gap-related">
          <p role="alert" className="text-body">
            {error}
          </p>
          <Button content="Try again" onClick={() => setRetry((value) => value + 1)} />
        </div>
      ) : query.trim() && visibleRecipes.length === 0 ? (
        <p className="text-body">No recipes match “{query}”. Try another word.</p>
      ) : recipes.length === 0 ? (
        <p className="text-body">No recipes available yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-[16px]">
          {visibleRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} variant="tile"
              isSaved={saved.isSaved(recipe.id)} onToggleSave={() => saved.toggle(recipe)} />
          ))}
        </div>
      )}
    </Card>
  );
}
