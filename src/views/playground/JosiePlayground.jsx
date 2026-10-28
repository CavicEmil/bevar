import { useState } from "react";

import ArticleSearch, {
  createArticleSearchState,
} from "../../components/ArticleSearch";

export default function JosiePlayground() {
  /* The view owns the search text, filters and sorting. */
  const [searchValues, setSearchValues] = useState(
    createArticleSearchState
  );

  return (
    <div className="p-page pb-28">
      <ArticleSearch
        value={searchValues}
        onChange={setSearchValues}
      />

      {/* Temporary preview of the values received by the view. */}
      <pre className="mt-5 overflow-auto text-xs">
        {JSON.stringify(searchValues, null, 2)}
      </pre>
    </div>
  );
}