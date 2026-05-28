import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import client from '../api/client';

interface User {
  id: string | number;
  username: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  displayName: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User, accessToken: string | null) => void;
  setAccessToken: (accessToken: string) => void;
  setInitializing: (initializing: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const backendType = import.meta.env.VITE_BACKEND_TYPE;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true, isInitializing: false }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  logout: async () => {
    if (backendType === 'supabase') {
      await supabase.auth.signOut();
    } else {
      await client.post('/auth/logout').catch(() => {});
    }
    set({ user: null, accessToken: null, isAuthenticated: false, isInitializing: false });
  },
  initialize: async () => {
    set({ isInitializing: true });
    try {
      if (backendType === 'supabase') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            set({ 
              user: profile as any, 
              accessToken: session.access_token, 
              isAuthenticated: true 
            });
          }
        }
      } else {
        // Express initialization: try to get 'me' or refresh token
        try {
          const { data } = await client.get('/auth/me');
          if (data.success) {
            set({ user: data.data, isAuthenticated: true });
          }
        } catch (e) {
          // If 401, axios interceptor might have already tried refresh
        }
      }
    } finally {
      set({ isInitializing: false });
    }

    // Listen for Supabase auth changes
    if (backendType === 'supabase') {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          set({ user: profile as any, accessToken: session.access_token, isAuthenticated: true });
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      });
    }
  },
}));
 Broadway