import { Link, useNavigate } from "react-router";
import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Button from "./ui/Button";
import Tag from "./ui/Tag";
import Media from "./ui/Media";
import { getPublicUrl } from "../api/media";

export default function RecipeCard({
  recipe,          // { id, title, hero_image_path, prep_time_minutes,
                   //   difficulty: {name}, category: {method_image_path, method?} }
  variant = "tile",        // "hero" | "tile"
  isSaved = false,
  onToggleSave,
}) {
  const isHero = variant === "hero";
  const navigate = useNavigate();
  const method = recipe.method ?? recipe.category?.method;
  const detailUrl = `/recipes/${recipe.id}`;

  return (
    <Card
      variant="default"
      size={isHero ? "lg" : "sm"}
      className={`group relative flex flex-col gap-[10px] ${
        isHero ? "" : "transition-shadow hover:shadow-md"
      }`}
    >
      {/* image — links in hero via the button only; tile links via the stretched link below */}
      <Media
        type="image"
        src={getPublicUrl("recipe-images", recipe.hero_image_path)}
        alt={recipe.title}
        ratio="16/9"
        priority={isHero}
        className="!rounded-card"
      />

      {/* stretched link: invisible, but covers the whole card for tile */}
      {!isHero && (
        <Link
          to={detailUrl}
          className="absolute inset-0 rounded-[--radius-card] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
          aria-label={recipe.title}
        />
      )}

      <Heading variant={isHero ? 1 : 2}>{recipe.title}</Heading>

      <div className="flex items-center gap-[10px]">
        <Tag label={`${recipe.prep_time_minutes} min`} />
        <Tag label={recipe.difficulty?.difficulty ?? recipe.difficulty?.name ?? "—"} />
        <Tag
          icon={recipe.category?.method_image_path}
          label={typeof method === "string" ? method : method?.method ?? recipe.category?.category}
        />
      </div>

      {isHero && (
        <Button
          content="View recipe"
          variant="primary"
          onClick={() => navigate(detailUrl)}
          className="mt-[5px] self-start"
        />
      )}

      {/* save button — top-right, works in both variants */}
      <Button
        variant="ghost"
        icon="saved"
        pressed={isSaved}
        ariaLabel={isSaved ? `Remove ${recipe.title} from saved` : `Save ${recipe.title}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleSave?.(recipe.id);
        }}
        className="!min-h-0 !p-[8px] absolute right-[16px] top-[16px] self-end text-rhodophobia hover:text-spicy-berry"
      />
    </Card>
  );
}
