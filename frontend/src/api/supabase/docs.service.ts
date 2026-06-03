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

    // Map snake_case to camelCase to match Express API behavior
    const mappedDocs = data?.map(doc => ({
      ...doc,
      updatedAt: doc.updated_at,
      createdAt: doc.created_at,
      categoryId: doc.category_id,
      authorId: doc.author_id,
      viewCount: doc.view_count,
      isPinned: doc.is_pinned
    })) || [];

    return {
      docs: mappedDocs,
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

    const { tags, categoryId, ...docData } = payload as any;
    
    // Generate a URL-friendly slug from the title if not provided
    const baseSlug = docData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    const insertPayload: any = { 
      ...docData, 
      slug: uniqueSlug, 
      author_id: user.id 
    };

    if (categoryId !== undefined) {
      insertPayload.category_id = categoryId;
    }

    const { data, error } = await supabase
      .from('documents')
      .insert(insertPayload)
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
    const { tags, changeSummary, categoryId, ...docData } = payload as any;
    
    const updatePayload: any = { ...docData };
    if (categoryId !== undefined) {
      updatePayload.category_id = categoryId === 0 ? null : categoryId;
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updatePayload)
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
