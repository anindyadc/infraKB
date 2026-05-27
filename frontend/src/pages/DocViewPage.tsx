import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoc, updateDoc } from '../api/docs.api';
import { useUIStore } from '../store/ui.store';
import { renderMarkdown } from '../lib/markdown';
import { Edit2, Clock, User, Tag, Share2, Trash2, ChevronRight, Hash, Activity, Check, Globe, Lock, MoreVertical } from 'lucide-react';
import 'highlight.js/styles/github.css';

export default function DocViewPage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { setSelectedDocId, setMobilePanel } = useUIStore();

  const { data: doc, isLoading, error } = useQuery({
    queryKey: ['doc', slug],
    queryFn: () => getDoc(slug!),
    enabled: !!slug,
  });

  const mutation = useMutation({
    mutationFn: (newStatus: string) => updateDoc(doc.id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doc', slug] });
    },
  });

  useEffect(() => {
    if (doc) {
      setSelectedDocId(doc.id);
    }
    return () => setSelectedDocId(null);
  }, [doc, setSelectedDocId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyPublicLink = () => {
    const publicUrl = `${window.location.origin}/share/${doc.slug}`;
    navigator.clipboard.writeText(publicUrl);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

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
      {/* Desktop Breadcrumb Header */}
      <div className="hidden lg:flex items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-3 z-10">
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
          <button 
            onClick={handleShare}
            className={`flex items-center justify-center h-9 w-9 rounded-xl border transition-all active:scale-90 ${
              isCopied 
                ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-500' 
                : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            title="Share Document Link"
          >
            {isCopied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>
          <button className="flex items-center justify-center h-9 w-9 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/60 hover:text-white hover:bg-destructive transition-all active:scale-90">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Public Link Banner */}
      {doc.status === 'PUBLIC' && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 lg:px-8 py-2 flex items-center justify-between animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            <Globe className="h-3 w-3" />
            <span>Public Access Enabled</span>
          </div>
          <button 
            onClick={handleCopyPublicLink}
            className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            {isLinkCopied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/10 pb-20 lg:pb-0">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-16 lg:py-16">
          {/* Document Title Section */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => mutation.mutate(doc.status === 'PUBLIC' ? 'PUBLISHED' : 'PUBLIC')}
                disabled={mutation.isPending}
                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                  doc.status === 'PUBLIC' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
                    : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                }`}
              >
                {doc.status === 'PUBLIC' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {mutation.isPending ? 'Syncing...' : (doc.status === 'PUBLIC' ? 'Public' : 'Private')}
              </button>
              <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {doc.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-4 text-[10px] font-black uppercase tracking-[0.15em]">
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
                <span>Views: <span className="text-foreground tabular-nums">{doc.viewCount}</span></span>
              </div>
            </div>
          </div>

          {/* Main Markdown Content */}
          <div className="relative group">
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-border to-transparent hidden lg:block" />
            <div className="prose dark:prose-invert max-w-none prose-pre:p-0" dangerouslySetInnerHTML={{ __html: html }} />
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

          {/* Mobile Action Bar */}
          <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
             <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all">
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
             </button>
             <Link to={`/docs/${doc.slug}/edit`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Node</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
