import Badge from "./ui/Badge";
import { FILTER_GROUPS, TIMES } from "../constants/recipeFilters";

export default function ActiveFilters({ filters, options, onRemove, onClear, showEmpty = false }) {
  const badges = FILTER_GROUPS.flatMap((group) =>
    (options?.[group.source] ?? []).filter((item) => filters[group.field].includes(item.id))
      .map((item) => ({ ...group, item }))
  );
  const time = TIMES.find((item) => item.id === filters.preparationTime && item.id !== "all");
  const hasFilters = badges.length > 0 || Boolean(time);
  if (!hasFilters && !showEmpty) return null;

  return (
    <section aria-label="Active filters" className="flex flex-col gap-related">
      <div className="flex items-center justify-between gap-related">
        <h2 className="text-small uppercase text-spicy-berry">Active filters</h2>
        {hasFilters && (
          <button type="button" onClick={onClear}
            className="cursor-pointer text-small uppercase text-spicy-berry underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry">
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-4 pr-2 pt-2">
        {badges.map(({ field, type, item }) => (
          <Badge key={`${field}-${item.id}`} type={type} item={item} selected onRemove={() => onRemove(field, item.id)} />
        ))}
        {time && <Badge type="time" item={time} selected onRemove={() => onRemove("preparationTime")} />}
        {!hasFilters && <p className="text-body">No filters selected</p>}
      </div>
    </section>
  );
}
