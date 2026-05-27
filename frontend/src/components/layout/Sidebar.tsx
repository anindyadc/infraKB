import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categories.api';
import { useAuthStore } from '../../store/auth.store';
import { LayoutGrid, Plus, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../shared/SearchBar';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-[#30363d] bg-[#161b22]">
      <div className="flex flex-col p-4 border-b border-[#30363d]">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10b981] font-mono text-sm font-bold text-[#0d1117]">
            KB
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#e6edf3]">InfraKB</span>
            <span className="text-[10px] font-mono text-[#484f58] uppercase tracking-wider">devops knowledge base</span>
          </div>
        </div>
        
        <SearchBar />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-4">
          <h3 className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#484f58]">Browse</h3>
          <nav className="mt-2 space-y-0.5">
            <Link to="/" className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${isActive('/') ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]'}`}>
              <LayoutGrid className="h-4 w-4" />
              <span>All Docs</span>
              <span className="ml-auto rounded-full bg-[#262c36] px-1.5 py-0.5 text-[10px] font-mono text-[#484f58]">0</span>
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#484f58]">Categories</h3>
          <nav className="mt-2 space-y-0.5">
            {isLoading ? (
              <div className="px-3 py-2 text-xs text-[#484f58]">Loading...</div>
            ) : (
              categories?.map((cat: any) => (
                <div key={cat.id}>
                  <Link to={`/categories/${cat.slug}`} className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm ${isActive(`/categories/${cat.slug}`) ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]'}`}>
                    <span className="w-4 text-center">{cat.icon || '📁'}</span>
                    <span>{cat.name}</span>
                    <span className="ml-auto rounded-full bg-[#262c36] px-1.5 py-0.5 text-[10px] font-mono text-[#484f58]">
                      {cat._count.docs}
                    </span>
                  </Link>
                  {cat.children?.map((child: any) => (
                    <Link key={child.id} to={`/categories/${child.slug}`} className={`flex w-full items-center gap-2 rounded-md pl-8 pr-3 py-1 text-xs ${isActive(`/categories/${child.slug}`) ? 'text-[#10b981]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]'}`}>
                      <span>{child.name}</span>
                      <span className="ml-auto rounded-full bg-[#262c36] px-1.5 py-0.5 text-[10px] font-mono text-[#484f58]">
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

      <div className="border-t border-[#30363d] p-3">
        {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
          <Link to="/docs/new" className="mb-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#10b981] px-4 py-2 text-sm font-semibold text-[#0d1117] hover:bg-[#0d9268]">
            <Plus className="h-4 w-4" />
            <span>New Runbook</span>
          </Link>
        )}
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[10px] text-[#8b949e]">
            {user?.displayName?.charAt(0)}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-[#e6edf3]">{user?.displayName}</span>
            <span className="truncate text-[10px] font-mono uppercase text-[#484f58]">{user?.role}</span>
          </div>
          <button onClick={logout} className="text-[#484f58] hover:text-red-400">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
