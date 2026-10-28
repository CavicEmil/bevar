import { supabase } from './client';
import { unwrap } from './helper';

/* Load articles with their linked fruit and preservation category. */
export async function getArticles({
  category,
  fruitId,
  categoryId,
} = {}) {
  let query = supabase
    .from("articles")
    .select(`
      *,
      fruit:fruits(*),
      preservation_category:category(*)
    `)
    .order("published_at", {
      ascending: false,
      nullsFirst: false,
    });

  /* Article topics: Methods, Storage, Equipment, etc. */
  if (category) {
    query = query.eq("article_category", category);
  }

  if (fruitId) {
    query = query.eq("fruit_id", fruitId);
  }

  /* Preservation categories: Freezing, Jam, etc. */
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  return unwrap(await query);
}

/* Load a single article using the slug from its card link. */
export async function getArticle(slug) {
  return unwrap(
    await supabase
      .from("articles")
      .select(`
        *,
        fruit:fruits(*),
        preservation_category:category(*)
      `)
      .eq("slug", slug)
      .single()
  );
}

/* lets say we want to CREATE an article */
export async function createArticle(payload) {
    return unwrap(await supabase
        .from('articles')
        .insert({
            ...payload,
            author_id: (await supabase.auth.getUser()).data.user.id,
            slug: sluigify(payload.title.toLowerCase().trim().replace(/\s+/g, "-")),
        })
    );
}

/* we have a typo in the article, we need to edit via an UPDATE */
export async function updateArticle(articleId, payload) {
    return unwrap(await supabase
        .from('articles')
        .update({...payload, updated_at: new Date().toISOString() })
        .eq('id', articleId)
    );
}

/* maybe DELETE? */
export async function deleteArticle(id) {
    return unwrap(await supabase.from('articles').delete().eq('id', id));
}