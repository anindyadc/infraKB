import { categoriesService as expressCategories } from './express/categories.service';
import { categoriesService as supabaseCategories } from './supabase/categories.service';
import { ICategoriesService } from './types';

const backendType = import.meta.env.VITE_BACKEND_TYPE;

export const categoriesService: ICategoriesService = backendType === 'supabase' ? supabaseCategories : expressCategories;

export const getCategories = categoriesService.getAll;
export const createCategory = categoriesService.create;
export const updateCategory = categoriesService.update;
export const deleteCategory = categoriesService.delete;
