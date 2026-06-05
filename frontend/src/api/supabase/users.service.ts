import { supabase } from '../../lib/supabase';
import { IUsersService, User } from '../types';

const mapUser = (profile: any): User => ({
  id: profile.id,
  username: profile.username,
  email: profile.email,
  role: profile.role,
  displayName: profile.display_name,
  avatarUrl: profile.avatar_url,
  isActive: profile.is_active,
  lastLoginAt: profile.last_login_at,
  createdAt: profile.created_at,
  updatedAt: profile.updated_at
} as any);

export const usersService: IUsersService = {
  getMe: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    if (error) throw error;
    return mapUser(profile);
  },
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
      data: data?.map(mapUser) || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      }
    };
  },
  create: async (payload) => {
    const { email, password, displayName, role, ...metadata } = payload;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName,
          ...metadata
        }
      }
    });
    if (error) throw error;
    // Profile is created via trigger
    return { ...data.user, displayName, role } as any;
  },
  update: async (id, payload) => {
    const { displayName, avatarUrl, isActive, role, ...userData } = payload;
    const updatePayload: any = { ...userData };
    if (displayName !== undefined) updatePayload.display_name = displayName;
    if (avatarUrl !== undefined) updatePayload.avatar_url = avatarUrl;
    if (isActive !== undefined) updatePayload.is_active = isActive;
    if (role !== undefined) updatePayload.role = role;

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapUser(data);
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
    return { deleted: true };
  },
};
