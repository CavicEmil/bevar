/* Core recipe queries */

import { supabase } from './client';
import { unwrap } from './helper';

/* Shared recipe data and related properties */
const recipeSelect = `
    *,
    fruits(*),
    category(*, method(*)),
    method(*),
    difficulty(*)
`;

/* Additional information for the single recipe page */
const recipeDetailSelect = `
    ${recipeSelect},
    recipeingredients (amount, unit, ingredients (id, name)),
    recipe_equipment (equipment (id, name), equipment_amount),
    step_by_step_guide (id, step_number, instruction, media_path, media_type)
`;

/* Apply filters and search across the related recipe properties */
export async function getRecipes({
        category, method, difficulty, search,
        fruitIds = [], categoryIds = [], difficultyIds = [],
        prepTimeRange = null,
        orderBy = 'created_at', ascending = false,
    } = {}) {
    let query = supabase.from('recipes').select(recipeSelect);

    /* Apply selected filters in Supabase */
    if (category) query = query.eq('category_id', category);
    if (method) query = query.eq('method_id', method);
    if (difficulty) query = query.eq('difficulty_id', difficulty);

    if (fruitIds.length) query = query.in('fruit_id', fruitIds);
    if (categoryIds.length) query = query.in('category_id', categoryIds);
    if (difficultyIds.length) query = query.in('difficulty_id', difficultyIds);

    if (prepTimeRange?.min != null) {
        query = query.gte('prep_time_minutes', prepTimeRange.min);
    }

    if (prepTimeRange?.max != null) {
        query = prepTimeRange.maxExclusive
            ? query.lt('prep_time_minutes', prepTimeRange.max)
            : query.lte('prep_time_minutes', prepTimeRange.max);
    }

    if (search?.trim()) {
        const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
        const matchers = terms
            .map(term => `title.ilike.%${term}%,description.ilike.%${term}%,category.category.ilike.%${term}%`)
            .join(',');
            query = query.or(matchers);
    }

    const recipes = unwrap(await query.order(orderBy, { ascending })) ?? [];
    const terms = search?.trim().toLowerCase().split(/\s+/).filter(Boolean) ?? [];

    if (!terms.length) return recipes;

    /* Search the fetched data for this small recipe collection */
    return recipes.filter((recipe) => {
        const searchableText = [
            recipe.title,
            recipe.description,
            recipe.storage,
            recipe.prep_time_minutes,
            recipe.servings,
            recipe.fruits?.name,
            recipe.category?.category,
            recipe.category?.description,
            recipe.method?.method,
            recipe.method?.description,
            recipe.difficulty?.difficulty,
        ]
            .filter(value => value != null)
            .join(' ')
            .toLowerCase();

        return terms.every(term => searchableText.includes(term));
    });
}

/* Fetch a single recipe with all related details */
export async function getRecipe(id) {
    return unwrap(await supabase
        .from('recipes')
        .select(recipeDetailSelect)
        .eq('id', id)
        .single());
}

/* Create a recipe */
export async function createRecipe(payload) {
    return unwrap(await supabase.rpc('create_recipe', { payload }));
}

/* Delete a recipe */
export async function deleteRecipe(id) {
    return unwrap(await supabase.from('recipes').delete().eq('id', id));
}