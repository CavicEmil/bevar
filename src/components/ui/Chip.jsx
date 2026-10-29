import { useId } from "react";

/* Resolve category icons from their Storage paths */
function getCategoryIcon(path) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  const projectUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "");
  if (!projectUrl) return undefined;

  return `${projectUrl}/storage/v1/object/public/category-images/${path.replace(/^\/+/, "")}`;
}

/* Selection indicator from the prototype */
function SelectionIndicator({ selected, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`
        flex size-[20px] shrink-0 items-center justify-center rounded-full border
        ${selected ? "border-spicy-berry bg-spicy-berry" : "border-dark-humor bg-transparent"}
        ${className}
      `}
    >
      {selected && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path
            d="M0.850006 3.84998L3.85001 6.84998L9.65001 0.849976"
            stroke="white"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

/* Default icon for time options */
function ClockIcon() {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 5.5V12H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Chip({
  variant = "fruit",
  children,
  defaultOpen = false,
  item,
  label,
  description,
  imageSrc,
  iconSrc,
  selected = false,
  onChange,
  type = "checkbox",
  name,
  value,
  id,
  disabled = false,
  className = "",
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isFruit = variant === "fruit";
  const isTime = variant === "time";
  const isCategory = variant === "category" || variant === "method";

  // Recipe sections use native details for open/close state and keyboard access.
  if (variant === "recipe") {
    return (
      <details open={defaultOpen || undefined} className={`group border-b border-rose-fantasy font-the-one text-dark-humor ${className}`}>
        <summary className="flex min-h-[50px] cursor-pointer list-none items-center justify-between gap-related py-1 text-body font-medium focus-visible:outline-2 focus-visible:outline-spicy-berry [&::-webkit-details-marker]:hidden">
          {label}
          <span aria-hidden="true" className="mr-1 size-[7px] shrink-0 rotate-45 border-r border-b border-current transition-transform group-open:rotate-225" />
        </summary>
        <div className="pb-card-lg text-body">{children}</div>
      </details>
    );
  }

  /* Read the category and its joined methods from the API result */
  const displayLabel = label ?? (isCategory ? item?.category : undefined);
  const displayDescription = description ?? (
    isCategory
      ? (item?.method ?? []).map((entry) => entry.method).filter(Boolean).join(", ")
      : undefined
  );
  const displayIcon = iconSrc ?? (
    isCategory ? getCategoryIcon(item?.category_image_path) : undefined
  );

  const selectionClasses = selected ? "bg-poplar-pink shadow-md" : "bg-white";
  const focusClasses = `
    peer-focus-visible:outline-2
    peer-focus-visible:outline-offset-2
    peer-focus-visible:outline-spicy-berry
  `;

  return (
    <label
      htmlFor={inputId}
      className={`
        relative block min-w-0 font-the-one text-dark-humor
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Native inputs support keyboard and form interaction */}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value ?? item?.id}
        checked={selected}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />

      {isFruit ? (
        /* Fruit option */
        <span className={`flex flex-col items-center gap-[6px] rounded-[14px] ${focusClasses}`}>
          <span
            className={`
              relative flex size-[56px] items-center justify-center rounded-[14px] transition-colors
              ${selected ? "bg-poplar-pink" : "bg-rose-fantasy"}
            `}
          >
            {imageSrc && (
              <img src={imageSrc} alt="" className="size-[44px] object-contain" />
            )}

            {selected && (
              <SelectionIndicator selected className="absolute -right-1 -top-1" />
            )}
          </span>

          <span className="text-small text-center">{displayLabel}</span>
        </span>
      ) : isTime ? (
        /* Time option */
        <span
          className={`
            flex min-h-[86px] w-full items-center gap-[16px] rounded-[14px] p-[16px]
            transition-colors ${selectionClasses} ${focusClasses}
          `}
        >
          <span className="shrink-0">
            <ClockIcon />
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-body font-medium">{displayLabel}</span>
            {displayDescription && (
              <span className="text-body">{displayDescription}</span>
            )}
          </span>

          <SelectionIndicator selected={selected} />
        </span>
      ) : (
        /* Category option with its related methods */
        <span
          className={`
            flex h-full min-h-[120px] w-full flex-col gap-[10px] rounded-[14px] p-[14px]
            transition-colors ${selectionClasses} ${focusClasses}
          `}
        >
          <span className="flex items-center justify-between gap-[10px]">
            <span className="flex size-[24px] items-center justify-center">
              {displayIcon && (
                <span
                  aria-hidden="true"
                  className="block size-[24px] bg-spicy-berry"
                  style={{
                    maskImage: `url("${displayIcon}")`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
              )}
            </span>

            <SelectionIndicator selected={selected} />
          </span>

          <span className="flex flex-col gap-1">
            <span className="text-body font-semibold">{displayLabel}</span>
            {displayDescription && (
              <span className="text-body font-normal">{displayDescription}</span>
            )}
          </span>
        </span>
      )}
    </label>
  );
}
