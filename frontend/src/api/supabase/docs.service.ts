import { supabase } from '../../lib/supabase';
import { IDocsService, Document } from '../types';

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
  tags: doc.tags || []
});

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
      docs: data?.map(mapDocument) || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  },
  getOne: async (idOrSlug) => {
    const isId = /^\d+$/.test(idOrSlug);
    const { data, error } = await supabase
      .from('documents')
      .select('*, category:categories(*), author:profiles(*), tags:doc_tags(tag:tags(*)), attachments(*)')
      .or(isId ? `id.eq.${idOrSlug}` : `slug.eq.${idOrSlug}`)
      .single();

    if (error) throw error;
    
    // Increment view count (fire and forget)
    supabase.rpc('increment_view_count', { doc_id: data.id }).then(({error}) => {
       if (error) console.warn('View count increment failed', error);
    });

    return mapDocument(data);
  },
  create: async (payload) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { tags, categoryId, ...docData } = payload as any;
    
    const baseSlug = docData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    const insertPayload: any = { 
      title: docData.title,
      content: docData.content,
      status: docData.status || 'PUBLISHED',
      os_env: docData.osEnv,
      is_pinned: docData.isPinned || false,
      slug: uniqueSlug, 
      author_id: user.id 
    };

    if (categoryId !== undefined && categoryId !== 0 && categoryId !== null) {
      insertPayload.category_id = categoryId;
    }

    const { data, error } = await supabase
      .from('documents')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;

    // Handle tags in parallel
    if (tags && tags.length > 0) {
       await Promise.all(tags.map(async (tagName: string) => {
         const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
         const { data: tagData } = await supabase
           .from('tags')
           .upsert({ name: tagName, slug: tagSlug }, { onConflict: 'slug' })
           .select()
           .single();
         if (tagData) {
           await supabase.from('doc_tags').upsert({ doc_id: data.id, tag_id: tagData.id }, { onConflict: 'doc_id,tag_id' });
         }
       }));
    }

    return mapDocument(data);
  },
  update: async (id, payload) => {
    const { tags, changeSummary, categoryId, ...docData } = payload as any;
    
    const updatePayload: any = {};
    if (docData.title !== undefined) updatePayload.title = docData.title;
    if (docData.content !== undefined) updatePayload.content = docData.content;
    if (docData.status !== undefined) updatePayload.status = docData.status;
    if (docData.osEnv !== undefined) updatePayload.os_env = docData.osEnv;
    if (docData.isPinned !== undefined) updatePayload.is_pinned = docData.isPinned;
    
    if (categoryId !== undefined) {
      updatePayload.category_id = (categoryId === 0 || categoryId === null) ? null : categoryId;
    }
    
    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('documents')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Handle tags
    if (tags !== undefined) {
      // For simplicity in RLS environment, we delete and re-add or use upsert
      await supabase.from('doc_tags').delete().eq('doc_id', id);
      if (tags.length > 0) {
        await Promise.all(tags.map(async (tagName: string) => {
          const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const { data: tagData } = await supabase
            .from('tags')
            .upsert({ name: tagName, slug: tagSlug }, { onConflict: 'slug' })
            .select()
            .single();
          if (tagData) {
            await supabase.from('doc_tags').upsert({ doc_id: id, tag_id: tagData.id }, { onConflict: 'doc_id,tag_id' });
          }
        }));
      }
    }

    return mapDocument(data);
  },
  delete: async (id) => {
    const { error } = await supabase.rpc('delete_document', { target_doc_id: id });
    if (error) {
      const { error: directError } = await supabase.from('documents').delete().eq('id', id);
      if (directError) throw directError;
    }
    return { deleted: true };
  },
};
