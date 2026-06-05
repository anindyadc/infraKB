import { supabase } from '../../lib/supabase';
import { ICategoriesService, Category } from '../types';

const mapCategory = (cat: any): Category => ({
  ...cat,
  parentId: cat.parent_id,
  sortOrder: cat.sort_order,
  children: cat.children?.map(mapCategory) || [],
  _count: cat._count ? (Array.isArray(cat._count) ? { docs: cat._count[0].count } : { docs: cat._count.docs || cat._count.count || 0 }) : undefined
});

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
      categories: categories.map(mapCategory), 
      uncategorizedCount: uncategorizedCount || 0 
    };
  },
  create: async (payload) => {
    const { parentId, sortOrder, ...catData } = payload;
    const insertPayload = {
      ...catData,
      parent_id: parentId,
      sort_order: sortOrder
    };
    const { data, error } = await supabase
      .from('categories')
      .insert(insertPayload)
      .select()
      .single();
    if (error) throw error;
    return mapCategory(data);
  },
  update: async (id, payload) => {
    const { parentId, sortOrder, ...catData } = payload;
    const updatePayload: any = { ...catData };
    if (parentId !== undefined) updatePayload.parent_id = parentId;
    if (sortOrder !== undefined) updatePayload.sort_order = sortOrder;

    const { data, error } = await supabase
      .from('categories')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapCategory(data);
  },
  delete: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  },
};
