import { supabase } from './client';
import { unwrap } from './helpers';

/* user saves a recipe with this*/
export async function saveRecipe(recipeId) {
    return unwrap(await supabase    
        .from('saved_recipes')
        .insert({ recipe_id: recipeId, user_id: (
            await supabase.auth.getUser()).data.user.id 
        })
    );
}

/* user can unsave recipe/remove it from saved recipes list */
export async function unsaveRecipe(recipeId) {
    return unwrap(await supabase
        .from('saved_recipes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', (
            await supabase.auth.getUser()).data.user.id
        )
    );
}

/* this lets user view their list of saved recipes */
export async function getSavedRecipes() {
    return unwrap(await supabase
        .from('saved_recipes')
        .select(`recipes (*, category (name))`)
        .order('created_at', { ascending: false})
    );
}