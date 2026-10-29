import { Link } from "react-router";
import Card from "./ui/Card";
import Media from "./ui/Media";
import Tag from "./ui/Tag";
import { getPublicUrl } from "../api/media";

export default function RelatedRecipeCard({ recipe, returnTo }) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      state={{ recipeReturnTo: returnTo }}
      viewTransition
      className="group block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
    >
      <Card className="flex min-w-0 items-center gap-[16px] p-[16px]! transition-shadow group-hover:shadow-md">
        <Media
          src={getPublicUrl("recipe-images", recipe.hero_image_path)}
          alt={recipe.title}
          ratio="1/1"
          fit="contain"
          className="w-[88px]! shrink-0 rounded-[16px] bg-rose-fantasy [&>img]:p-[8px] sm:w-[112px]!"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
          <h3 className="text-[16px] font-semibold text-dark-humor">{recipe.title}</h3>
          <div className="flex flex-wrap gap-[6px] [&>span]:rounded-full [&>span]:border [&>span]:border-spicy-berry [&>span]:px-[8px] [&>span]:py-[4px] [&>span]:text-spicy-berry">
            {[
              recipe.prep_time_minutes != null ? `${recipe.prep_time_minutes} min` : null,
              recipe.difficulty?.difficulty,
              recipe.category?.category,
            ].filter(Boolean).map(label => (
              <Tag key={label} label={label} />
            ))}
          </div>
          <span className="text-small text-spicy-berry group-hover:underline">View recipe →</span>
        </div>
      </Card>
    </Link>
  );
}
