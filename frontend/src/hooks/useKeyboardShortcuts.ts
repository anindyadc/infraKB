import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { toggleSidebar, toggleDocList } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Handle 'Esc' first because it's specifically used to exit inputs
      if (e.key === 'Escape') {
        if (target.id === 'global-search-input') {
          target.blur();
        }
        return;
      }

      // Ignore other shortcuts if user is typing in an input, textarea, or contentEditable
      const isTyping = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      if (isTyping) return;

      const key = e.key.toLowerCase();

      // 'N' for New Runbook (Admin or Editor only)
      if (key === 'n' && (user?.role === 'ADMIN' || user?.role === 'EDITOR')) {
        e.preventDefault();
        navigate('/docs/new');
      }

      // '/' for Search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // '[' for toggle sidebar
      if (e.key === '[') {
        e.preventDefault();
        toggleSidebar();
      }

      // ']' for toggle doc list
      if (e.key === ']') {
        e.preventDefault();
        toggleDocList();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, user]);
}
