import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import { useUIStore } from './store/ui.store';
import { getMe } from './api/users.api';
import { copyToClipboard } from './lib/clipboard';
import LoginPage from './pages/LoginPage';
import KBPage from './pages/KBPage';
import PublicDocPage from './pages/PublicDocPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitializing } = useAuthStore();
  
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Global Code Copy Handler
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.copy-btn') as HTMLElement;
      
      if (btn) {
        const b64 = btn.getAttribute('data-code');
        if (b64) {
          try {
            const code = decodeURIComponent(atob(b64));
            
            copyToClipboard(code).then((success) => {
              if (success) {
                const span = btn.querySelector('.btn-text');
                if (span) {
                  const oldText = span.textContent;
                  span.textContent = 'COPIED!';
                  btn.classList.add('!text-emerald-500', '!border-emerald-500/50', '!bg-emerald-500/10');
                  
                  setTimeout(() => {
                    span.textContent = oldText;
                    btn.classList.remove('!text-emerald-500', '!border-emerald-500/50', '!bg-emerald-500/10');
                  }, 2000);
                }
              }
            });
          } catch (err) {
            console.error('Copy failed', err);
          }
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/share/:slug" element={<PublicDocPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <KBPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
