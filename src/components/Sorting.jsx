import { useState } from "react";
import Heading from "../ui/Heading";

export const SORT_OPTIONS = [
  { key: "recommended", label: "RECOMMENDED", hint: "newest to oldest" },
  { key: "prep-time",  label: "PREP TIME",    hint: "shortest to longest" },
  { key: "a-z",        label: "A-Z",          hint: "alphabetical" },
];

export default function Sorting({ value = "recommended", onChange }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.key === value) ?? SORT_OPTIONS[0];

  return (
    <div className="flex flex-col gap-[5px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="sorting-options"
        className="flex w-fit cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
      >
        <Heading variant={3}>SORT: {current.label}</Heading>
        <span
          aria-hidden="true"
          className={`text-rhodophobia transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      <div
        id="sorting-options"
        /* grid-rows trick: smooth height animation without JS measuring */
        className={`grid transition-[grid-template-rows] duration-200
                    ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <ul role="listbox" aria-label="Sort recipes" className="flex flex-col gap-[5px] py-[5px]">
            {SORT_OPTIONS.map((option) => (
              <li key={option.key} role="option" aria-selected={option.key === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(option.key);
                    setOpen(false);
                  }}
                  className={`cursor-pointer border-0 bg-transparent p-0 text-left
                              focus-visible:outline-2 focus-visible:outline-offset-2
                              focus-visible:outline-spicy-berry
                              ${option.key === value ? "text-spicy-berry" : "text-rhodophobia"}`}
                >
                  <Heading variant={3}>
                    {option.label}
                    <span className="font-the-one font-normal text-rhodophobia">
                      {" "}({option.hint})
                    </span>
                  </Heading>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}