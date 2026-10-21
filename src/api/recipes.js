/* the big one - this is where the apps core comes together */

import { supabase } from './client';
import { unwrap } from './helper';

/* SQL query to get the recipe info across tables we need - keeping one source of truth,
    no touching the recipes info across 5 different components in 25 different ways */
const recipeDetailSelect = `
    *,
    fruits(id, name),
    category(name),
    difficulty(name, level),
    recipeingredients (amount, unit, ingredients (id, name)),
    recipe_equipment (equipment (id, name), equipment_amount),
    step_by_step_guide (id, step_number, instruction, media_path, media_type)
`;

/* api request to get recipes from database */
export async function getRecipes({ category, difficulty, search } = {}) {
    let query = supabase.from('recipes_with_rating').select(`*`);
    if (category) query = query.eq('category_id', category);
    if (difficulty) query = query.eq('difficulty_id', difficulty);
    if (search) query = query.ilike('title', `%${search}%`);
    return unwrap(await query.order('created_at', { ascending: false }));
}

/* api request to get a single recipe by id */
export async function getRecipe(id) {
    return unwrap(await supabase
        .from('recipes')
        .select(recipeDetailSelect)
        .eq('id', id)
        .single());
}

/* we might want to also have users CREATE and DELETE recipes */
export async function createRecipe(payload) {
    return unwrap(await supabase.rpc('create_recipe', { payload }));
}

export async function deleteRecipe(id) {
    return unwrap(await supabase.from('recipes').delete().eq('id', id));
}