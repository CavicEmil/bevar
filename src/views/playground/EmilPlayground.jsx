// views/Recipes.jsx
import { useState } from "react";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Sorting, { SORT_OPTIONS } from "../../components/Sorting";
import RecipeCard from "../../components/RecipeCard";
import { getRecipes } from "../../api/recipes";
import { useLoader } from "../../hooks/useLoader";

/* recommended: newest first · prep-time: shortest first · a-z: alphabetical */
const SORTS = {
  recommended: { column: "created_at",        ascending: false },
  "prep-time": { column: "prep_time_minutes", ascending: true  },
  "a-z":       { column: "title",             ascending: true  },
};

export default function Recipes() {
  const [sortKey, setSortKey] = useState("recommended");
  const sort = SORTS[sortKey] ?? SORTS.recommended;

  const { data: recipes, loading, error } = useLoader(
    () => getRecipes({ orderBy: sort.column, ascending: sort.ascending }),
    [sortKey]
  );
  console.log('recipedata is', { data: recipes, loading, error });

  const [hero, ...tiles] = recipes ?? [];

  return (
    <Container>
    <Card variant="viewbg" className="min-h-screen">
      <Heading variant={2}>Recipes</Heading>

      <Sorting value={sortKey} onChange={setSortKey} />

      {loading && <p className="text-body text-rhodophobia">Loading recipes…</p>}

      {error && (
        <p className="text-body text-spicy-berry">
          Couldn't load recipes. Please try again.
        </p>
      )}

      {!loading && !error && recipes?.length === 0 && (
        <p className="text-body text-rhodophobia">No recipes yet.</p>
      )}

      {hero && (
        <div className="grid p-4 gap-[20px] lg:grid-cols-5 lg\:grid-rows-[auto_1fr]">
          {/* hero: 2 of 5 columns = 40% on desktop, full width on mobile */}
          <div className="lg\:col-span-2">
            <RecipeCard recipe={hero} variant="hero" />
          </div>

          {/* tiles: remaining 3 of 5 columns */}
          <div className="grid gap-[20px] grid-cols-2">
            {tiles.map((recipe) => (
              <>
              <RecipeCard key={recipe.id} recipe={recipe} variant="tile" />
              </>
            ))}
          </div>
        </div>
      )}
    </Card>
    </Container>
  );
}