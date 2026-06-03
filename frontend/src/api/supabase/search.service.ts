import { supabase } from '../../lib/supabase';
import { ISearchService } from '../types';

export const searchService: ISearchService = {
  search: async (params) => {
    const { q, category, tag, page = 1, limit = 20 } = params;
    
    // Using simple text search for now, could use RPC for full fts
    let query = supabase
      .from('documents')
      .select('*, category:categories(*), author:profiles(id, username, display_name)', { count: 'exact' })
      .textSearch('fts', q);

    if (category) query = query.filter('category.slug', 'eq', category);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to);

    if (error) throw error;

    return {
      data: (data as any[]).map(d => ({ ...d, highlightedExcerpt: d.excerpt })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
      query: q
    };
  },
  suggest: async (q) => {
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, slug, category:categories(name)')
      .ilike('title', `%${q}%`)
      .limit(8);
    if (error) throw error;
    return data as any[];
  },
};
