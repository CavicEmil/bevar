import { useState } from "react";
import RecipeSearch from "../../components/RecipeSearch";
import { createEmptyFilters } from "../../constants/recipeFilters";

export default function JosiePlayground() {
  /* The view owns the search text and selected filters. */
  const [searchValues, setSearchValues] = useState(() => ({
    search: "",
    ...createEmptyFilters(),
    prepTimeRange: null,
  }));

  return (
    <div >
      <RecipeSearch
        value={searchValues}
        onChange={setSearchValues}
      />
    </div>
  );
}