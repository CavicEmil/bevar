/* also known as look up tables, this module handles all read only tables */

import { supabase } from './client';
import { unwrap } from './helpers';

export const getCategories = () => 
    unwrap(supabase.from('category').select('*').order('category'));

export const getDifficulties = () => 
    unwrap(supabase.from('difficulty').select('*').order('level'));

export const getEquipment = () => 
    unwrap(supabase.from('equipment').select('*').order('name'));

export const getIngredients = () => 
    unwrap(supabase.from('ingredients').select('*').order('name'));
