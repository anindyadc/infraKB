import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  selectedCategorySlug: string | 'all' | null;
  selectedDocId: number | null;
  theme: Theme;
  sidebarOpen: boolean;
  docListOpen: boolean;
  setSelectedCategorySlug: (slug: string | 'all' | null) => void;
  setSelectedDocId: (id: number | null) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleDocList: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedCategorySlug: 'all',
  selectedDocId: null,
  theme: (localStorage.getItem('theme') as Theme) || 'system',
  sidebarOpen: true,
  docListOpen: true,
  setSelectedCategorySlug: (slug) => set({ selectedCategorySlug: slug }),
  setSelectedDocId: (id) => set({ selectedDocId: id }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDocList: () => set((state) => ({ docListOpen: !state.docListOpen })),
}));
