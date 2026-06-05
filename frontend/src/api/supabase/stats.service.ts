import { supabase } from '../../lib/supabase';
import { IStatsService } from '../types';

export const statsService: IStatsService = {
  getStats: async () => {
    const [
      { count: totalDocs },
      { count: publishedDocs },
      { count: draftDocs },
      { count: totalUsers },
      { data: recentDocs },
      { data: topViewedDocs }
    ] = await Promise.all([
      supabase.from('documents').select('*', { count: 'exact', head: true }),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED'),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'DRAFT'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('documents').select('id, title, updated_at, slug, author_id').order('updated_at', { ascending: false }).limit(5),
      supabase.from('documents').select('id, title, view_count, slug').order('view_count', { ascending: false }).limit(5)
    ]);

    return {
      totalDocs: totalDocs || 0,
      publishedDocs: publishedDocs || 0,
      draftDocs: draftDocs || 0,
      totalUsers: totalUsers || 0,
      recentDocs: (recentDocs || []).map((d: any) => ({ ...d, updatedAt: d.updated_at, authorId: d.author_id })),
      topViewedDocs: (topViewedDocs || []).map((d: any) => ({ ...d, viewCount: d.view_count }))
    };
  },
};
