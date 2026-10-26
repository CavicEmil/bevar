import { supabase } from "./client";

/* the only place bucket names live — no typos in 15 files */
export const BUCKETS = {
    guidesImages: "guides-images",
    categoryImages: "categor-images",
    fruitImages: "fruit-images",
    articleImages: "article-images",
    recipeImages: "recipe-images",
    profileImages: "profile-images",
};

/* local placeholder so cards never render broken images
const PLACEHOLDER = "/placeholders/recipe.jpg";
 */

/* path → public URL. Sync — no await needed. */
export function getPublicUrl(bucket, path) {
  if (!path) return PLACEHOLDER;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/* upload + return the path to store in the DB */
export async function uploadMedia(bucket, path, file) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return path;
}