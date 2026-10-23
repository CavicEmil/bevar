import { useEffect, useState } from "react";
import { supabase } from "../../api/client";
import Badge from "../../components/ui/Badge";
import Chip from "../../components/ui/Chip";

const timeOptions = [
  { id: "quick", label: "Under 30 minutes" },
  { id: "medium", label: "30–60 minutes" },
  { id: "long", label: "Over 60 minutes" },
];

/* Resolve database image paths to public Storage URLs */
function imageUrl(path, bucket) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export default function JosiePlayground() {
  const [fruits, setFruits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Keep each preview selection independent */
  function toggle(key) {
    setSelected((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  }

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        const results = await Promise.all([
          supabase.from("fruits").select("*"),
          supabase.from("category").select("*"),
          supabase.from("difficulty").select("*"),
        ]);

        const failed = results.find((result) => result.error);
        if (failed) throw failed.error;

        if (active) {
          setFruits(results[0].data ?? []);
          setCategories(results[1].data ?? []);
          setDifficulties(results[2].data ?? []);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="p-page">Loading preview…</p>;
  }

  if (error) {
    return <p className="p-page">Could not load: {error}</p>;
  }

  return (
    <main className="min-h-screen bg-rose-fantasy p-page pb-28 font-the-one text-dark-humor">
      <div className="mx-auto flex max-w-lg flex-col gap-8">
        <h1 className="text-2xl font-semibold">
          Playground — Josie
        </h1>

        {/* Fruit badges */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Fruit badges</h2>

          <div className="flex flex-wrap gap-objects">
            {fruits.map((fruit) => {
              const key = `badge-fruit-${fruit.id}`;

              return (
                <Badge
                  key={key}
                  type="fruit"
                  item={fruit}
                  selected={!!selected[key]}
                  onClick={() => toggle(key)}
                />
              );
            })}
          </div>
        </section>

        {/* Category badges */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Category badges</h2>

          <div className="flex flex-wrap gap-objects">
            {categories.map((category) => {
              const key = `badge-category-${category.id}`;

              return (
                <Badge
                  key={key}
                  type="category"
                  item={category}
                  selected={!!selected[key]}
                  onClick={() => toggle(key)}
                />
              );
            })}
          </div>
        </section>

        {/* Difficulty badges */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Difficulty badges</h2>

          <div className="flex flex-wrap gap-objects">
            {difficulties.map((difficulty) => {
              const key = `badge-difficulty-${difficulty.id}`;

              return (
                <Badge
                  key={key}
                  type="difficulty"
                  item={difficulty}
                  selected={!!selected[key]}
                  onClick={() => toggle(key)}
                />
              );
            })}
          </div>
        </section>

        {/* Time badges */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Time badges</h2>

          <div className="flex flex-wrap gap-objects">
            {timeOptions.map((time) => {
              const key = `badge-time-${time.id}`;

              return (
                <Badge
                  key={key}
                  type="time"
                  item={time}
                  selected={!!selected[key]}
                  onClick={() => toggle(key)}
                />
              );
            })}
          </div>
        </section>

        {/* Fruit selection chips */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Fruit chips</h2>

          <div className="grid grid-cols-4 gap-5">
            {fruits.map((fruit) => {
              const key = `chip-fruit-${fruit.id}`;

              return (
                <Chip
                  key={key}
                  variant="fruit"
                  label={fruit.name}
                  imageSrc={imageUrl(
                    fruit.image_path,
                    "fruit-images"
                  )}
                  selected={!!selected[key]}
                  onChange={() => toggle(key)}
                />
              );
            })}
          </div>
        </section>

        {/* Category options use the method chip layout */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Category chips</h2>

          <div className="grid grid-cols-2 gap-objects">
            {categories.map((category) => {
              const key = `chip-category-${category.id}`;

              return (
                <Chip
                  key={key}
                  variant="method"
                  label={category.category}
                  iconSrc={imageUrl(
                    category.category_image_path,
                    "category-images"
                  )}
                  selected={!!selected[key]}
                  onChange={() => toggle(key)}
                />
              );
            })}
          </div>
        </section>

        {/* Time selection chips */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Time chips</h2>

          <div className="flex flex-col gap-objects">
            {timeOptions.map((time) => {
              const key = `chip-time-${time.id}`;

              return (
                <Chip
                  key={key}
                  variant="time"
                  label={time.label}
                  selected={!!selected[key]}
                  onChange={() => toggle(key)}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}