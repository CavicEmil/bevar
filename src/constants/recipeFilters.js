export const TIMES = [
  { id: "under30", label: "Under 30 minutes", min: null, max: 30, maxExclusive: true },
  { id: "30to60", label: "30–60 minutes", min: 30, max: 60, maxExclusive: true },
  { id: "60to120", label: "1–2 hours", min: 60, max: 120, maxExclusive: false },
  { id: "all", label: "No time limit" },
];

export const FILTER_GROUPS = [
  { field: "fruitIds", source: "fruits", type: "fruit", label: "Fruit" },
  { field: "categoryIds", source: "categories", type: "category", label: "Categories" },
  { field: "difficultyIds", source: "difficulties", type: "difficulty", label: "Difficulty" },
];

export function createEmptyFilters() {
  return { fruitIds: [], categoryIds: [], difficultyIds: [], preparationTime: "all" };
}

/* Derive the API range from the selected time option in one place */
export function getTimeRange(id) {
  const time = TIMES.find((item) => item.id === id);
  return !time || time.id === "all"
    ? null
    : { min: time.min, max: time.max, maxExclusive: time.maxExclusive };
}

export function removeFilter(filters, field, id) {
  return {
    ...filters,
    [field]: field === "preparationTime"
      ? "all"
      : filters[field].filter((value) => value !== id),
  };
}
