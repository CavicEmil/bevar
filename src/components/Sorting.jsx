import { useState } from "react";
import Heading from "./ui/Heading";

export const SORT_OPTIONS = [
  { key: "recommended", label: "RECOMMENDED", hint: "newest to oldest" },
  { key: "prep-time",  label: "PREP TIME",    hint: "shortest to longest" },
  { key: "a-z",        label: "A-Z",          hint: "alphabetical" },
];

export default function Sorting({ value = "recommended", onChange }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.key === value) ?? SORT_OPTIONS[0];

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="sorting-options"
        className="flex w-fit cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
      >
        <div className="text-[12px] text-spicy-berry text-end">SORT: {current.label}</div>
        <span
          aria-hidden="true"
          className={`text-spicy-berry transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
          <ul role="listbox" aria-label="Sort recipes" className="flex flex-col w-full items-end gap-[5px] py-[5px]">
            {SORT_OPTIONS.map((option) => (
              <li key={option.key} role="option" aria-selected={option.key === value} className="max-w-full text-right">
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(option.key);
                    setOpen(false);
                  }}
                  className={`cursor-pointer border-0 bg-transparent p-0
                              focus-visible:outline-2 focus-visible:outline-offset-2
                              focus-visible:outline-spicy-berry
                              ${option.key === value ? "text-spicy-berry" : "text-spicy-berry"}`}
                >
                  <div className="text-[12px] text-spicy-berry">
                    {option.label}
                    {/* <span className="font-the-one font-normal text-end">
                      {" "}({option.hint})
                    </span> */}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}