import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
export type MobilePanel = 'list' | 'viewer' | 'editor';

interface UIState {
  // Navigation & Document State
  selectedCategorySlug: string | 'all' | null;
  selectedDocId: number | null;
  
  // Theme State
  theme: Theme;
  
  // Sidebar & Layout State (Desktop/General)
  sidebarOpen: boolean;
  docListOpen: boolean;
  
  // Mobile Specific State
  isSidebarDrawerOpen: boolean;
  mobilePanel: MobilePanel;
  isSearchOverlayOpen: boolean;
  editorTab: 'edit' | 'preview';

  // Actions
  setSelectedCategorySlug: (slug: string | 'all' | null) => void;
  setSelectedDocId: (id: number | null) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleDocList: () => void;
  
  // Mobile Actions
  setSidebarDrawerOpen: (open: boolean) => void;
  setMobilePanel: (panel: MobilePanel) => void;
  setSearchOverlayOpen: (open: boolean) => void;
  setEditorTab: (tab: 'edit' | 'preview') => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedCategorySlug: 'all',
  selectedDocId: null,
  theme: (localStorage.getItem('theme') as Theme) || 'system',
  sidebarOpen: true,
  docListOpen: true,
  
  // Mobile Defaults
  isSidebarDrawerOpen: false,
  mobilePanel: 'list',
  isSearchOverlayOpen: false,
  editorTab: 'edit',

  setSelectedCategorySlug: (slug) => set({ selectedCategorySlug: slug }),
  setSelectedDocId: (id) => set({ 
    selectedDocId: id,
    mobilePanel: id ? 'viewer' : 'list' // Auto-switch panel on selection
  }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDocList: () => set((state) => ({ docListOpen: !state.docListOpen })),
  
  // Mobile Action Implementations
  setSidebarDrawerOpen: (open) => set({ isSidebarDrawerOpen: open }),
  setMobilePanel: (panel) => set({ mobilePanel: panel }),
  setSearchOverlayOpen: (open) => set({ isSearchOverlayOpen: open }),
  setEditorTab: (tab) => set({ editorTab: tab }),
}));
