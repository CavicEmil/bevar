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
    iconPath: "M3 3h18v4H3zM5 7v14h14V7M9 11h6",
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
    iconPath: "M20 3C10 3 4 7 4 13a7 7 0 0 0 1 4c10 2 15-4 15-14zM3 21L15 9",
  },
};

export default function ArticleCategory({
  variant = "methods",
  onClick,
  className = "",
}) {
  const category = variants[variant] ?? variants.methods;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-full min-h-[152px] w-full min-w-0
        flex-col items-start gap-related
        rounded-card border-0 bg-white p-card-lg
        text-left font-the-one text-dark-humor
        cursor-pointer
        transition-shadow hover:shadow-md
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-spicy-berry
        ${className}
      `}
    >
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-spicy-berry"
      >
        <path d={category.iconPath} />
      </svg>

      <span className="text-[14px] leading-[1.4] font-semibold">
        {category.title}
      </span>

      <span className="text-body font-normal">
        {category.description}
      </span>
    </button>
  );
}
