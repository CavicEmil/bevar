import { supabase } from './client';
import { unwrap } from './helpers';

/* this makes the user able to view the reviews */
export async function getReviews(recipeId) {
    return unwrap(await supabase
        .from('reviews')
        .select(`*, profile (username, profile_image_path)`)
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false })
    );
}

/* and this upserts (=inserts new row if it doesnt exist or updates already existing row) the review */
export async function upsertReview({ recipeId, rating, comment }) {
    return unwrap(await supabase
        .from('reviews')
        .upsert({ recipe_id: recipeId, rating, comment }, 
            { onConflict: 'recipe_id,user_id'}
        )
    );
}