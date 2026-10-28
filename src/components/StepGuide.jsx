import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../api/client";
import ProgressBar from "./ProgressBar";
import Heading from "./ui/Heading";
import Tip from "./ui/Tip";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Eyebrow from "./ui/Eyebrow";
import Spinner from "./ui/Spinner";
import Media from "./ui/Media";
import RecipeConfetti from "./ui/RecipeConfetti";
import IngredientCalculatorButton from "./ui/IngredientCalculatorButton";

const format = new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 4 });
const descriptors = new Set(["of", "the", "fresh", "ripe", "firm", "prepared", "crushed", "chopped", "sliced", "peeled", "granulated", "cold", "warm", "hot", "food", "grade"]);
const words = value => String(value ?? "").toLowerCase().normalize("NFD")
  .replace(/\p{M}/gu, "").match(/[\p{L}\p{N}]+/gu)
  ?.map(word => word.replace(/ies$/, "y").replace(/s$/, ""))
  .filter(word => !descriptors.has(word)) ?? [];
const startsWith = (source, prefix) => prefix.length > 0 && prefix.every((word, index) => source[index] === word);
const amount = "(?:\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d+(?:,\\d{3})*(?:\\.\\d+)?)";
const ingredientMeasure = new RegExp(`(?<![\\p{L}\\p{N}/])(${amount}(?:\\s*[–−-]\\s*${amount})?)\\s*(US\\s+cups?|cups?|tablespoons?|teaspoons?|tbsp|tsp|kilograms?|milligrams?|grams?|kg|mg|g|millilitres?|milliliters?|litres?|liters?|ml|l)\\b`, "giu");

function scaleGuideStep(step, recipe, calculation) {
  const factor = Number(calculation?.scaleFactor);
  if (calculation?.recipeId !== recipe?.id || !Number.isFinite(factor) || factor <= 0) return step;
  const fruit = words(recipe.fruits?.name);
  const aliases = (recipe.recipe_ingredients ?? recipe.recipeingredients ?? []).filter(row => row.unit?.trim().toLowerCase() !== "to taste").map(row => {
    const name = words(row.ingredients?.name ?? row.name);
    return fruit.length && (startsWith(name, fruit) || startsWith(fruit, name))
      ? [name, ["fruit"], ["puree"]]
      : [name];
  });

  function scaleText(text) {
    if (typeof text !== "string") return text;
    return text.replace(ingredientMeasure, (measure, quantity, unit, offset) => {
      const following = words(text.slice(offset + measure.length).split(/[.;:\n]|\d/)[0]);
      // Only ingredient quantities are scaled; times and temperatures keep their values.
      if (aliases.filter(names => names.some(name => startsWith(following, name))).length !== 1) return measure;
      const values = quantity.split(/\s*[–−-]\s*/).map(value => value.trim().split(/\s+/).reduce((total, part) => {
        const [a, b] = part.replaceAll(",", "").split("/").map(Number);
        return total + (b === undefined ? a : a / b);
      }, 0) * factor);
      return values.every(Number.isFinite) ? `${values.map(value => format.format(value)).join("–")} ${unit}` : measure;
    });
  }

  return { ...step, title: scaleText(step.title), instruction: scaleText(step.instruction), tip: scaleText(step.tip),
    storage_items: Array.isArray(step.storage_items) ? step.storage_items.map(item => ({ ...item, title: scaleText(item.title), text: scaleText(item.text) })) : step.storage_items };
}

// Remount when the recipe changes so its guide always starts at step one.
export default function StepGuide({ recipeId, recipe: sourceRecipe, calculated, onApply, mediaBucket = "guides-images", recipeImageBucket = "recipe-images", storageIcons = {}, onFinish }) {
  if (!recipeId) return null;
  return <RecipeGuide key={recipeId} recipeId={recipeId} sourceRecipe={sourceRecipe} calculated={calculated} onApply={onApply} mediaBucket={mediaBucket} recipeImageBucket={recipeImageBucket} storageIcons={storageIcons} onFinish={onFinish} />;
}

