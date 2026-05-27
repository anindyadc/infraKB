import { useQuery } from '@tanstack/react-query';
import { getDocs } from '../../api/docs.api';
import { useUIStore } from '../../store/ui.store';
import { useParams, Link } from 'react-router-dom';
import { PanelLeftClose } from 'lucide-react';

export default function DocList() {
  const { categorySlug } = useParams();
  const { selectedDocId, toggleDocList } = useUIStore();
  
  const { data, isLoading } = useQuery({
    queryKey: ['docs', categorySlug],
    queryFn: () => getDocs({ category: categorySlug }),
  });

  return (
    <div className="flex h-screen w-72 flex-col border-r border-border bg-background/50 relative group">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="overflow-hidden">
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70 truncate">
            {categorySlug || 'All Documents'}
          </h2>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground">{data?.pagination.total || 0}</span>
            <span className="text-sm text-primary font-medium">docs</span>
          </div>
        </div>
        <button 
          onClick={toggleDocList}
          className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-all shrink-0"
          title="Hide Document List"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="p-4 text-center text-xs text-muted-foreground/70">Loading docs...</div>
        ) : (
          data?.docs.map((doc: any) => (
            <Link
              key={doc.id}
              to={`/docs/${doc.slug}`}
              className={`block rounded-md p-3 transition-colors ${
                doc.id === selectedDocId
                  ? 'bg-muted border border-primary/30'
                  : 'hover:bg-accent border border-transparent'
              }`}
            >
              <h3 className={`text-sm font-medium leading-snug ${doc.id === selectedDocId ? 'text-primary' : 'text-foreground'}`}>
                {doc.title}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono text-primary">
                  {doc.category?.name || 'Uncategorized'}
                </span>
                <span className="ml-auto text-[10px] font-mono text-muted-foreground/70">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
