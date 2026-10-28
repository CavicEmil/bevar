import { useLayoutEffect, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { BUCKETS, getPublicUrl } from "../api/media";
import Card from "../components/ui/Card";
import Chip from "../components/ui/Chip";
import Heading from "../components/ui/Heading";
import Media from "../components/ui/Media";
import Tag from "../components/ui/Tag";
import Button from "../components/ui/Button";
import IngredientCalculatorButton from "../components/ui/IngredientCalculatorButton";
import StepGuide from "../components/StepGuide";
import useSavedRecipes from "../hooks/useSavedRecipes";

const formatAmount = amount => new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 4 }).format(Number(amount));
const ingredientAmount = row => row.unit?.trim().toLowerCase() === "to taste"
  ? row.unit : `${formatAmount(row.amount)} ${row.unit}`;

export default function Recipe() {
  const recipe = useLoaderData();
  return <RecipeContent key={recipe.id} recipe={recipe} />;
}

export function RecipeContent({ recipe }) {
  const saved = useSavedRecipes();
  const isSaved = saved.isSaved(recipe.id);
  const isSaving = saved.isLoading || saved.pendingIds.has(recipe.id);
  const saveError = saved.error;
  const onToggleSave = () => saved.toggle(recipe);
  const [calculated, setCalculated] = useState(null);
  const [guideTop, setGuideTop] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const isGuide = searchParams.get("guide") === "1";

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (!isGuide) return;

    const header = document.querySelector("header");
    const measureHeader = () => {
      setGuideTop(Math.max(0, header?.getBoundingClientRect().bottom ?? 0));
    };
    measureHeader();

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const observer = new ResizeObserver(measureHeader);
    if (header) observer.observe(header);
    window.addEventListener("resize", measureHeader);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureHeader);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [recipe.id, isGuide]);

  function setIsGuide(open) {
    const next = new URLSearchParams(searchParams);
    if (open) next.set("guide", "1");
    else next.delete("guide");
    setSearchParams(next, { replace: true });
  }
  const ingredients = calculated?.ingredients ?? recipe.recipe_ingredients ?? recipe.recipeingredients ?? [];
  const equipment = recipe.recipe_equipment ?? [];
  const steps = [...(recipe.step_by_step_guide ?? [])].sort((a, b) => a.step_number - b.step_number);
  const imageUrl = (bucket, path) => !path ? undefined
    : /^https?:\/\//i.test(path) ? path : getPublicUrl(bucket, path);
  const icon = path => imageUrl(BUCKETS.categoryImages, path);

  if (isGuide) {
    return (
      <div
        className="fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom,0px))] z-40 flex justify-center overflow-hidden"
        style={{ top: guideTop }}
      >
       <Card
  variant="fruit"
  className="flex h-full min-h-0 w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] rounded-b-none px-[24px] py-[16px] font-the-one text-dark-humor"
>
  <StepGuide recipeId={recipe.id} />
</Card>
      </div>
    );
  }

  return (
    <Card className="recipe-card-destination mx-auto flex w-full max-w-lg flex-col gap-section rounded-t-[28px] rounded-b-none bg-white px-[24px] pt-page pb-[calc(100px+env(safe-area-inset-bottom,0px))] font-the-one text-dark-humor">
          <Card variant="fruit" className="rounded-card p-card-lg">
            <Media src={imageUrl(BUCKETS.recipeImages, recipe.hero_image_path)} alt={recipe.title}
              ratio="313 / 140" fit="contain" priority className="rounded-none" />
          </Card>

          <div className="flex flex-col gap-objects">
            <div className="flex items-center justify-between gap-related">
              <Heading content={recipe.title} className="min-w-0 flex-1" />
              <Button
                variant="primary"
                icon="saved"
                pressed={isSaved}
                disabled={isSaving}
                ariaLabel={
                  isSaved
                    ? `Remove ${recipe.title} from saved`
                    : `Save ${recipe.title}`
                }
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleSave(recipe.id);
                }}
                className="min-h-[40px]! min-w-[40px] shrink-0 p-[8px]!"
              />
            </div>
            {saveError && (
              <p role="alert" className="text-small text-spicy-berry">
                {saveError}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[8px]" aria-label="Recipe details">
              {[
                recipe.prep_time_minutes != null && {
                  key: "time",
                  label: `${recipe.prep_time_minutes} min total`,
                },
                recipe.difficulty && {
                  key: "difficulty",
                  label: recipe.difficulty.difficulty,
                  icon: icon(recipe.difficulty.difficulty_image_path),
                },
                recipe.category && {
                  key: "category",
                  label: recipe.category.category,
                  icon: icon(recipe.category.category_image_path),
                },
              ].filter(Boolean).map((tag, index) => (
                <span key={tag.key} className="inline-flex items-center gap-[12px]">
                  {index > 0 && <span aria-hidden="true" className="text-[14px] leading-none text-rhodophobia/50">·</span>}
                  <Tag icon={tag.icon} label={tag.label} />
                </span>
              ))}
            </div>
          </div>

          {recipe.description && <p className="text-body whitespace-pre-line">{recipe.description}</p>}

          <div className="border-t border-rose-fantasy">
            <Chip variant="recipe" label="Ingredients">
              {ingredients.length ? (
                <dl className="flex flex-col gap-related" aria-live="polite">
                  {ingredients.map(row => (
                    <div key={row.ingredient_id ?? row.ingredients?.id} className="flex items-start justify-between gap-related">
                      <dt>{row.ingredients?.name}</dt>
                      <dd className="shrink-0 font-semibold">{ingredientAmount(row)}</dd>
                    </div>
                  ))}
                </dl>
              ) : <p>Ingredients have not been added to this recipe yet.</p>}
            </Chip>
            <Chip variant="recipe" label="Equipment">
              {equipment.length ? <ul className="list-inside list-disc space-y-objects">
                {equipment.map(row => <li key={row.equipment_id ?? row.equipment?.id}>{row.equipment?.name}</li>)}
              </ul> : <p>Equipment has not been added to this recipe yet.</p>}
            </Chip>
            <Chip variant="recipe" label="Storage">
              <p className="whitespace-pre-line">{recipe.storage || "Storage information has not been added to this recipe yet."}</p>
            </Chip>
          </div>

          {ingredients.length > 0 && <IngredientCalculatorButton recipe={recipe} onApply={setCalculated} initialAmount={calculated?.fruitAmount} />}

          <section aria-label="Recipe steps" className="flex flex-col gap-[8px]">
            <Heading level={2} variant={2} content="Recipe steps" />
            {steps.length ? <>
              <p className="text-body">Follow the steps here, or use the guided version.</p>
              <ol className="flex flex-col gap-[8px]">
                {steps.map(step => <li key={step.id} className="flex items-start gap-[12px] py-card-lg">
                  <span aria-hidden="true" className="w-[26px] shrink-0 text-small text-spicy-berry">{String(step.step_number).padStart(2, "0")}</span>
                  <div className="flex min-w-0 flex-col gap-[6px]">
                    {step.title && <Heading level={3} variant={3} content={step.title} />}
                    <p className="text-body whitespace-pre-line">{step.instruction}</p>
                  </div>
                </li>)}
              </ol>
            </> : <p className="text-body">Steps have not been added to this recipe yet.</p>}
          </section>

          {steps.length > 0 && <div className="sticky bottom-[calc(76px+env(safe-area-inset-bottom,0px))] -mx-[24px] bg-white px-[24px] py-card-lg">
            <Button content="Start recipe guide" className="w-full" onClick={() => { setIsGuide(true); window.scrollTo(0, 0); }} />
          </div>}
    </Card>
  );
}

