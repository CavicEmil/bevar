import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../api/client";
import ProgressBar from "./ProgressBar";
import Heading from "./ui/Heading";
import Tip from "./ui/Tip";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Eyebrow from "./ui/Eyebrow";

// Remount when the recipe changes so its guide always starts at step one.
export default function StepGuide({ recipeId, mediaBucket = "guides-images", recipeImageBucket = "recipe-images", storageIcons = {}, onFinish }) {
  if (!recipeId) return null;
  return <RecipeGuide key={recipeId} recipeId={recipeId} mediaBucket={mediaBucket} recipeImageBucket={recipeImageBucket} storageIcons={storageIcons} onFinish={onFinish} />;
}

function RecipeGuide({ recipeId, mediaBucket, recipeImageBucket, storageIcons, onFinish }) {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [recipe, setRecipe] = useState(null);
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
          .select("id, title, hero_image_path")
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

  if (loading) return <p role="status">Loading guide…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!steps.length) return <p role="status">No steps available for this recipe.</p>;

  function imageUrl(path, bucket) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    if (!bucket || bucket === "NAZWA_BUCKETU") return null;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  if (complete) {
    const heroUrl = imageUrl(recipe?.hero_image_path, recipeImageBucket);
    return (
      <section className="flex min-h-0 w-full flex-1 flex-col gap-[12px] font-the-one text-dark-humor">
        <div className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto overscroll-contain">
        <ProgressBar steps={steps} isComplete />
        <Heading content="Little effort, a lot to enjoy." />
        <p className="text-body">You made something good. Keep it for another day.</p>
        <Card variant="profileA" className="flex flex-col gap-section rounded-card p-card-lg shadow-md">
          <Eyebrow content="GUIDE COMPLETE ✓" />
          {recipe && <Heading content={recipe.title} level={2} variant={2} className="text-center" />}
          {heroUrl && <img src={heroUrl} alt={recipe.title} className="max-h-[180px] w-full object-contain" />}
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

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const path = step.media_path;
  const mediaUrl = imageUrl(path, mediaBucket);

  return (
    <section className="flex min-h-0 w-full flex-1 flex-col gap-[12px] font-the-one text-dark-humor">
      <ProgressBar steps={steps} currentStepId={step.id} className="shrink-0 gap-[10px]!" />

      <div key={step.id} className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto overscroll-contain">
        <div className="shrink-0">
        <Heading content={step.title} />
        </div>

        {mediaUrl && step.media_type === "image" && (
          <div className="min-h-0 max-h-[320px] flex-1 basis-[240px]">
            <img src={mediaUrl} alt={step.title || ""} className="h-full w-full object-contain" />
          </div>
        )}
        {mediaUrl && step.media_type === "video" && (
          <div className="min-h-0 max-h-[320px] flex-1 basis-[240px]">
            <video src={mediaUrl} controls playsInline className="h-full w-full object-contain" />
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
