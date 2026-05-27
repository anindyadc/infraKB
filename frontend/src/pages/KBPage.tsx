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

export default function KBPage() {
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <DocList />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/categories/:categorySlug" element={<WelcomePage />} />
          <Route path="/docs/:slug" element={<DocViewPage />} />
          <Route path="/docs/:slug/edit" element={<DocEditPage />} />
          <Route path="/docs/new" element={<NewDocPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}
