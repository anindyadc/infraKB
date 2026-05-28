import { supabase } from '../../lib/supabase';
import { IStatsService } from '../types';

export const statsService: IStatsService = {
  getStats: async () => {
    // This would ideally be a database view or RPC in Supabase
    // for efficiency, but here we do multiple queries.
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
      totalDocs,
      publishedDocs,
      draftDocs,
      totalUsers,
      recentDocs,
      topViewedDocs
    };
  },
};
 Broadway