import { supabase } from '../../lib/supabase';
import { IUsersService } from '../types';

export const usersService: IUsersService = {
  getAll: async (params) => {
    const { page = 1, limit = 20, role, search } = params;
    let query = supabase.from('profiles').select('*', { count: 'exact' });

    if (role) query = query.eq('role', role);
    if (search) query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,display_name.ilike.%${search}%`);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data as any[],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      }
    };
  },
  update: async (id, payload) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  },
  delete: async (id) => {
    // In Supabase we typically toggle is_active or use an edge function to delete auth user
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
    return { deleted: true };
  },
};
 Broadway