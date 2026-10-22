const CATEGORY_IMAGE_BUCKET = "category-images";

/* Build a public Storage URL, or use an existing full URL */
function getImageUrl(path, bucket) {
  if (!path) return undefined;

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const projectUrl =
    import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "");

  if (!projectUrl) return undefined;

  return `${projectUrl}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`;
}

export default function Badge({
  type,
  item,
  selected = false,
  onClick,
}) {
  let label;
  let image;

  /* Read the label and image from the supplied database item */
  if (type === "fruit") {
    label = item.name;
    image = getImageUrl(item.image_path, "fruit-images");
  } else if (type === "category") {
    label = item.category;
    image = getImageUrl(
      item.category_image_path,
      CATEGORY_IMAGE_BUCKET
    );
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
      {/* Show the image when a path is available */}
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

  /* Interactive badges use a button */
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

  /* Informational badges use a span */
  return <span className={className}>{content}</span>;
}