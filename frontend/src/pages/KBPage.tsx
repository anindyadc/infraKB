import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DocList from '../components/layout/DocList';
import DocViewPage from './DocViewPage';
import DocEditPage from './DocEditPage';
import NewDocPage from './NewDocPage';
import SearchPage from './SearchPage';
import AdminPage from './AdminPage';
import WelcomePage from './WelcomePage';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useUIStore } from '../store/ui.store';
import { PanelLeft } from 'lucide-react';

export default function KBPage() {
  useKeyboardShortcuts();
  const { sidebarOpen, docListOpen, toggleSidebar, toggleDocList } = useUIStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground relative">
      {/* Background Decorative Elements - Matching Login Page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {sidebarOpen && <Sidebar />}
      {docListOpen && <DocList />}
      
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* Floating Toggle Buttons for collapsed sidebars */}
        {(!sidebarOpen || !docListOpen) && (
          <div className="absolute top-4 left-4 z-50 flex gap-2">
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
        )}

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
