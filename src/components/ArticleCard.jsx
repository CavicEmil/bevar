// components/articles/ArticleCard.jsx
import { Link } from "react-router-dom";
import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Button from "./ui/Button";
import Tag from "./ui/Tag";
import { getPublicUrl, BUCKETS } from "../../api/media";

export default function ArticleCard({
  article,        // { id, slug, title, excerpt, hero_image_path,
                   //   article_category, read_time }
  variant = "tile",        // "hero" | "tile"
}) {
  const isHero = variant === "hero";
  const detailUrl = `/articles/${article.slug}`;   // slug, not id for SEO, readability, accessibilty

  return (
    <Card
      variant="default"
      size={isHero ? "lg" : "sm"}
      className={`relative flex flex-col gap-[10px] ${
        isHero ? "" : "transition-shadow hover:shadow-md"
      }`}
    >
      <img
        src={getPublicUrl(BUCKETS.recipeImages, article.hero_image_path)}
        alt={article.title}
        className="aspect-square w-full rounded-[--radius-card] object-cover"
      />

      {/* stretched link for tile — same pattern as RecipeCard */}
      {!isHero && (
        <Link
          to={detailUrl}
          className="absolute inset-0 rounded-[--radius-card] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
          aria-label={article.title}
        />
      )}

      <Heading variant={isHero ? 1 : 2}>{article.title}</Heading>

      {/* hero-only: excerpt between heading and button */}
      {isHero && article.excerpt && (
        <p className="text-body text-rhodophobia">{article.excerpt}</p>
      )}

      <div className="flex items-center gap-[10px]">
        <Tag label={article.article_category} />
        <Tag label={`${article.read_time} min read`} />
      </div>

      {isHero && (
        <Button
          content="Read article"
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