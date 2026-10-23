/* Core recipe queries */

import { supabase } from './client';
import { unwrap } from './helper';

/* Shared recipe data, including categories and their related methods */
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

/* Fetch recipes with optional filters using database IDs */
export async function getRecipes({ category, method, difficulty, search } = {}) {
    let query = supabase.from('recipes').select(recipeSelect);
    if (category) query = query.eq('category_id', category);
    if (method) query = query.eq('method_id', method);
    if (difficulty) query = query.eq('difficulty_id', difficulty);
    if (search) query = query.ilike('title', `%${search}%`);
    return unwrap(await query);
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