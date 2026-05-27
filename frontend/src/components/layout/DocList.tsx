import { useQuery } from '@tanstack/react-query';
import { getDocs } from '../../api/docs.api';
import { useUIStore } from '../../store/ui.store';
import { useParams, Link, useLocation } from 'react-router-dom';
import { PanelLeftClose, FileText, ChevronRight } from 'lucide-react';

export default function DocList() {
  const location = useLocation();
  const { selectedDocId, toggleDocList } = useUIStore();
  
  // Extract category slug manually from path as DocList is outside the main Routes
  const categoryMatch = location.pathname.match(/\/categories\/([^/]+)/);
  const categorySlug = categoryMatch ? categoryMatch[1] : undefined;
  
  const { data, isLoading } = useQuery({
    queryKey: ['docs', categorySlug],
    queryFn: () => getDocs({ category: categorySlug }),
  });

  return (
    <div className="flex h-screen w-80 flex-col border-r border-border bg-card/30 backdrop-blur-md relative group">
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/20">
        <div className="overflow-hidden">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 truncate mb-1">
            {categorySlug ? `Collection: ${categorySlug}` : 'Root / All Documents'}
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums text-foreground tracking-tighter">{data?.pagination.total || 0}</span>
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Entities</span>
          </div>
        </div>
        <button 
          onClick={toggleDocList}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-90"
          title="Hide Registry"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-primary/10">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-muted/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : data?.docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 grayscale">
            <FileText className="h-12 w-12 mb-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">No Documents Found</span>
          </div>
        ) : (
          data?.docs.map((doc: any) => (
            <Link
              key={doc.id}
              to={`/docs/${doc.slug}`}
              className={`group flex flex-col rounded-2xl p-4 transition-all duration-300 relative overflow-hidden ${
                doc.id === selectedDocId
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-white/10'
                  : 'bg-muted/20 border border-transparent hover:bg-muted/50 hover:border-border/50'
              }`}
            >
              {/* Highlight bar for non-selected */}
              {doc.id !== selectedDocId && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-3/4 bg-primary transition-all duration-300 rounded-r-full" />
              )}

              <div className="flex justify-between items-start gap-3">
                <h3 className={`text-sm font-black leading-tight tracking-tight ${doc.id === selectedDocId ? 'text-white' : 'text-foreground'}`}>
                  {doc.title}
                </h3>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 ${doc.id === selectedDocId ? 'text-white/60' : 'text-muted-foreground/30'}`} />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                  doc.id === selectedDocId 
                    ? 'bg-white/20 text-white border border-white/10' 
                    : 'bg-primary/5 text-primary border border-primary/10'
                }`}>
                  {doc.category?.name || 'ROOT'}
                </span>
                <span className={`ml-auto font-mono text-[9px] font-bold ${doc.id === selectedDocId ? 'text-white/50' : 'text-muted-foreground/40'}`}>
                  {new Date(doc.updatedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="p-4 border-t border-border/50 bg-background/40">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-2">
          <span>Registry Status</span>
          <span className="text-emerald-500/50">Synchronized</span>
        </div>
      </div>
    </div>
  );
}
