import { supabase } from '../../lib/supabase';
import { ISearchService, Document } from '../types';

const mapDocument = (doc: any): Document => ({
  ...doc,
  id: doc.id,
  title: doc.title,
  slug: doc.slug,
  content: doc.content,
  excerpt: doc.excerpt,
  categoryId: doc.category_id,
  authorId: doc.author_id,
  osEnv: doc.os_env,
  status: doc.status,
  isPinned: doc.is_pinned,
  viewCount: doc.view_count,
  createdAt: doc.created_at,
  updatedAt: doc.updated_at,
  publishedAt: doc.published_at,
  category: doc.category ? {
    ...doc.category,
    parentId: doc.category.parent_id,
    sortOrder: doc.category.sort_order
  } : undefined,
  author: doc.author ? {
    id: doc.author.id,
    username: doc.author.username,
    displayName: doc.author.display_name,
    avatarUrl: doc.author.avatar_url
  } : undefined,
  tags: doc.tags || [],
  highlightedExcerpt: doc.excerpt
});

export const searchService: ISearchService = {
  search: async (params) => {
    const { q, category, tag, page = 1, limit = 20 } = params;
    
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
      data: (data || []).map(mapDocument),
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
