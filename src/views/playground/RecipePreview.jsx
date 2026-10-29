import { Link } from "react-router";
import Recipe from "../Recipe";

export default function RecipePreview() {
  return (
    <div>
      <Link to="/playground/marta" className="inline-flex min-h-[44px] items-center py-[12px] font-the-one text-white">← Back to Marta’s playground</Link>
      <Recipe outlinedTags />
    </div>
  );
}
