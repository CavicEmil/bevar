/* Read-only lookup tables */

import { supabase } from './client';
import { unwrap } from './helper';

/* Fetch categories together with their related methods */
export const getCategories = async () =>
    unwrap(await supabase.from('category').select('*, method(*)').order('category'));

/* Fetch methods together with their parent category */
export const getMethods = async () =>
    unwrap(await supabase.from('method').select('*, category(*)').order('method'));

export const getDifficulties = async () =>
    unwrap(await supabase.from('difficulty').select('*').order('level'));

export const getEquipment = async () =>
    unwrap(await supabase.from('equipment').select('*').order('name'));

export const getIngredients = async () =>
    unwrap(await supabase.from('ingredients').select('*').order('name'));