import { useNavigate } from "react-router";
import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Button from "./ui/Button";
import Media from "./ui/Media";
import { BUCKETS, getPublicUrl } from "../api/media";
import recipesIcon from "../assets/nav-recipes.svg";
import articlesIcon from "../assets/nav-learn.svg";

const variants = {
  recipes: {
    title: "My recipes",
    noun: "recipe",
    description: "All your recipes,\nin one happy place.",
    card: "profileB",
    to: "/profile/recipes",
  },
  articles: {
    title: "My articles",
    noun: "article",
    description: "Good reads.\nWorth coming back to.",
    card: "fruit",
    to: null,
  },
};

export function CollectionIcon({ variant = "recipes" }) {
  const source = variant === "articles" ? articlesIcon : recipesIcon;
  return (
    <span
      aria-hidden="true"
      className="inline-block size-[22px] shrink-0 bg-current"
      style={{
        maskImage: `url(${JSON.stringify(source)})`,
        WebkitMaskImage: `url(${JSON.stringify(source)})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

export default function CollectionCard({
  variant = "recipes",
  items = [],
  count = items.length,
  loading = false,
  disabled = false,
}) {
  const navigate = useNavigate();
  const selected = variants[variant] ?? variants.recipes;
  const previews = items.slice(0, 3);
  const unavailable = disabled || !selected.to;
  const bucket = variant === "articles" ? BUCKETS.articleImages : BUCKETS.recipeImages;

  return (
    <div className="relative pt-[20px]" aria-label={selected.title}>
      <Card
        variant={selected.card}
        className={`relative min-h-[138px] rounded-[15px] p-[15px]! pr-[132px]! ${
          variant === "articles" ? "border-2 border-dark-humor!" : ""
        }`}
      >
        <div className={`flex min-h-[108px] flex-col justify-between gap-related ${
          variant === "articles" ? "text-dark-humor" : "text-poplar-pink"
        }`}>
          <div className="flex flex-col gap-objects">
            <div className="flex items-center gap-related">
              <CollectionIcon variant={variant} />
              <Heading content={selected.title} level={2} variant={3} />
            </div>
            <p className="text-small">
              {loading ? "Loading collection…" : `${count} saved ${selected.noun}${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <p className="text-body whitespace-pre-line">{selected.description}</p>
        </div>
      </Card>

      <div aria-hidden="true" className="pointer-events-none absolute right-[16px] bottom-[10px] h-[112px] w-[112px]">
        {[2, 1, 0].map((index) => {
          const preview = previews[index] ?? previews[0];
          const path = preview?.hero_image_path;
          const src = path && (/^https?:\/\//i.test(path) ? path : getPublicUrl(bucket, path));
          return (
            <div
              key={index}
              className={`absolute inset-0 rounded-[28px] bg-white p-[7px] shadow-md ${
                index === 2 ? "translate-x-[8px] -translate-y-[16px] rotate-[20deg]" :
                index === 1 ? "translate-x-[3px] -translate-y-[8px] rotate-[9deg]" : ""
              }`}
            >
              {src ? (
                <Media src={src} alt="" ratio="1 / 1" fit={variant === "recipes" ? "contain" : "cover"} className="rounded-[20px] bg-white!" />
              ) : (
                <div className="flex h-full items-center justify-center text-poplar-pink">
                  <CollectionIcon variant={variant} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        icon="next"
        variant="primary"
        ariaLabel={unavailable ? `${selected.title} — coming soon` : `Open ${selected.title}`}
        disabled={unavailable}
        onClick={() => selected.to && navigate(selected.to)}
        className="absolute right-[10px] bottom-[9px] h-[35px] min-h-[35px]! w-[35px] rounded-[7px]! p-[8px]! shadow-md [&_svg]:size-[18px]"
      />
    </div>
  );
}
