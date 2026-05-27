import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categories.api';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';
import { LayoutGrid, Plus, LogOut, PanelLeftClose, HardDrive } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../shared/SearchBar';
import ThemeToggle from '../shared/ThemeToggle';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const location = useLocation();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl relative group">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />

      <div className="flex flex-col p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 ring-1 ring-white/10">
              KB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tighter uppercase text-foreground">InfraKB</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">Core Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button 
              onClick={toggleSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all active:scale-90"
              title="Hide Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <SearchBar />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-none">
        <div>
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-4 flex items-center gap-2">
            <HardDrive className="h-3 w-3" />
            Navigation
          </h3>
          <nav className="space-y-1">
            <Link to="/" className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${isActive('/') ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
              <LayoutGrid className="h-4 w-4" />
              <span>Dashboard</span>
              <span className="ml-auto font-mono text-[9px] font-black bg-muted/50 px-1.5 py-0.5 rounded border border-border/50">01</span>
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-4">Categories</h3>
          <nav className="space-y-1">
            {isLoading ? (
              <div className="px-4 py-2 space-y-3">
                <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
              </div>
            ) : (
              categories?.map((cat: any) => (
                <div key={cat.id}>
                  <Link to={`/categories/${cat.slug}`} className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-bold transition-all ${isActive(`/categories/${cat.slug}`) ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                    <span className="w-4 text-center grayscale brightness-125 group-hover:grayscale-0">{cat.icon || '📁'}</span>
                    <span>{cat.name}</span>
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground/50">{cat._count.docs}</span>
                  </Link>
                </div>
              ))
            )}
          </nav>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-t from-background/80 to-transparent border-t border-border/50">
        {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
          <Link to="/docs/new" className="group mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]">
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span>New Runbook</span>
          </Link>
        )}
        <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-muted/30 border border-border/30">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs text-primary font-black shadow-inner">
            {user?.displayName?.charAt(0)}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-xs font-black text-foreground uppercase tracking-tight">{user?.displayName}</span>
            <span className="truncate text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest">{user?.role}</span>
          </div>
          <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
