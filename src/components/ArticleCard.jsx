import { Link, useNavigate } from "react-router";
import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Button from "./ui/Button";
import Tag from "./ui/Tag";
import Media from "./ui/Media";
import { getPublicUrl } from "../api/media";

export default function ArticleCard({
  article,
  variant = "tile",
  isSaved = false,
  onToggleSave,
}) {
  const navigate = useNavigate();
  const isHero = variant === "hero";
  const detailUrl = `/articles/${article.slug}`;   // slug, as we decided

  return (
    <Card
      variant="default"
      size={isHero ? "lg" : "sm"}
      className={`group relative flex flex-col gap-card-sm pt-4 px-4 ${
        isHero ? "" : "transition-shadow hover:shadow-md"
      }`}
    >
      <Media
        type="image"
        src={getPublicUrl("article-images", article.hero_image_path)}
        alt={article.title}
        ratio={isHero ? "16/9" : "3/2"}
        priority={isHero}
        className="p-card-sm"
      />

      <Heading
        variant={isHero ? 1 : 2}
        content={article.title}
        className="pl-card-sm text-dark-humor"
      />

      {isHero && article.excerpt && (
        <p className="pl-card-sm text-body text-dark-humor">
          {article.excerpt}
        </p>
      )}

      {/* only one separator, and it never wraps alone — the same bundling trick */}
      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[5px] m-card-sm">
        <Tag label={article.article_category} />
        <span className="inline-flex items-center gap-[10px] text-dark-humor">
          <span aria-hidden="true">·</span>
          <Tag label={`${article.read_time} min read`} />
        </span>
      </div>

      {/* hero: primary button; tile: Tag-styled link — same slot, different affordance */}
      {isHero ? (
        <Button
          content="Read the article ->"
          variant="primary"
          onClick={() => navigate(detailUrl)}
          className="self-center w-90 m-card-sm"
        />
      ) : (
        <Link
          to={detailUrl}
          className="pl-card-sm w-fit text-spicy-berry pb-4"
        >
          Read Article -&gt;
        </Link>
      )}

      <Button
        variant="primary"
        icon="saved"
        pressed={isSaved}
        ariaLabel={
          isSaved
            ? `Remove ${article.title} from saved`
            : `Save ${article.title}`
        }
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleSave?.(recipe.id);
        }}
        className="!min-h-0 !p-[8px] absolute right-[16px] top-[16px] self-end text-dark-humor hover:text-spicy-berry"
      />

    </Card>
  );
}