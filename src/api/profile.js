import { supabase } from './client';
import { unwrap } from './helpers';

/* get all the profile from the db - I should not exist unless we have an admin panel*/
/* export const getProfiles = () =>
    unwrap(supabase.from('profiles').select('*').order('created_at', { ascending: false })); */

/* get a single profile by id */
export async function getProfile(userId) {
    return unwrap(await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
    );
}


/* USE THIS: get MY profile */
export async function getMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    return getProfile(user.id);
}

/* upserting a profile = create if id doesnt exist, if it does edit the row */
export async function upsertProfile(payload) {
    return unwrap(await supabase
        .from('profiles')
        .upsert({ ...payload, user_id: (await supabase.auth.getUser()).data.user.id }, { onConflict: 'user_id'}         
        )
    );
}

/* this is never gonna happen, users will love our app but in case we need to DELETE */
/* export async function deleteProfile(userId) {
    return unwrap(await supabase.from('profiles').delete().eq('user_id', userId));
} */