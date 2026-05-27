import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDoc } from '../api/docs.api';
import { useUIStore } from '../store/ui.store';
import { renderMarkdown } from '../lib/markdown';
import { Edit2, Clock, User, Tag, Share2, Trash2 } from 'lucide-react';
import 'highlight.js/styles/github.css'; // Changed to GitHub light by default, dark mode handles it if we want

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

  if (isLoading) return <div className="p-10 text-center text-muted-foreground/70">Loading runbook...</div>;
  if (error || !doc) return <div className="p-10 text-center text-destructive">Document not found</div>;

  const html = renderMarkdown(doc.content);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border bg-card px-8 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground/70">
          <span>infrakb</span>
          <span>/</span>
          <span className="text-primary font-bold">{doc.category?.name || 'Uncategorized'}</span>
          <span>/</span>
          <span className="text-foreground">{doc.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/docs/${doc.slug}/edit`}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Link>
          <button className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center gap-2 rounded-md border border-destructive/30 bg-background px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto max-w-4xl px-8 py-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{doc.title}</h1>
          
          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-8">
            <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <User className="h-3.5 w-3.5" />
              <span>{doc.author.displayName}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
            {doc.osEnv && (
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary/80">
                <span className="font-mono">OS:</span>
                <span>{doc.osEnv}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
              <span>{doc.viewCount} views</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="prose dark:prose-invert max-w-none md-body" dangerouslySetInnerHTML={{ __html: html }} />
          </div>

          {doc.tags?.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
              {doc.tags.map((t: any) => (
                <div key={t.tag.id} className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  <span>{t.tag.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
