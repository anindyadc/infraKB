import { supabase } from '../../lib/supabase';
import { ICategoriesService } from '../types';

export const categoriesService: ICategoriesService = {
  getAll: async () => {
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*, children:categories(*), _count:documents(count)')
      .is('parent_id', null)
      .order('sort_order', { ascending: true });

    if (catError) throw catError;

    const { count: uncategorizedCount, error: unError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .is('category_id', null);

    if (unError) throw unError;

    return { 
      categories: categories.map(c => ({ ...c, _count: { docs: c._count[0].count } })), 
      uncategorizedCount: uncategorizedCount || 0 
    };
  },
  create: async (payload) => {
    const { data, error } = await supabase
      .from('categories')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  },
  update: async (id, payload) => {
    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  },
  delete: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  },
};
