import { supabase } from '../../lib/supabase';
import { ITagsService } from '../types';

export const tagsService: ITagsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*, _count:doc_tags(count)')
      .order('name');
    if (error) throw error;
    return data.map(t => ({ ...t, docs: { _count: t._count[0].count } }));
  },
  delete: async (id) => {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  },
};
