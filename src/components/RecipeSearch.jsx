import { useEffect, useMemo, useState } from "react";

import { getRecipes } from "../api/recipes";
import {
  getFruits,
  getCategories,
  getDifficulties,
} from "../api/reference";

import {
  createEmptyFilters,
  getTimeRange,
  removeFilter,
} from "../constants/recipeFilters";

import SearchBar from "./SearchBar";
import ActiveFilters from "./ActiveFilters";
import FilterCard from "./FilterCard";
import Button from "./ui/Button";

export default function RecipeSearch({ value, onChange }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [options, setOptions] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  const filters = {
    fruitIds: value.fruitIds ?? [],
    categoryIds: value.categoryIds ?? [],
    difficultyIds: value.difficultyIds ?? [],
    preparationTime: value.preparationTime ?? "all",
  };

  /* Load recipes for suggestions and reference data for filters. */
  useEffect(() => {
    let active = true;

    async function loadSearchData() {
      try {
        const [
          recipeData,
          fruits,
          categories,
          difficulties,
        ] = await Promise.all([
          getRecipes(),
          getFruits(),
          getCategories(),
          getDifficulties(),
        ]);

        if (!active) return;

        setRecipes(recipeData ?? []);

        setOptions({
          fruits: fruits ?? [],
          categories: categories ?? [],
          difficulties: difficulties ?? [],
        });
      } catch {
        if (active) {
          setError("Could not load search suggestions and filters.");
        }
      }
    }

    loadSearchData();

    return () => {
      active = false;
    };
  }, []);

  /* The parent view receives and stores the complete search state. */
  function update(changes) {
    const next = {
      ...value,
      ...filters,
      ...changes,
    };

    onChange({
      ...next,
      prepTimeRange: getTimeRange(next.preparationTime),
    });
  }

  /* Build suggestions from the loaded API data. */
  const suggestions = useMemo(() => {
    const query = (value.search ?? "").trim().toLowerCase();
    if (!query) return [];

    const terms = query.split(/\s+/);

    const items = [
      ...(options?.fruits ?? []).map((fruit) => ({
        id: fruit.id,
        type: "fruit",
        label: fruit.name,
      })),

      ...(options?.categories ?? []).map((category) => ({
        id: category.id,
        type: "category",
        label: category.category,
      })),

      ...recipes.map((recipe) => ({
        id: recipe.id,
        type: "recipe",
        label: recipe.title,
      })),
    ];

    function rank(item) {
      const label = item.label.toLowerCase();

      if (label === query) return 0;
      if (label.startsWith(query)) return 1;

      return 2;
    }

    return items
      .filter(
        (item) =>
          typeof item.label === "string" &&
          terms.every((term) =>
            item.label.toLowerCase().includes(term)
          )
      )
      .sort(
        (a, b) =>
          rank(a) - rank(b) ||
          a.label.localeCompare(b.label)
      )
      .slice(0, 8);
  }, [value.search, options, recipes]);

  function selectSuggestion(item) {
    /* A recipe suggestion becomes the search text. */
    if (item.type === "recipe") {
      update({ search: item.label });
      return;
    }

    /* Fruit and category suggestions become active filters. */
    const field =
      item.type === "fruit" ? "fruitIds" : "categoryIds";

    update({
      search: "",
      [field]: [...new Set([...filters[field], item.id])],
    });
  }

  return (
    <section
      aria-label="Recipe search"
      className="
        flex w-full min-w-0 flex-col gap-section
        font-the-one text-dark-humor
      "
    >
      <div className="flex items-start gap-related">
        <SearchBar
          value={value.search ?? ""}
          onChange={(search) => update({ search })}
          suggestions={suggestions}
          onSelect={selectSuggestion}
        />

        <Button
          icon="filter"
          ariaLabel={
            filtersOpen ? "Close filters" : "Open filters"
          }
          pressed={filtersOpen}
          disabled={!options}
          onClick={() =>
            setFiltersOpen((current) => !current)
          }
        />
      </div>

      <ActiveFilters
        filters={filters}
        options={options}
        onRemove={(field, id) =>
          update(removeFilter(filters, field, id))
        }
        onClear={() => update(createEmptyFilters())}
      />

      {filtersOpen && (
        <FilterCard
          initialFilters={filters}
          options={options}
          onApply={(selectedFilters) => {
            update(selectedFilters);
            setFiltersOpen(false);
          }}
        />
      )}

      {!options && !error && (
        <p role="status" className="text-body">
          Loading search options…
        </p>
      )}

      {error && (
        <p role="alert" className="text-body">
          {error}
        </p>
      )}
    </section>
  );
}