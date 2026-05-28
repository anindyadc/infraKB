import { supabase } from '../../lib/supabase';
import { IDocsService, Document } from '../types';

export const docsService: IDocsService = {
  getAll: async (params) => {
    const { category, tag, author, status = 'PUBLISHED', page = 1, limit = 20, sort = 'updated_at', order = 'desc' } = params;
    
    let query = supabase
      .from('documents')
      .select('*, category:categories(*), author:profiles(id, username, display_name)', { count: 'exact' })
      .eq('status', status);

    if (category) {
      if (category === 'uncategorized') {
        query = query.is('category_id', null);
      } else {
        query = query.filter('category.slug', 'eq', category);
      }
    }

    if (tag) {
      query = query.filter('doc_tags.tag.slug', 'eq', tag);
    }

    if (author) {
      query = query.eq('author_id', author);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order(sort, { ascending: order === 'asc' })
      .range(from, to);

    if (error) throw error;

    return {
      docs: data as any[],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  },
  getOne: async (idOrSlug) => {
    const isUuid = idOrSlug.length === 36; // Simple check for UUID vs Slug
    const { data, error } = await supabase
      .from('documents')
      .select('*, category:categories(*), author:profiles(*), tags:doc_tags(tag:tags(*)), attachments(*)')
      .or(isUuid ? `id.eq.${idOrSlug}` : `slug.eq.${idOrSlug}`)
      .single();

    if (error) throw error;
    
    // Increment view count (Simple RPC or update)
    await supabase.rpc('increment_view_count', { doc_id: data.id });

    return data as any;
  },
  create: async (payload) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { tags, ...docData } = payload;
    
    const { data, error } = await supabase
      .from('documents')
      .insert({ ...docData, author_id: user.id })
      .select()
      .single();

    if (error) throw error;

    // Handle tags if provided
    if (tags && tags.length > 0) {
       // Logic to insert tags and links
    }

    return data as any;
  },
  update: async (id, payload) => {
    const { tags, changeSummary, ...docData } = payload;
    const { data, error } = await supabase
      .from('documents')
      .update(docData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },
  delete: async (id) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  },
};
