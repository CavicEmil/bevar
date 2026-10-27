import { useEffect, useState } from "react";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Eyebrow from "./ui/Eyebrow";
import Heading from "./ui/Heading";
import { getPublicUrl, BUCKETS } from "../api/media";
import { getFruits, getCategories, getDifficulties } from "../api/reference";
import { ONBOARDING_TIMES } from "../constants/onboarding";

const TIMES = ONBOARDING_TIMES;   // one source of truth — no drifting copy

const emptyFilters = () => ({
  fruitIds: [],
  categoryIds: [],
  difficultyIds: [],
  preparationTime: "all",
});

export default function FilterCard({ initialFilters, options, onApply, className = "" }) {
  const [filters, setFilters] = useState(() => ({ ...emptyFilters(), ...initialFilters }));
  const [loadedOptions, setLoadedOptions] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [applyError, setApplyError] = useState("");
  const [pending, setPending] = useState(false);
  const data = options ?? loadedOptions;

  /* reference data through the api layer — no direct supabase here */
  useEffect(() => {
    if (options) return;
    let cancelled = false;

    async function load() {
      try {
        const [fruits, categories, difficulties] = await Promise.all([
          getFruits(),
          getCategories(),
          getDifficulties(),
        ]);
        if (!cancelled) {
          setLoadedOptions({
            fruits: fruits ?? [],
            categories: categories ?? [],
            difficulties: difficulties ?? [],
          });
        }
      } catch {
        if (!cancelled) setLoadError("Could not load filters. Please reopen and try again.");
      }
    }

    load();
    return () => { cancelled = true; };
  }, [options]);

  const groups = [
    { key: "fruitIds", label: "Fruit", items: data?.fruits ?? [], name: "name" },
    {
      key: "categoryIds", label: "Categories", items: data?.categories ?? [],
      name: "category", image: "category_image_path", bucket: BUCKETS.categoryImages,
    },
    {
      key: "difficultyIds", label: "Difficulty", items: data?.difficulties ?? [],
      name: "difficulty", image: "difficulty_image_path", bucket: BUCKETS.difficultyImages,
    },
  ];

  const time = TIMES.find((item) => item.id === filters.preparationTime) ?? TIMES.at(-1);
  const active = groups.flatMap((group) =>
    group.items
      .filter((item) => filters[group.key].includes(item.id))
      .map((item) => ({ group, item }))
  );

  function toggle(key, id) {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(id)
        ? current[key].filter((value) => value !== id)
        : [...current[key], id],
    }));
  }

  function badge(group, item) {
    const path = group.image ? item[group.image] : null;
    const iconUrl = !path ? undefined : getPublicUrl(group.bucket, path);   // ← shared helper, no private regex

    return (
      <Badge
        key={`${group.key}-${item.id}`}
        type={group.key === "fruitIds" ? "fruit" : "category"}
        item={group.key === "fruitIds" ? item : { category: item[group.name], category_image_path: iconUrl }}
        selected={filters[group.key].includes(item.id)}
        onClick={() => toggle(group.key, item.id)}
      />
    );
  }

  /* FilterCard's REAL job: translate the draft to plain data and hand it up.
     It does NOT know about URLs — that's the view's job. */
  async function apply(event) {
    event.preventDefault();
    if (pending || !data || typeof onApply !== "function") return;

    setPending(true);
    setApplyError("");
    try {
      await onApply({
        ...filters,
        preparationTime: time.id,
        prepTimeRange:
          time.id === "all"
            ? null
            : { min: time.min, max: time.max, maxExclusive: time.maxExclusive },
      });
    } catch {
      setApplyError("Could not apply filters. Please try again.");
    } finally {
      setPending(false);
    }
  }

  function groupField(group) {
    return (
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-related text-small text-spicy-berry uppercase">{group.label}</legend>
        <div className="flex flex-wrap gap-related">{group.items.map((item) => badge(group, item))}</div>
      </fieldset>
    );
  }


  return (
    <Card variant="fruit" className={`w-full rounded-t-[28px] rounded-b-none p-[24px] font-the-one text-dark-humor ${className}`}>
      <form aria-label="Filter recipes" onSubmit={apply} aria-busy={pending}>
        <fieldset disabled={pending || !data} className="m-0 flex min-w-0 flex-col gap-section border-0 p-0">
          <Heading level={2} variant={2} content="Filter recipes" />
          {loadError && <p role="alert" className="text-body">{loadError}</p>}
          {!data && !loadError && <p role="status" className="text-body">Loading filters…</p>}
          <section aria-label="Active filters" className="flex flex-col gap-related">
            <Eyebrow content="Active filters" />
            <div className="flex flex-wrap gap-related">
              {active.map(({ group, item }) => badge(group, item))}
              {time.id !== "all" && <Badge type="time" item={time} selected onClick={() => setFilters(current => ({ ...current, preparationTime: "all" }))} />}
              {!active.length && time.id === "all" && <p className="text-body">No filters selected</p>}
            </div>
          </section>
          {groupField(groups[0])}
          {groupField(groups[1])}
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-related text-small text-spicy-berry uppercase">Preparation time</legend>
            <div className="flex flex-wrap gap-related">
              {TIMES.map(item => <Badge key={item.id} type="time" item={item} selected={time.id === item.id}
                onClick={() => setFilters(current => ({ ...current, preparationTime: item.id }))} />)}
            </div>
          </fieldset>
          {groupField(groups[2])}
          {applyError && <p role="alert" className="text-body">{applyError}</p>}
          <div className="flex flex-col gap-related">
            <Button content={pending ? "Applying…" : "Apply filters"} type="submit" disabled={pending || !data || typeof onApply !== "function"} />
            <Button content="Reset" variant="secondary" disabled={pending || !data}
              onClick={() => { setFilters(emptyFilters()); setApplyError(""); }} />
          </div>
        </fieldset>
      </form>
    </Card>
  );
}
