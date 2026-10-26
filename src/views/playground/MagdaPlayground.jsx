import { useEffect, useState } from "react";
import { supabase } from "../../api/client";
import IngredientCalculator from "../../components/IngredientCalculator";

export default function MagdaPlayground() {
  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState("Loading recipes…");

  useEffect(() => {
    async function loadRecipes() {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, fruit_id, fruits(name)")
        .order("title");

      if (error) {
        setStatus(error.message);
        return;
      }

      setRecipes(data);
      setSelectedId(data[0]?.id ?? "");
      setStatus(data.length ? "" : "Supabase nie zwrócił przepisów.");
    }

    loadRecipes();
  }, []);

  const recipe = recipes.find((item) => item.id === selectedId);

  return (
    <main className="min-h-screen bg-rose-fantasy p-page font-the-one">
      <div className="mx-auto flex max-w-[345px] flex-col gap-section">
        {status && <p role="status">{status}</p>}

        {recipe && (
          <>
            <select
              aria-label="Choose recipe"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="rounded-button--icons bg-white p-button text-dark-humor"
            >
              {recipes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <IngredientCalculator
              recipe={recipe}
              onApply={(result) =>
                console.log("Przeliczone składniki:", result)
              }
            />
          </>
        )}
      </div>
    </main>
  );
}