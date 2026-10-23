import { useEffect, useState } from "react";
import { supabase } from "../api/client";
import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Input from "./ui/Input";
import Button from "./ui/Button";

const grams = { g: 1, kg: 1000, mg: 0.001 };
const singular = value => String(value ?? "").trim().toLowerCase().replace(/ies$/, "y").replace(/s$/, "");
const format = value => new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 4 }).format(value);

// recipe is the existing recipe object. onApply stores the result in the view
// for subsequent guide steps. Optional baseIngredientId resolves ambiguous names.
// Pass note only when recipe-specific calculator copy exists in your data/view.
export default function IngredientCalculator(props) {
  return <Calculator key={`${props.recipe?.id}-${props.baseIngredientId ?? ""}`} {...props} />;
}

function Calculator({ recipe, onApply, baseIngredientId, initialAmount, note, className = "" }) {
  const supplied = recipe?.recipe_ingredients ?? recipe?.recipeingredients;
  const [loaded, setLoaded] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [input, setInput] = useState(null);
  const [pending, setPending] = useState(false);
  const [applyError, setApplyError] = useState("");
  const recipeId = recipe?.id;
  const fruit = recipe?.fruits;
  const rows = supplied ?? (loaded?.recipeId === recipeId ? loaded.rows : null);
  const fruitName = recipe?.fruits?.name ?? loaded?.fruitName;

  useEffect(() => {
    let cancelled = false;
    if (!recipeId || supplied) return;
    async function load() {
      try {
        const [ingredients, fruitResult] = await Promise.all([
          supabase.from("recipe_ingredients").select("ingredient_id,amount,unit,ingredients(id,name)").eq("recipe_id", recipeId),
          fruit?.name ? Promise.resolve({ data: fruit })
            : supabase.from("fruits").select("name").eq("id", recipe.fruit_id).single(),
        ]);
        if (ingredients.error || fruitResult.error) throw ingredients.error ?? fruitResult.error;
        if (!cancelled) setLoaded({ recipeId, rows: ingredients.data, fruitName: fruitResult.data?.name });
      } catch {
        if (!cancelled) setLoadError("Could not load ingredients. Please reopen and try again.");
      }
    }
    load();
    return () => { cancelled = true; };
  }, [recipeId, recipe?.fruit_id, fruit, supplied]);

  const candidates = rows?.filter(row => baseIngredientId
    ? (row.ingredient_id ?? row.ingredients?.id) === baseIngredientId
    : Boolean(fruitName) && singular(row.ingredients?.name) === singular(fruitName)) ?? [];
  const base = candidates.length === 1 ? candidates[0] : null;
  const baseGrams = base ? Number(base.amount) * grams[base.unit?.trim().toLowerCase()] : NaN;
  const validData = Boolean(rows?.length) && Number.isFinite(baseGrams) && baseGrams > 0
    && rows.every(row => row.amount !== null && row.amount !== "" && Number.isFinite(Number(row.amount)) && Number(row.amount) >= 0 && row.ingredients?.name && row.unit);
  const value = input?.recipeId === recipeId ? input.value : String(initialAmount ?? (Number.isFinite(baseGrams) ? baseGrams : ""));
  const amount = Number(value);
  const factor = amount / baseGrams;
  const valid = validData && value.trim() !== "" && Number.isFinite(amount) && amount > 0
    && rows.every(row => Number.isFinite(Number(row.amount) * factor));
  // Always calculate from original values, never from previously rounded results.
  const calculated = valid ? rows.map(row => ({ ...row, amount: Number(row.amount) * factor })) : [];
  const dataError = rows && !validData ? "The recipe needs a matching fruit ingredient with a positive weight in g, kg or mg, and numeric ingredient amounts." : "";

  async function apply(event) {
    event.preventDefault();
    if (!valid || pending || typeof onApply !== "function") return;
    setPending(true);
    setApplyError("");
    try {
      await onApply({ recipeId, fruitAmountGrams: amount, scaleFactor: factor, ingredients: calculated });
    } catch {
      setApplyError("Could not use this amount. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className={`w-full rounded-[28px] p-page font-the-one text-dark-humor ${className}`}>
      <form onSubmit={apply} className="flex flex-col items-start gap-[16px]" aria-label="Ingredient calculator" aria-busy={!rows && !loadError || pending}>
        <Heading level={2} variant={1} content="Calculate ingredients" />
        <p className="text-body">Make the recipe fit your amount.</p>
        {!rows && !loadError && <p role="status" className="text-body">Loading ingredients…</p>}
        {(loadError || dataError) && <p role="alert" className="text-body">{loadError || dataError}</p>}
        <Input variant="calculator" className="w-full [&_input]:max-w-[205px] [&_input]:text-[28px]"
          value={value} min={0} step="any" disabled={!validData || pending}
          onChange={event => { setInput({ recipeId, value: event.target.value }); setApplyError(""); }}
          error={validData && !valid ? "Enter a fruit amount greater than zero." : undefined} />
        <Heading level={3} variant={2} content="For your amount" />
        <dl className="m-0 flex w-full flex-col gap-[16px]" aria-live="polite" aria-atomic="true">
          {(rows ?? []).map(row => {
            const id = row.ingredient_id ?? row.ingredients?.id;
            const result = calculated.find(item => (item.ingredient_id ?? item.ingredients?.id) === id);
            return <div key={id} className="grid grid-cols-[minmax(0,170fr)_minmax(0,127fr)] gap-[8px] border-b border-rose-fantasy py-[12px] text-body">
              <dt>{row.ingredients?.name}</dt>
              <dd className="m-0 font-semibold">{result ? `${format(result.amount)} ${row.unit}` : "—"}</dd>
            </div>;
          })}
        </dl>
        {note && <p className="text-[11px] leading-[1.4]">{note}</p>}
        {applyError && <p role="alert" className="text-body">{applyError}</p>}
        <Button type="submit" content={pending ? "Applying…" : "Use this amount"}
          disabled={!valid || pending || typeof onApply !== "function"} />
      </form>
    </Card>
  );
}
