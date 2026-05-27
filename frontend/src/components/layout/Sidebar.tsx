import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categories.api';
import { useAuthStore } from '../../store/auth.store';
import { LayoutGrid, Plus, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../shared/SearchBar';
import ThemeToggle from '../shared/ThemeToggle';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex flex-col p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
              KB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">InfraKB</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">devops knowledge base</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        
        <SearchBar />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-4">
          <h3 className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70">Browse</h3>
          <nav className="mt-2 space-y-0.5">
            <Link to="/" className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${isActive('/') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
              <LayoutGrid className="h-4 w-4" />
              <span>All Docs</span>
              <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">0</span>
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70">Categories</h3>
          <nav className="mt-2 space-y-0.5">
            {isLoading ? (
              <div className="px-3 py-2 text-xs text-muted-foreground/70">Loading...</div>
            ) : (
              categories?.map((cat: any) => (
                <div key={cat.id}>
                  <Link to={`/categories/${cat.slug}`} className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm ${isActive(`/categories/${cat.slug}`) ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
                    <span className="w-4 text-center">{cat.icon || '📁'}</span>
                    <span>{cat.name}</span>
                    <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {cat._count.docs}
                    </span>
                  </Link>
                  {cat.children?.map((child: any) => (
                    <Link key={child.id} to={`/categories/${child.slug}`} className={`flex w-full items-center gap-2 rounded-md pl-8 pr-3 py-1 text-xs ${isActive(`/categories/${child.slug}`) ? 'text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
                      <span>{child.name}</span>
                      <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {child._count.docs}
                      </span>
                    </Link>
                  ))}
                </div>
              ))
            )}
          </nav>
        </div>
      </div>

      <div className="border-t border-border p-3">
        {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
          <Link to="/docs/new" className="mb-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            <span>New Runbook</span>
          </Link>
        )}
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground">
            {user?.displayName?.charAt(0)}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-foreground">{user?.displayName}</span>
            <span className="truncate text-[10px] font-mono uppercase text-muted-foreground/70">{user?.role}</span>
          </div>
          <button onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
