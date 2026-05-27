import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDoc } from '../api/docs.api';
import { useUIStore } from '../store/ui.store';
import { renderMarkdown } from '../lib/markdown';
import { Edit2, Clock, User, Tag, Share2, Trash2, ChevronRight, Hash, Activity } from 'lucide-react';
import 'highlight.js/styles/github.css';

export default function DocViewPage() {
  const { slug } = useParams();
  const setSelectedDocId = useUIStore((state) => state.setSelectedDocId);

  const { data: doc, isLoading, error } = useQuery({
    queryKey: ['doc', slug],
    queryFn: () => getDoc(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (doc) {
      setSelectedDocId(doc.id);
    }
    return () => setSelectedDocId(null);
  }, [doc, setSelectedDocId]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-full opacity-30 animate-pulse">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Decrypting Node Data...</span>
    </div>
  );
  
  if (error || !doc) return (
    <div className="p-10 text-center flex flex-col items-center justify-center h-full gap-4">
      <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
        <Hash className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-black uppercase tracking-tighter">Node Not Found</h2>
      <p className="text-sm text-muted-foreground font-medium">The requested entity does not exist in the registry.</p>
    </div>
  );

  const html = renderMarkdown(doc.content);

  return (
    <div className="flex h-full flex-col bg-background relative selection:bg-primary/20">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-3 z-10">
        <div className="flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
          <span className="hover:text-primary transition-colors cursor-pointer">Registry</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary/70">{doc.category?.name || 'Root'}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground truncate max-w-[200px]">{doc.title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={`/docs/${doc.slug}/edit`}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/50 hover:text-primary transition-all active:scale-95"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Modify</span>
          </Link>
          <div className="w-px h-4 bg-border/50 mx-1" />
          <button className="flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-90">
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center justify-center h-9 w-9 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/60 hover:text-white hover:bg-destructive transition-all active:scale-90">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/10">
        <div className="mx-auto max-w-5xl px-8 py-16 lg:px-16">
          {/* Document Title Section */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                Live Document
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground leading-tight">
              {doc.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 pt-4 text-[10px] font-black uppercase tracking-[0.15em]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5 text-primary/60" />
                <span>Operator: <span className="text-foreground">{doc.author.displayName}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary/60" />
                <span>Last Sync: <span className="text-foreground">{new Date(doc.updatedAt).toLocaleDateString()}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-emerald-500/60" />
                <span>Network Views: <span className="text-foreground tabular-nums">{doc.viewCount}</span></span>
              </div>
            </div>
          </div>

          {/* Main Markdown Content */}
          <div className="relative group">
            {/* Decorative vertical line */}
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-border to-transparent hidden lg:block" />
            
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          </div>

          {/* Tags Footer */}
          {doc.tags?.length > 0 && (
            <div className="mt-20 pt-8 border-t border-border/50 flex flex-wrap gap-3">
              {doc.tags.map((t: any) => (
                <div key={t.tag.id} className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
                  <Tag className="h-3 w-3 text-primary/40" />
                  <span>{t.tag.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Page Footer Decoration */}
          <div className="mt-32 pb-12 flex items-center gap-6 opacity-20 grayscale grayscale-100">
             <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black">KB</div>
             <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">Internal Infrastructure Protocol</span>
               <span className="text-[8px] font-mono tracking-widest">ENCRYPTED // SECURE // DISTRIBUTED</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
