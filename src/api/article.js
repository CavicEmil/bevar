import { supabase } from './client';
import { unwrap } from './helpers';

/* get all the articles from the db */
export async function getArticles({ category } = {}) {
  let query = supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (category) query = query.eq("article_category", category);
  return unwrap(await query);
}

/* get a single article by id */
export async function getArticle(id) {
    return unwrap(await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
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