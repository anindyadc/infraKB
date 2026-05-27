import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import { useUIStore } from './store/ui.store';
import { getMe } from './api/users.api';
import LoginPage from './pages/LoginPage';
import KBPage from './pages/KBPage';

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
  const { setAuth, setInitializing, logout } = useAuthStore();

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

  // Initial Auth Check
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const user = await getMe();
        // If successful, the interceptor might have already updated the accessToken in the store
        // but we need to ensure isAuthenticated is true
        setAuth(user, useAuthStore.getState().accessToken || '');
      } catch (err) {
        logout();
      } finally {
        setInitializing(false);
      }
    };
    bootstrap();
  }, []);

  // Global Copy Helper
  useEffect(() => {
    (window as any).__copyCode = (button: HTMLElement, b64Code: string) => {
      try {
        const code = decodeURIComponent(escape(atob(b64Code)));
        navigator.clipboard.writeText(code).then(() => {
          const span = button.querySelector('.btn-text');
          if (span) {
            const oldText = span.textContent;
            (span as any).textContent = 'COPIED!';
            button.classList.add('border-emerald-500/50', 'text-emerald-500');
            setTimeout(() => {
              (span as any).textContent = oldText;
              button.classList.remove('border-emerald-500/50', 'text-emerald-500');
            }, 2000);
          }
        });
      } catch (err) {
        console.error('Failed to copy code', err);
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
