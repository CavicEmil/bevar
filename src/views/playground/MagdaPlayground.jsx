import { useEffect, useState } from "react";
import { supabase } from "../../api/client";
import { RecipeContent } from "../Recipe";

export default function MagdaPlayground() {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRecipe() {
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select(`
            *,
            fruits(*),
            category(*),
            difficulty(*),
            recipe_ingredients(*, ingredients(*)),
            recipe_equipment(*, equipment(*)),
            step_by_step_guide(*)
          `)
          .eq("id", "e985ea7d-5f9c-4fb2-ac0e-99296251d701")
          .single();

        if (error) throw error;
        if (!cancelled) setRecipe(data);
      } catch (error) {
        if (!cancelled) {
          setError(error.message || "Could not load the recipe.");
        }
      }
    }

    loadRecipe();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p role="alert" className="p-page text-white">
        {error}
      </p>
    );
  }

  if (!recipe) {
    return (
      <p role="status" className="p-page text-white">
        Loading recipe…
      </p>
    );
  }

  return <RecipeContent key={recipe.id} recipe={recipe} />;
}