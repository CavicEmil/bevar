import { useEffect, useId, useMemo, useState } from "react";

import { getArticles } from "../api/article";
import { getFruits, getCategories } from "../api/reference";

import SearchBar from "./SearchBar";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

/* Match the five existing ArticleCategory variants. */
const ARTICLE_CATEGORIES = [
  "Methods",
  "Storage",
  "Hygiene & Safety",
  "Equipment",
  "Seasonal note",
];

export function createArticleSearchState() {
  return {
    search: "",
    articleCategories: [],
    fruitIds: [],
    categoryIds: [],
    sort: "newest",
  };
}

export default function ArticleSearch({ value, onChange }) {
  const sortingId = useId();

  const [articles, setArticles] = useState([]);
  const [options, setOptions] = useState(null);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState(null);

  /* Load data through the existing API functions. */
  useEffect(() => {
    let active = true;

    Promise.all([
      getArticles(),
      getFruits(),
      getCategories(),
    ])
      .then(([articleData, fruits, categories]) => {
        if (!active) return;

        setArticles(articleData ?? []);
        setOptions({
          fruits: fruits ?? [],
          categories: categories ?? [],
        });
      })
      .catch(() => {
        if (active) {
          setError("Could not load article search options.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /* The view stores the complete search state. */
  function update(changes) {
    onChange({ ...value, ...changes });
  }

  const groups = [
    {
      field: "articleCategories",
      label: "Article topics",
      items: ARTICLE_CATEGORIES.map((name) => ({
        id: name,
        type: "category",
        item: { category: name },
      })),
    },
    {
      field: "fruitIds",
      label: "Fruit",
      items: (options?.fruits ?? []).map((fruit) => ({
        id: fruit.id,
        type: "fruit",
        item: fruit,
      })),
    },
    {
      field: "categoryIds",
      label: "Preservation categories",
      items: (options?.categories ?? []).map((category) => ({
        id: category.id,
        type: "category",
        item: category,
      })),
    },
  ];

  /* Match article titles and their linked search information. */
  const suggestions = useMemo(() => {
    const query = value.search.trim().toLowerCase();
    if (!query) return [];

    const terms = query.split(/\s+/);

    const items = [
      ...articles.map((article) => ({
        id: article.id,
        type: "article",
        label: article.title,
        searchable: [
          article.title,
          article.excerpt,
          article.article_category,
          article.fruit?.name,
          article.preservation_category?.category,
        ].filter(Boolean).join(" "),
      })),

      ...ARTICLE_CATEGORIES.map((name) => ({
        id: name,
        type: "topic",
        label: name,
        searchable: name,
      })),

      ...(options?.fruits ?? []).map((fruit) => ({
        id: fruit.id,
        type: "fruit",
        label: fruit.name,
        searchable: fruit.name,
      })),

      ...(options?.categories ?? []).map((category) => ({
        id: category.id,
        type: "category",
        label: category.category,
        searchable: category.category,
      })),
    ];

    function rank(item) {
      const label = item.label.toLowerCase();
      if (label === query) return 0;
      if (label.startsWith(query)) return 1;
      return 2;
    }

    return items
      .filter((item) =>
        terms.every((term) =>
          item.searchable.toLowerCase().includes(term)
        )
      )
      .sort((a, b) =>
        rank(a) - rank(b) || a.label.localeCompare(b.label)
      )
      .slice(0, 8);
  }, [articles, options, value.search]);

  function selectSuggestion(item) {
    if (item.type === "article") {
      update({ search: item.label });
      return;
    }

    const fields = {
      topic: "articleCategories",
      fruit: "fruitIds",
      category: "categoryIds",
    };

    const field = fields[item.type];

    update({
      search: "",
      [field]: [...new Set([...value[field], item.id])],
    });
  }

  function openFilters() {
    if (filtersOpen) {
      setFiltersOpen(false);
      return;
    }

    setDraft({
      articleCategories: [...value.articleCategories],
      fruitIds: [...value.fruitIds],
      categoryIds: [...value.categoryIds],
    });

    setFiltersOpen(true);
  }

  function toggleDraft(field, id) {
    setDraft((current) => ({
      ...current,
      [field]: current[field].includes(id)
        ? current[field].filter((selected) => selected !== id)
        : [...current[field], id],
    }));
  }

  function clearFilters() {
    update({
      articleCategories: [],
      fruitIds: [],
      categoryIds: [],
    });
  }

  const hasFilters = groups.some(
    (group) => value[group.field].length > 0
  );

  return (
    <section
      aria-label="Article search"
      className="
        flex w-full min-w-0 flex-col gap-section
        bg-transparent font-the-one text-dark-humor
      "
    >
      <div className="flex items-start gap-related">
        <SearchBar
          value={value.search}
          onChange={(search) => update({ search })}
          placeholder="Search guides, fruit, tips…"
          ariaLabel="Search articles"
          suggestions={suggestions}
          onSelect={selectSuggestion}
        />

        <Button
          icon="filter"
          ariaLabel={filtersOpen ? "Close filters" : "Open filters"}
          pressed={filtersOpen}
          disabled={!options}
          onClick={openFilters}
        />
      </div>

      {/* Display applied filters with individual remove buttons. */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-related">
          {groups.flatMap((group) =>
            group.items
              .filter((option) =>
                value[group.field].includes(option.id)
              )
              .map((option) => (
                <Badge
                  key={`${group.field}-${option.id}`}
                  type={option.type}
                  item={option.item}
                  selected
                  onRemove={() =>
                    update({
                      [group.field]: value[group.field].filter(
                        (id) => id !== option.id
                      ),
                    })
                  }
                />
              ))
          )}

          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer text-small text-spicy-berry underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Draft filters are applied together when the form is submitted. */}
      {filtersOpen && draft && (
        <form
          aria-label="Filter articles"
          onSubmit={(event) => {
            event.preventDefault();
            update(draft);
            setFiltersOpen(false);
          }}
          className="
            flex flex-col gap-section rounded-card
            bg-rose-fantasy p-page
          "
        >
          <h2 className="text-h2">Filter articles</h2>

          {groups.map((group) => (
            <fieldset
              key={group.field}
              className="m-0 min-w-0 border-0 p-0"
            >
              <legend className="mb-related text-small text-spicy-berry">
                {group.label}
              </legend>

              <div className="flex flex-wrap gap-related">
                {group.items.map((option) => (
                  <Badge
                    key={option.id}
                    type={option.type}
                    item={option.item}
                    selected={draft[group.field].includes(option.id)}
                    onClick={() =>
                      toggleDraft(group.field, option.id)
                    }
                  />
                ))}
              </div>
            </fieldset>
          ))}

          <Button content="Apply filters" type="submit" />

          <Button
            content="Reset filters"
            variant="secondary"
            onClick={() =>
              setDraft({
                articleCategories: [],
                fruitIds: [],
                categoryIds: [],
              })
            }
          />
        </form>
      )}

      {/* Pass sorting to the view without sorting or rendering results here. */}
      <div className="flex items-center justify-end gap-related">
        <label htmlFor={sortingId} className="text-small text-spicy-berry">
          Sort:
        </label>

        <select
          id={sortingId}
          value={value.sort}
          onChange={(event) => update({ sort: event.target.value })}
          className="bg-transparent text-small text-spicy-berry"
        >
          <option value="newest">Newest first</option>
          <option value="a-z">A–Z</option>
          <option value="read-time">Shortest read</option>
        </select>
      </div>

      {!options && !error && (
        <p role="status">Loading search options…</p>
      )}

      {error && <p role="alert">{error}</p>}
    </section>
  );
}