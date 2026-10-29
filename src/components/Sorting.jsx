import { useId, useState } from "react";

export const SORT_OPTIONS = [
  { key: "recommended", label: "RECOMMENDED", hint: "newest to oldest" },
  { key: "prep-time", label: "PREP TIME", hint: "shortest to longest" },
  { key: "a-z", label: "A-Z", hint: "alphabetical" },
];

export default function Sorting({
  value = "recommended",
  onChange,
  options = SORT_OPTIONS,
  ariaLabel = "Sort recipes",
}) {
  const sortingId = useId();
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.key === value) ?? options[0];

  return (
    <div
      className="flex flex-col items-end"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          event.currentTarget.querySelector("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={sortingId}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="flex w-fit cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
      >
        <span className="text-end text-[12px] text-spicy-berry uppercase">
          SORT: {current?.label}
        </span>
        <span
          aria-hidden="true"
          className={`text-spicy-berry transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      <div
        id={sortingId}
        aria-hidden={!open}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <ul
            aria-label={ariaLabel}
            className="flex w-full flex-col items-end gap-[5px] py-[5px]"
          >
            {options.map((option) => (
              <li key={option.key} className="max-w-full text-right">
                <button
                  type="button"
                  aria-pressed={option.key === value}
                  onClick={() => {
                    onChange?.(option.key);
                    setOpen(false);
                  }}
                  className="cursor-pointer border-0 bg-transparent p-0 text-[12px] text-spicy-berry uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
