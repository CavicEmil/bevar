import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import useSavedRecipes from "../hooks/useSavedRecipes";
import RecipeCard from "../components/RecipeCard";
import { CollectionIcon } from "../components/CollectionCard";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import Button from "../components/ui/Button";

export default function MyRecipes() {
  const saved = useSavedRecipes();
  const navigate = useNavigate();
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <Card variant="fruit" className="mx-auto flex min-h-[calc(100dvh-80px-76px)] w-full max-w-lg flex-col gap-section rounded-t-[28px] rounded-b-none px-[20px]! pt-[24px]! pb-[calc(24px+env(safe-area-inset-bottom,0px))]! font-the-one text-dark-humor">
      <div className="flex flex-col gap-related">
        <div className="flex items-center gap-related">
          <CollectionIcon />
          <Heading content="My recipes" level={1} variant={2} />
        </div>
        <p className="text-body">Every recipe you liked &amp; saved.</p>
      </div>

      {saved.error && <div className="flex flex-col items-start gap-related"><p role="alert" className="text-body">{saved.error}</p><Button content="Try again" onClick={saved.refresh} /></div>}
      {saved.isLoading ? <p role="status" className="text-body">Loading your recipes…</p> : saved.recipes.length ? (
        <div className="grid grid-cols-2 gap-[16px] [&>div]:min-w-0 [&_h1]:text-heading-3" aria-busy={saved.pendingIds.size > 0}>
          {saved.recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} variant="tile" isSaved={saved.isSaved(recipe.id)} onToggleSave={() => saved.toggle(recipe)} />
          ))}
        </div>
      ) : !saved.error && (
        <div className="flex flex-col items-start gap-section rounded-card bg-white p-card-lg">
          <Heading content="Your collection starts here." level={2} variant={3} />
          <p className="text-body">Tap the bookmark on a recipe to save it here for another day.</p>
          <Button content="Explore recipes" onClick={() => navigate("/recipes")} />
        </div>
      )}
    </Card>
  );
}
