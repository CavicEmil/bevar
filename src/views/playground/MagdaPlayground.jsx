import { useEffect, useState } from "react";
import { supabase } from "../../api/client";
import IngredientCalculatorButton from "../../components/ui/IngredientCalculatorButton";

export default function MagdaPlayground() {
  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [calculated, setCalculated] = useState(null);
  const [status, setStatus] = useState("Loading recipes…");

  useEffect(() => {
    let cancelled = false;

    async function loadRecipes() {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, fruit_id, fruits(name)")
        .order("title");

      if (cancelled) return;

      if (error) {
        setStatus(error.message);
        return;
      }

      setRecipes(data ?? []);
      setSelectedId(String(data?.[0]?.id ?? ""));
      setStatus(data?.length ? "" : "No recipes found.");
    }

    loadRecipes();

    return () => {
      cancelled = true;
    };
  }, []);

  const recipe = recipes.find(
    (item) => String(item.id) === selectedId
  );

  const result =
    calculated?.recipeId === recipe?.id ? calculated : null;

  return (
    <main className="min-h-screen bg-rose-fantasy p-page font-the-one text-dark-humor">
      <div className="mx-auto flex w-full max-w-[345px] flex-col gap-section">
        {status && <p role="status">{status}</p>}

        {recipe && (
          <>
            <select
              aria-label="Choose recipe"
              value={selectedId}
              onChange={(event) => {
                setSelectedId(event.target.value);
                setCalculated(null);
              }}
              className="w-full rounded-button--icons bg-white p-button text-dark-humor"
            >
              {recipes.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.title}
                </option>
              ))}
            </select>

            <IngredientCalculatorButton
              key={recipe.id}
              recipe={recipe}
              onApply={setCalculated}
            />

            {result && (
              <section className="rounded-card bg-white p-page">
                <h2 className="mb-4 text-heading-2 text-spicy-berry">
                  Your ingredients
                </h2>

                <dl className="flex flex-col gap-objects">
                  {result.ingredients.map((row) => (
                    <div
                      key={row.ingredient_id ?? row.ingredients?.id}
                      className="flex justify-between gap-related border-b border-rose-fantasy py-3 text-body"
                    >
                      <dt>{row.ingredients?.name}</dt>

                      <dd className="m-0 font-semibold">
                        {row.unit?.trim().toLowerCase() === "to taste"
                          ? row.unit
                          : `${new Intl.NumberFormat("en-GB", {
                              maximumSignificantDigits: 4,
                            }).format(Number(row.amount))} ${row.unit}`}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}