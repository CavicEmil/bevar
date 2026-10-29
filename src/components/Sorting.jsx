import { useId } from "react";

export const SORT_OPTIONS = [
  { key: "recommended", label: "Recommended", hint: "newest to oldest" },
  { key: "prep-time", label: "Prep time", hint: "shortest to longest" },
  { key: "a-z", label: "A–Z", hint: "alphabetical" },
];

export default function Sorting({
  value = "recommended",
  onChange,
  options = SORT_OPTIONS,
  ariaLabel = "Sort recipes",
}) {
  const sortingId = useId();

  return (
    <div className="flex items-center justify-end gap-related">
      <label htmlFor={sortingId} className="text-small text-spicy-berry">
        Sort:
      </label>
      <select
        id={sortingId}
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="cursor-pointer bg-transparent text-small text-spicy-berry focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
