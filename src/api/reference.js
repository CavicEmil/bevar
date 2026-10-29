/* Read-only lookup tables */

import { supabase } from './client';
import { unwrap } from './helper';

/* Equipment-specific methods are not preserving categories or selectable interests. */
const isAvailableMethod = (method) =>
    !/^oven\s*\/\s*dehydrator$/i.test(method.method?.trim() ?? '');

export const getFruits = async () =>
    unwrap(await supabase.from('fruits').select('*').order('name'));

/* Include the methods belonging to each category */
export const getCategories = async () => {
    const categories = unwrap(await supabase.from('category').select('*, method(*)').order('category'));
    return (categories ?? []).map(category => ({
        ...category,
        method: (category.method ?? []).filter(isAvailableMethod),
    }));
};

export const getMethods = async () => {
    const methods = unwrap(await supabase.from('method').select('*, category(*)').order('method'));
    return (methods ?? []).filter(isAvailableMethod);
};

export const getDifficulties = async () =>
    unwrap(await supabase.from('difficulty').select('*').order('level'));

export const getEquipment = async () =>
    unwrap(await supabase.from('equipment').select('*').order('name'));

export const getIngredients = async () =>
    unwrap(await supabase.from('ingredients').select('*').order('name'));
