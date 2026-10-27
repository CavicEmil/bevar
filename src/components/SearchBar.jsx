import { useId, useState } from "react";
import Input from "./ui/Input";

export default function SearchBar({
  value,
  onChange,
  suggestions = [],
  onSelect,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const expanded = open && suggestions.length > 0;

  function choose(item) {
    setOpen(false);
    setActive(-1);
    onSelect(item);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }

    if (
      ["ArrowDown", "ArrowUp"].includes(event.key) &&
      suggestions.length
    ) {
      event.preventDefault();
      setOpen(true);

      setActive((current) => {
        if (current === -1) {
          return event.key === "ArrowDown"
            ? 0
            : suggestions.length - 1;
        }

        const direction = event.key === "ArrowDown" ? 1 : -1;

        return (
          (current + direction + suggestions.length) %
          suggestions.length
        );
      });
    }

    if (
      event.key === "Enter" &&
      expanded &&
      suggestions[active]
    ) {
      event.preventDefault();
      choose(suggestions[active]);
    }
  }

  return (
    <div
      className="relative min-w-0 flex-1 bg-transparent"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <div className="relative">
        {/* Decorative search icon inside the input. */}
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="
            pointer-events-none absolute left-[14px] top-[25px]
            z-10 -translate-y-1/2 text-dark-humor/50
          "
        >
          <circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M15.5 15.5L21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <Input
          variant="search"
          value={value}
          placeholder="Search fruit or recipe"
          autoComplete="off"
          className="[&_input]:min-h-[50px] [&_input]:pl-[42px]"
          role="combobox"
          aria-label="Search recipes"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={expanded ? id : undefined}
          aria-activedescendant={
            expanded && suggestions[active]
              ? `${id}-${active}`
              : undefined
          }
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
        />
      </div>

      {expanded && (
        <ul
          id={id}
          role="listbox"
          aria-label="Search suggestions"
          className="
            absolute inset-x-0 top-full z-20 mt-related
            overflow-hidden rounded-card bg-white shadow-lg
          "
        >
          {suggestions.map((item, index) => (
            <li
              key={`${item.type}-${item.id}`}
              id={`${id}-${index}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? "bg-poplar-pink" : ""}
            >
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(item)}
                className="
                  flex w-full cursor-pointer items-center
                  justify-between gap-related p-3
                  text-left hover:bg-poplar-pink
                "
              >
                <span>{item.label}</span>

                <span className="text-small text-spicy-berry">
                  {item.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}