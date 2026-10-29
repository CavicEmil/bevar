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
import "./cardTransitions.css";

export default function RecipeCard({
  recipe,
  variant = "tile",
  isSaved = false,
  onToggleSave,
  outlinedTags = true,
  recipeBasePath = "/recipes",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHero = variant === "hero";
  const detailUrl = `${recipeBasePath}/${recipe.id}`;
  const isTransitioning = useViewTransitionState(detailUrl);
  const navigationState = {
    recipeReturnTo: location.pathname + location.search,
  };

  return (
    <div
      className="navigation-card h-full"
      style={{
        viewTransitionName: isTransitioning ? "recipe-card" : "none",
      }}
    >
      <Card
        variant="default"
        size={isHero ? "lg" : "sm"}
        className={`group relative flex h-full flex-col gap-card-sm pt-4 px-4 ${
          isHero ? "" : "transition-shadow hover:shadow-md"
        }`}
      >
        <Media
          type="image"
          src={getPublicUrl("recipe-images", recipe.hero_image_path)}
          alt={recipe.title}
          ratio={isHero ? "16/9" : "3/2"}
          fit="contain"
          priority={isHero}
          className={isHero ? "p-card-sm" : "h-[96px] shrink-0 [&>img]:p-[8px]"}
        />

        {!isHero && (
          <Link
            to={detailUrl}
            state={navigationState}
            viewTransition
            className="absolute inset-0 rounded-card gap-card-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
            aria-label={recipe.title}
          />
        )}

        <Heading
          variant={isHero ? 1 : 2}
          content={recipe.title}
          className="pl-card-sm text-dark-humor"
        />

        <div className={`flex flex-wrap items-center gap-x-[10px] gap-y-[5px] m-card-sm ${outlinedTags ? `recipe-card-tags ${isHero ? "recipe-hero-tags" : ""}` : ""}`}>
          <Tag label={`${recipe.prep_time_minutes} min`} />

          <span className="inline-flex items-center gap-[10px] text-rhodophobia">
            <span aria-hidden="true">·</span>
            <Tag label={recipe.difficulty?.difficulty ?? "—"} />
          </span>

          <span className="inline-flex items-center gap-[10px] text-rhodophobia">
            {isHero && <span aria-hidden="true">·</span>}
            <Tag
              iconColor={outlinedTags ? "currentColor" : undefined}
              icon={getPublicUrl(
                "category-images",
                recipe.category?.category_image_path,
              )}
              label={recipe.category?.category}
            />
          </span>
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
            className="navigation-card-trigger self-center w-full m-card-sm"
          />
        )}

        <Button
          variant="primary"
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
          className={`card-save-button ${isHero ? "card-save-button--hero" : "card-save-button--tile"} absolute self-end text-rhodophobia hover:text-spicy-berry`}
        />
      </Card>
    </div>
  );
}
