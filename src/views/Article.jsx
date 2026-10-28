import { useEffect, useMemo } from "react";
import { Link, useLoaderData } from "react-router";
import DOMPurify from "dompurify";

import Button from "../components/ui/Button";
import useSavedArticles from "../hooks/useSavedArticles";
import Card from "../components/ui/Card";
import Media from "../components/ui/Media";
import ArticleCard from "../components/ArticleCard";
import { getPublicUrl } from "../api/media";

/* Read the existing HTML sections without duplicating their content. */
function prepareContent(content) {
  const document = new DOMParser().parseFromString(
    DOMPurify.sanitize(content ?? ""),
    "text/html"
  );

  const root =
    document.querySelector(".bevar-article-body") ??
    document.body;

  const reminder = root.querySelector("aside");
  const sources = root.querySelector("footer");

  const reminderHtml = reminder?.outerHTML ?? "";
  const sourcesHtml = sources?.outerHTML ?? "";

  reminder?.remove();
  sources?.remove();

  return {
    reminder: reminderHtml,
    body: root.innerHTML,
    sources: sourcesHtml,
  };
}

function HtmlContent({ html }) {
  if (!html) return null;

  return (
    <div
      className="min-w-0 break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function Article() {
  const { article, articles, recipes } = useLoaderData();
  const saved = useSavedArticles();

  const content = useMemo(
    () => prepareContent(article.content),
    [article.content]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.id]);

  /* Suggest a recipe for the article's linked fruit. */
  const relatedRecipe = article.fruit_id
    ? recipes.find(
        (recipe) => recipe.fruit_id === article.fruit_id
      )
    : null;

  const relatedArticles = articles
    .filter((item) => item.id !== article.id)
    .sort(
      (a, b) =>
        Number(b.article_category === article.article_category) -
        Number(a.article_category === article.article_category)
    )
    .slice(0, 2);

  return (
    <Card
      variant="default"
      className="
        flex min-w-0 flex-col gap-section
        !rounded-b-none !p-page
        font-the-one text-dark-humor
      "
    >
      <article className="flex min-w-0 flex-col gap-related">
        <div className="relative min-h-[50px]">
        {article.hero_image_path && (
          <Media
            type="image"
            src={getPublicUrl(
              "article-images",
              article.hero_image_path
            )}
            alt={article.title}
            ratio="16/9"
            priority
          />
        )}
          <Button
            icon="saved"
            pressed={saved.isSaved(article.id)}
            ariaLabel={saved.isSaved(article.id) ? "Remove article from my profile" : "Save article to my profile"}
            disabled={saved.isLoading || saved.pendingIds.has(article.id)}
            onClick={() => saved.toggle(article)}
            className="absolute right-3 top-3 !min-h-0 !p-[8px]"
          />
        </div>
        {saved.error && (
          <div className="flex flex-col items-start gap-related">
            <p role="alert" className="text-small text-spicy-berry">{saved.error}</p>
            <Button content="Try again" variant="secondary" onClick={saved.refresh} />
          </div>
        )}

        <p className="text-eyebrow uppercase text-spicy-berry">
          {article.article_category}
          {article.read_time != null &&
            ` · ${article.read_time} min read`}
        </p>

        <h1 className="text-[24px] leading-[1.4] font-semibold">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-body">{article.excerpt}</p>
        )}

        <HtmlContent html={content.reminder} />
        <HtmlContent html={content.body} />

        {!article.content?.trim() && (
          <p className="text-body">
            The full article is not available yet.
          </p>
        )}

        {relatedRecipe && (
          <section
            aria-labelledby="related-recipe"
            className="
              flex flex-col gap-related
              rounded-card bg-poplar-pink p-card-sm
            "
          >
            <h2
              id="related-recipe"
              className="text-[16px] font-semibold"
            >
              Related recipe
            </h2>

            <Link
              to={`/recipes/${relatedRecipe.id}`}
              state={{
                recipeReturnTo: `/articles/${article.slug}`,
              }}
              className="
                flex min-w-0 items-center gap-related
                rounded-card bg-white p-card-sm
              "
            >
              <div className="w-1/3 shrink-0">
                <Media
                  type="image"
                  src={getPublicUrl(
                    "recipe-images",
                    relatedRecipe.hero_image_path
                  )}
                  alt={relatedRecipe.title}
                  ratio="1/1"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-objects">
                <p className="text-small text-spicy-berry">
                  {[
                    relatedRecipe.prep_time_minutes != null
                      ? `${relatedRecipe.prep_time_minutes} min`
                      : null,
                    relatedRecipe.difficulty?.difficulty,
                    relatedRecipe.category?.category,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

                <h3 className="text-[16px] font-semibold">
                  {relatedRecipe.title}
                </h3>

                <span className="text-small text-spicy-berry">
                  View recipe →
                </span>
              </div>
            </Link>
          </section>
        )}

        <HtmlContent html={content.sources} />
      </article>

      {relatedArticles.length > 0 && (
        <section
          aria-labelledby="keep-learning"
          className="flex flex-col gap-related"
        >
          <h2
            id="keep-learning"
            className="text-[16px] font-semibold"
          >
            Keep learning
          </h2>

          <div className="rounded-card bg-poplar-pink p-card-sm">
            <div className="grid min-w-0 grid-cols-2 gap-related">
              {relatedArticles.map((item) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  variant="tile"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </Card>
  );
}