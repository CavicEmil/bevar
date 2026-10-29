import { ArticleCategoryIcon } from "../ArticleCategory";

const CATEGORY_IMAGE_BUCKET = "category-images";

/* Build a public Storage URL or use an existing full URL */
function getImageUrl(path, bucket) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  const projectUrl =
    import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "");

  if (!projectUrl) return undefined;

  const cleanPath = path.replace(/^\/+/, "");

  return `${projectUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

export default function Badge({
  type,
  item,
  selected = false,
  onClick,
  onRemove,
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
  `;

  const content = (
    <>
      {image ? (
        <img
          src={image}
          alt=""
          width={14}
          height={14}
          className="block size-[14px] shrink-0 object-contain"
        />
      ) : type === "category" ? (
        <ArticleCategoryIcon topic={label} size={14} />
      ) : null}

      <span>{label}</span>
    </>
  );

  /* Applied filters have a separate remove button */
  if (onRemove) {
    return (
      <span className="relative inline-flex">
        <span className={className}>{content}</span>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label} filter`}
          className="
            absolute -right-2 -top-2
            flex size-7 cursor-pointer items-center justify-center
            rounded-full border-0 bg-spicy-berry text-white
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-dark-humor
          "
        >
          <svg
            aria-hidden="true"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M2 2L8 8M8 2L2 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </span>
    );
  }

  /* Filter options use selectable buttons */
  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={`
          ${className}
          cursor-pointer
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-dark-humor
        `}
      >
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
}
