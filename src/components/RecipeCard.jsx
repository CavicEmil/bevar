import {
  Link,
  useLocation,
  useNavigate,
  useViewTransitionState,
} from "react-router";

import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Button from "./ui/Button";
import Tag from "./ui/Tag";
import Media from "./ui/Media";
import { getPublicUrl } from "../api/media";

export default function RecipeCard({
  recipe,
  variant = "tile",
  isSaved = false,
  onToggleSave,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHero = variant === "hero";
  const detailUrl = `/recipes/${recipe.id}`;
  const isTransitioning = useViewTransitionState(detailUrl);

  const navigationState = {
    recipeReturnTo: location.pathname + location.search,
  };

  return (
    <div
      className="h-full"
      style={{
        viewTransitionName: isTransitioning
          ? "recipe-card"
          : "none",
      }}
    >
      <Card
        variant="default"
        size={isHero ? "lg" : "sm"}
        className="relative flex h-full flex-col gap-[10px]"
      >
        <Media
          type="image"
          src={getPublicUrl(
            "recipe-images",
            recipe.hero_image_path
          )}
          alt={recipe.title}
          ratio="16/9"
          priority={isHero}
          className="!rounded-card"
        />

        {!isHero && (
          <Link
            to={detailUrl}
            state={navigationState}
            viewTransition
            className="
              absolute inset-0 rounded-[--radius-card]
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-spicy-berry
            "
            aria-label={recipe.title}
          />
        )}

        <Heading variant={isHero ? 1 : 2}>
          {recipe.title}
        </Heading>

        <div className="flex items-center gap-[10px]">
          <Tag label={`${recipe.prep_time_minutes} min`} />

          <Tag label={recipe.difficulty?.name ?? "—"} />

          <Tag
            icon={recipe.category?.method_image_path}
            label={
              recipe.category?.method?.method ??
              recipe.category?.category
            }
          />
        </div>

        {isHero && (
          <Button
            content="View recipe"
            variant="primary"
            onClick={() =>
              navigate(detailUrl, {
                viewTransition: true,
                state: navigationState,
              })
            }
            className="mt-[5px] self-start"
          />
        )}

        <Button
          variant="ghost"
          icon="saved"
          pressed={isSaved}
          ariaLabel={
            isSaved
              ? `Remove ${recipe.title} from saved`
              : `Save ${recipe.title}`
          }
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleSave?.(recipe.id);
          }}
          className="
            !min-h-0 !p-[8px]
            absolute right-[16px] top-[16px]
            self-end text-rhodophobia
          "
        />
      </Card>
    </div>
  );
}