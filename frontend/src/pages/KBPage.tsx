import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DocList from '../components/layout/DocList';
import DocViewPage from './DocViewPage';
import DocEditPage from './DocEditPage';
import NewDocPage from './NewDocPage';
import SearchPage from './SearchPage';
import AdminPage from './AdminPage';
import WelcomePage from './WelcomePage';
import MobileTopbar from '../components/layout/MobileTopbar';
import BottomNav from '../components/layout/BottomNav';
import SearchOverlay from '../components/layout/SearchOverlay';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useUIStore } from '../store/ui.store';
import { PanelLeft, X } from 'lucide-react';

export default function KBPage() {
  useKeyboardShortcuts();
  const { 
    sidebarOpen, 
    docListOpen, 
    toggleSidebar, 
    toggleDocList, 
    isSidebarDrawerOpen, 
    setSidebarDrawerOpen,
    selectedDocId
  } = useUIStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground relative app-shell">
      {/* 1. Sidebar — Drawer on Mobile, Fixed on Desktop */}
      <div className={`
        fixed inset-0 z-[100] lg:relative lg:z-0 lg:flex
        ${isSidebarDrawerOpen ? 'visible' : 'invisible lg:visible'}
      `}>
        {/* Mobile Backdrop */}
        <div 
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isSidebarDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarDrawerOpen(false)}
        />
        {/* Sidebar Container */}
        <div className={`
          relative w-64 h-full bg-card lg:translate-x-0 transition-transform duration-300 ease-in-out
          ${isSidebarDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar />
          {/* Close button for mobile drawer */}
          <button 
            onClick={() => setSidebarDrawerOpen(false)}
            className="absolute top-4 -right-12 p-2 lg:hidden text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 2. Mobile Components */}
      <MobileTopbar />
      <BottomNav />
      <SearchOverlay />

      {/* 3. Document List — Hidden on mobile when a doc is active */}
      <div className={`
        ${docListOpen ? 'flex' : 'hidden'} 
        ${selectedDocId ? 'hidden md:flex' : 'flex w-full md:w-80'}
      `}>
        <DocList />
      </div>
      
      {/* 4. Main Content Area */}
      <main className={`
        flex-1 overflow-hidden relative flex flex-col pt-14 pb-16 lg:pt-0 lg:pb-0
        ${selectedDocId ? 'flex' : 'hidden md:flex'}
      `}>
        {/* Desktop-only floating restore buttons */}
        <div className="hidden lg:flex absolute top-4 left-4 z-50 gap-2">
          {!sidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground shadow-xl transition-all hover:scale-105 active:scale-95"
              title="Show Sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
          {!docListOpen && (
            <button 
              onClick={toggleDocList}
              className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground shadow-xl transition-all hover:scale-105 active:scale-95"
              title="Show Document List"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/categories/:categorySlug" element={<WelcomePage />} />
            <Route path="/docs/:slug" element={<DocViewPage />} />
            <Route path="/docs/:slug/edit" element={<DocEditPage />} />
            <Route path="/docs/new" element={<NewDocPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
