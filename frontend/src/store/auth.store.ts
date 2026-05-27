import { create } from 'zustand';

interface User {
  id: number;
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
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setInitializing: (initializing: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true, isInitializing: false }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false, isInitializing: false }),
}));
