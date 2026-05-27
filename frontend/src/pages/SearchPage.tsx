import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchDocs } from '../api/search.api';
import { Search, Tag, Folder } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchDocs({ q: query }),
    enabled: !!query,
  });

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border bg-card px-8 py-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
          <Search className="h-6 w-6 text-primary" />
          <span>Search Results</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing results for <span className="text-primary font-bold">"{query}"</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {isLoading ? (
            <div className="text-center text-muted-foreground/70">Searching...</div>
          ) : data?.data.length === 0 ? (
            <div className="text-center text-muted-foreground">No documents found matching your search.</div>
          ) : (
            data?.data.map((doc: any) => (
              <div key={doc.id} className="rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 shadow-sm">
                <Link to={`/docs/${doc.slug}`} className="text-xl font-bold text-primary hover:underline">
                  {doc.title}
                </Link>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground/70">
                  <div className="flex items-center gap-1">
                    <Folder className="h-3 w-3" />
                    <span>{doc.category?.name || 'Uncategorized'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {doc.tags?.map((t: any) => (
                      <span key={t.tag.name} className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {t.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div 
                  className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: doc.highlightedExcerpt }}
                />
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-[10px] font-mono text-muted-foreground/70">
                    Last updated {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                  <Link to={`/docs/${doc.slug}`} className="text-xs font-semibold text-primary hover:text-primary/80">
                    Read Runbook →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
