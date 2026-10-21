const methodIcons = {
  Fermentation: "/icons/fermentation.svg",
  Freezing: "/icons/freezing.svg",
  Drying: "/icons/drying.svg",
  Bottling: "/icons/bottling.svg",
  Sugaring: "/icons/sugaring.svg",
  Jam: "/icons/jam.svg",
  Canning: "/icons/canning.svg",
};

export default function Tag({
  type,
  item,
  selected = false,
  onClick,
}) {
  let label;
  let image;

  /* Read the label and image for each tag type. */
  if (type === "fruit") {
    label = item.name;

    if (item.image_path) {
      const projectUrl =
        import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");

      image =
        `${projectUrl}/storage/v1/object/public/fruit-images/` +
        item.image_path;
    }
  } else if (type === "method") {
    label = item.category;
    image = methodIcons[item.category];
  } else if (type === "difficulty") {
    label = item.difficulty;
  } else if (type === "time") {
    label = item.label;
  }

  const className = `
    inline-flex items-center justify-center
    gap-objects p-button rounded-button--icons
    font-the-one text-small text-dark-humor
    whitespace-nowrap border-0
    transition-[background-color,box-shadow] duration-150
    ${
      selected
        ? "bg-poplar-pink shadow-[0_2px_6px_rgba(98,14,40,0.15)]"
        : "bg-white shadow-none"
    }
    ${
      onClick
        ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-humor"
        : ""
    }
  `;

  const content = (
    <>
      {image && (
        <img
          src={image}
          alt=""
          width={14}
          height={14}
          className="block h-[14px] w-[14px] shrink-0 object-contain"
        />
      )}

      <span>{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={className}
      >
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
}