import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  selectedCategorySlug: string | 'all' | null;
  selectedDocId: number | null;
  theme: Theme;
  setSelectedCategorySlug: (slug: string | 'all' | null) => void;
  setSelectedDocId: (id: number | null) => void;
  setTheme: (theme: Theme) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedCategorySlug: 'all',
  selectedDocId: null,
  theme: (localStorage.getItem('theme') as Theme) || 'system',
  setSelectedCategorySlug: (slug) => set({ selectedCategorySlug: slug }),
  setSelectedDocId: (id) => set({ selectedDocId: id }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));
