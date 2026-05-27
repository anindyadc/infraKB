import { create } from 'zustand';

interface UIState {
  selectedCategorySlug: string | 'all' | null;
  selectedDocId: number | null;
  setSelectedCategorySlug: (slug: string | 'all' | null) => void;
  setSelectedDocId: (id: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedCategorySlug: 'all',
  selectedDocId: null,
  setSelectedCategorySlug: (slug) => set({ selectedCategorySlug: slug }),
  setSelectedDocId: (id) => set({ selectedDocId: id }),
}));
