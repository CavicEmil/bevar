import { useEffect, useState } from "react";
import { getCategories } from "../../api/reference";
import Chip from "../../components/ui/Chip";

export default function JosiePlayground() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    /* Load categories with joined methods through the API */
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (active) setCategories(data ?? []);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCategories();
    return () => { active = false; };
  }, []);

  function toggleCategory(id) {
    setSelected((previous) => ({ ...previous, [id]: !previous[id] }));
  }

  if (loading) return <p className="p-page">Loading chips…</p>;
  if (error) return <p role="alert" className="p-page">{error}</p>;

  return (
    <main className="min-h-screen bg-rose-fantasy p-page pb-28 font-the-one text-dark-humor">
      <div className="mx-auto flex max-w-lg flex-col gap-section">
        <h1 className="text-2xl font-semibold">Playground — Josie</h1>
        <h2 className="text-xl font-semibold">Category chips</h2>

        <div className="grid grid-cols-2 items-stretch gap-objects">
          {categories.map((category) => (
            <Chip
              key={category.id}
              variant="category"
              item={category}
              selected={!!selected[category.id]}
              onChange={() => toggleCategory(category.id)}
              name="categories"
              className="h-full"
            />
          ))}
        </div>
      </div>
    </main>
  );
}