function RecipeGuide({ recipeId, sourceRecipe, calculated, onApply, mediaBucket, recipeImageBucket, storageIcons, onFinish }) {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [localCalculation, setLocalCalculation] = useState(null);
  const [recipeError, setRecipeError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSteps() {
      try {
        const { data, error: queryError } = await supabase
          .from("step_by_step_guide")
          .select("id, step_number, title, media_path, media_type, instruction, tip, storage_items")
          .eq("recipe_id", recipeId)
          .order("step_number", { ascending: true });

        if (!active) return;
        if (queryError) throw queryError;
        setSteps(data ?? []);
        const { data: recipeData, error: detailError } = await supabase
          .from("recipes")
          .select("id, title, hero_image_path, fruit_id, fruits(name), recipe_ingredients(ingredient_id, amount, unit, ingredients(id, name))")
          .eq("id", recipeId)
          .single();
        if (!active) return;
        if (detailError) setRecipeError(detailError.message);
        else setRecipe(recipeData);
      } catch (loadError) {
        if (active) setError(loadError.message || "Could not load the guide.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSteps();
    return () => { active = false; };
  }, [recipeId]);

  const guideRecipe = sourceRecipe?.id === recipeId ? sourceRecipe : recipe;
  const calculation = (onApply ? calculated : localCalculation) ?? null;

  async function applyAmount(result) {
    if (onApply) await onApply(result);
    else setLocalCalculation(result);
  }

  if (loading) return <div className="flex flex-1 items-center justify-center"><Spinner label="Loading guide…" /></div>;
  if (error) return <p role="alert">{error}</p>;
  if (!steps.length) return <p role="status">No steps available for this recipe.</p>;

  function imageUrl(path, bucket) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    if (!bucket || bucket === "NAZWA_BUCKETU") return null;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  if (complete) {
    const heroUrl = imageUrl(guideRecipe?.hero_image_path, recipeImageBucket);
    return (
      <section className="flex min-h-0 w-full flex-1 flex-col gap-[12px] font-the-one text-dark-humor">
        <RecipeConfetti />
        <div className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto overscroll-contain">
        <ProgressBar steps={steps} isComplete />
        <Heading content="Little effort, a lot to enjoy." />
        <p className="text-body">You made something good. Keep it for another day.</p>
        <Card variant="profileA" className="flex flex-col gap-section rounded-card p-card-lg shadow-md">
          <Eyebrow content="GUIDE COMPLETE ✓" />
          {guideRecipe && <Heading content={guideRecipe.title} level={2} variant={2} className="text-center" />}
          {heroUrl && <Media src={heroUrl} alt={guideRecipe.title} ratio="313 / 140" fit="contain" priority className="max-h-[180px]" />}
          {recipeError && <p role="alert" className="text-body">{recipeError}</p>}
          <p className="border-t border-spicy-berry pt-card-lg text-body">Made by you. Ready when you are.</p>
        </Card>
        </div>
        <div className="grid shrink-0 gap-[8px]">
        <Button content="Explore more recipes →" onClick={() => navigate("/recipes")} />
        <Button content="Back to recipe" variant="secondary" onClick={() => navigate(`/recipes/${recipeId}`)} />
        </div>
      </section>
    );
  }

  const step = scaleGuideStep(steps[index], guideRecipe, calculation);
  const isLast = index === steps.length - 1;
  const path = step.media_path;
  const mediaUrl = imageUrl(path, mediaBucket);

  return (
    <section className="flex min-h-0 w-full flex-1 flex-col gap-[12px] font-the-one text-dark-humor">
      <ProgressBar steps={steps} currentStepId={step.id} className="shrink-0 gap-[10px]!" />

      <div key={step.id} className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto overscroll-contain">
        <div className="flex shrink-0 items-start justify-between gap-related">
          <Heading content={step.title} className="min-w-0 flex-1" />
          {index === 0 && guideRecipe && (
            <IngredientCalculatorButton
              recipe={guideRecipe}
              onApply={applyAmount}
              initialAmount={calculation?.fruitAmount}
              returnLabel="Back to guide"
              className="h-[44px] w-[44px]! shrink-0 justify-center! rounded-[12px]! p-[10px]! [&>span]:sr-only [&>img]:h-[24px]! [&>img]:w-[24px]!"
            />
          )}
        </div>

        {mediaUrl && step.media_type === "image" && (
          <div className="min-h-0 max-h-[320px] flex-1 basis-[240px]">
            <Media src={mediaUrl} alt={step.title || ""} ratio="auto" fit="contain" priority className="h-full" />
          </div>
        )}
        {mediaUrl && step.media_type === "video" && (
          <div className="min-h-0 max-h-[320px] flex-1 basis-[240px]">
            <Media type="video" src={mediaUrl} alt={step.title || ""} ratio="auto" fit="contain" preload="metadata" className="h-full" />
          </div>
        )}
        {path && !mediaUrl && (
          <p role="status" className="text-body">Set mediaBucket to display this step’s media.</p>
        )}

      <p className="shrink-0 text-body whitespace-pre-line">{step.instruction}</p>
      <div className="shrink-0 [&>div]:p-[12px] [&_li]:py-[8px]">
        {Array.isArray(step.storage_items) && step.storage_items.length > 0
          ? <Tip variant={2} step={step} iconSources={storageIcons} />
          : <Tip variant={1} step={step} /> }
      </div>
      </div>

      <div className={`grid w-full shrink-0 items-stretch gap-[12px] ${index > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
        {index > 0 && (
  <Button
    content="Back"
    variant="secondary"
    icon="back"
    className="h-[56px] w-full min-w-0 px-[12px]! py-[8px]! [&_span]:whitespace-normal"
    onClick={() => setIndex(index - 1)}
  />
)}
        <Button
          content={isLast ? "Finish guide ✓" : "Next step"}
          icon={isLast ? undefined : "next"}
          iconPosition="right"
          className="h-[56px] w-full min-w-0 px-[12px]! py-[8px]! [&_span]:whitespace-normal"
          onClick={() => {
            if (isLast) {
              setComplete(true);
              onFinish?.();
            } else setIndex(index + 1);
          }}
        />
      </div>
    </section>
  );
}
