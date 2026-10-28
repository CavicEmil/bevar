import { useEffect, useState } from "react";
import { supabase } from "../api/client";
import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Input from "./ui/Input";
import Button from "./ui/Button";

const grams = { g: 1, kg: 1000, mg: 0.001 };
const toTaste = row => row.unit?.trim().toLowerCase() === "to taste";
const words = value => String(value ?? "").toLowerCase().match(/[\p{L}\p{N}]+/gu)?.map(word => word.replace(/ies$/, "y").replace(/s$/, "")) ?? [];
function matchesFruit(name, fruitName) {
  const ingredient = words(name);
  const fruit = words(fruitName);
  return fruit.length > 0 && ingredient.some((_, start) => fruit.every((word, index) => ingredient[start + index] === word));
}
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
  const rows = supplied ?? (loaded?.recipeId === recipeId ? loaded?.rows ?? null : null);
  const fruitName = recipe?.fruits?.name ?? loaded?.fruitName;

  useEffect(() => {
    let cancelled = false;
    if (!recipeId || (supplied && (fruit?.name || baseIngredientId))) return;
    async function load() {
      try {
        const [ingredients, fruitResult] = await Promise.all([
          supplied ? Promise.resolve({ data: supplied })
            : supabase.from("recipe_ingredients").select("ingredient_id,amount,unit,ingredients(id,name)").eq("recipe_id", recipeId),
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
  }, [recipeId, recipe?.fruit_id, fruit, supplied, baseIngredientId]);

  const candidates = rows?.filter(row => baseIngredientId
    ? (row.ingredient_id ?? row.ingredients?.id) === baseIngredientId
    : Boolean(fruitName) && matchesFruit(row.ingredients?.name, fruitName)) ?? [];
  // Prefer an exact name; decorated names are accepted only when unambiguous.
  const exact = candidates.filter(row => words(row.ingredients?.name).join(" ") === words(fruitName).join(" "));
  const base = candidates.length === 1 ? candidates[0] : !baseIngredientId && exact.length === 1 ? exact[0] : null;
  const baseUnit = base?.unit?.trim().toLowerCase();
  // Weights are entered in g; volume and other units stay as stored in the recipe.
  // Never assume a density to convert ml of fruit into grams.
  const inputUnit = grams[baseUnit] ? "g" : base?.unit?.trim() ?? "";
  const baseAmount = base && !toTaste(base) ? Number(base.amount) * (grams[baseUnit] ?? 1) : NaN;
  const validData = Boolean(rows?.length) && Number.isFinite(baseAmount) && baseAmount > 0
    && rows.every(row => row.amount !== null && row.amount !== "" && Number.isFinite(Number(row.amount)) && Number(row.amount) >= 0 && row.ingredients?.name && row.unit);
  const value = input ?? String(initialAmount ?? (Number.isFinite(baseAmount) ? baseAmount : ""));
  const amount = Number(value);
  const factor = amount / baseAmount;
  const valid = validData && value.trim() !== "" && Number.isFinite(amount) && amount > 0
    && rows.every(row => Number.isFinite(Number(row.amount) * factor));
  // Always calculate from original values, never from previously rounded results.
  const calculated = valid ? rows.map(row => ({ ...row, amount: toTaste(row) ? Number(row.amount) : Number(row.amount) * factor })) : [];
  const dataError = rows?.length === 0 ? "No ingredients have been added to this recipe yet."
    : rows && !validData ? "This recipe needs a matching fruit ingredient with a positive amount and unit, and numeric ingredient amounts." : "";

  function changeAmount(event) {
    setInput(event.target.value);
    setApplyError("");
  }

  async function apply(event) {
    event.preventDefault();
    if (!valid || pending || typeof onApply !== "function") return;
    setPending(true);
    setApplyError("");
    try {
      await onApply({ recipeId, fruitAmount: amount, fruitUnit: inputUnit,
        fruitAmountGrams: inputUnit === "g" ? amount : null,
        scaleFactor: factor, ingredients: calculated });
    } catch {
      setApplyError("Could not use this amount. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className={`w-full rounded-[28px] p-page font-the-one text-dark-humor ${className}`}>
      <form onSubmit={apply} onInput={event => {
        if (event.target.name === "fruitAmount") changeAmount(event);
      }} className="flex w-full flex-col items-stretch gap-[16px]" aria-label="Ingredient calculator" aria-busy={!rows && !loadError || pending}>
        <Heading level={2} variant={1} content="Calculate ingredients" />
        <p className="text-body">Make the recipe fit your amount.</p>
        {!rows && !loadError && <p role="status" className="text-body">Loading ingredients…</p>}
        {(loadError || dataError) && <p role="alert" className="text-body">{loadError || dataError}</p>}
        <Input variant="calculator" className="w-full [&_input]:text-[28px]"
          name="fruitAmount" unit={inputUnit} value={value} min={0} step="any" disabled={pending}
          onChange={changeAmount}
          error={validData && !valid ? "Enter a fruit amount greater than zero." : undefined} />
        <Heading level={3} variant={2} content={validData ? "For your amount" : "Recipe amounts"} />
        <dl className="m-0 flex w-full flex-col gap-[16px]" aria-live="polite" aria-atomic="true">
          {(rows ?? []).map((row, index) => {
            const id = row.ingredient_id ?? row.ingredients?.id;
            const result = calculated[index] ?? (input === null ? row : null);
            const hasAmount = result && result.amount !== null && result.amount !== "" && Number.isFinite(Number(result.amount));
            return <div key={id} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-[16px] border-b border-rose-fantasy py-[12px] text-body">
              <dt className="min-w-0 break-words">{row.ingredients?.name}</dt>
              <dd className="m-0 text-right font-semibold whitespace-nowrap">{toTaste(row) ? row.unit : hasAmount ? `${format(Number(result.amount))} ${row.unit}` : "—"}</dd>
            </div>;
          })}
        </dl>
        {note && <p className="text-[11px] leading-[1.4]">{note}</p>}
        {applyError && <p role="alert" className="text-body">{applyError}</p>}
        <Button type="submit" content={pending ? "Applying…" : "Use this amount"}
          className="w-full"
          disabled={!valid || pending || typeof onApply !== "function"} />
      </form>
    </Card>
  );
}
