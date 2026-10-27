import Card from "./ui/Card";
import Heading from "./ui/Heading";
import Media from "./ui/Media";

const variants = {
  methods: {
    title: "Methods",
    description: "Understand How and Why",
    iconPath:
      "M12 2v20M3.34 7l17.32 10M3.34 17L20.66 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M17 19l-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1",
  },

  storage: {
    title: "Storage",
    description: "Keep fruit fresh for longer",
    iconPath:
      "M3 3h18v4H3zM5 7v14h14V7M9 11h6",
  },

  hygiene: {
    title: "Hygiene & Safety",
    description: "Clean prep and safe habits",
    iconPath:
      "M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4zM8 12l3 3 5-6",
  },

  equipment: {
    title: "Equipment",
    description: "Choose the tools you need",
    iconPath:
      "M5 10h14v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8zM3 10h18M2 13h3M19 13h3M8 3v3M12 2v4M16 3v3",
  },

  seasonal: {
    title: "Seasonal note",
    description: "Discover fruit in season",
    iconPath:
      "M20 3C10 3 4 7 4 13a7 7 0 0 0 1 4c10 2 15-4 15-14zM3 21L15 9",
  },
};

export default function ArticleCategory({
  variant = "methods",
  imageSrc,
  imageAlt = "",
  buttonLabel = "Learn More",
  onClick,
  className = "",
}) {
  const category = variants[variant] ?? variants.methods;

  return (
    <Card
      variant="default"
      size="sm"
      className={`
        flex w-full items-center gap-[12px]
        !p-[12px]
        font-the-one text-dark-humor
        ${className}
      `}
    >
      {/* Image or placeholder */}
      <div className="w-[34%] min-w-0 shrink-0">
        {imageSrc ? (
          <Media
            src={imageSrc}
            alt={imageAlt}
            ratio="3 / 2"
            fit="cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="
              flex aspect-[3/2] items-center justify-center
              rounded-[12px] bg-rose-fantasy
              p-2 text-center text-small text-dark-humor/60
            "
          >
            Image placeholder
          </div>
        )}
      </div>

      {/* Category content */}
      <div className="flex min-w-0 flex-1 flex-col gap-objects">
        <div className="flex items-start gap-[8px]">
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-[3px] shrink-0"
          >
            <path d={category.iconPath} />
          </svg>

          <Heading
            level={2}
            variant={2}
            content={category.title}
            className="min-w-0 text-dark-humor"
          />
        </div>

        <p className="text-body text-dark-humor">
          {category.description}
        </p>

        {/* Pink text button */}
        <button
          type="button"
          onClick={onClick}
          className="
            inline-flex min-h-[44px] items-center
            justify-start gap-[10px] self-start
            cursor-pointer border-0 bg-transparent p-0
            font-the-one text-[16px] leading-[1.4]
            font-normal text-spicy-berry
            hover:underline hover:underline-offset-4
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-spicy-berry
          "
        >
          <span>{buttonLabel}</span>

          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h16M14 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </Card>
  );
}