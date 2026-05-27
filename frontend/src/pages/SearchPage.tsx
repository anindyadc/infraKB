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
    <div className="flex h-full flex-col bg-[#0d1117]">
      <div className="border-b border-[#30363d] bg-[#161b22] px-8 py-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-[#e6edf3]">
          <Search className="h-6 w-6 text-[#10b981]" />
          <span>Search Results</span>
        </h1>
        <p className="mt-1 text-sm text-[#8b949e]">
          Showing results for <span className="text-[#10b981]">"{query}"</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {isLoading ? (
            <div className="text-center text-[#484f58]">Searching...</div>
          ) : data?.data.length === 0 ? (
            <div className="text-center text-[#8b949e]">No documents found matching your search.</div>
          ) : (
            data?.data.map((doc: any) => (
              <div key={doc.id} className="rounded-lg border border-[#30363d] bg-[#161b22] p-6 transition-colors hover:border-[#10b981]/30">
                <Link to={`/docs/${doc.slug}`} className="text-xl font-bold text-[#58a6ff] hover:underline">
                  {doc.title}
                </Link>
                <div className="mt-2 flex items-center gap-4 text-xs text-[#484f58]">
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
                  className="mt-4 text-sm leading-relaxed text-[#8b949e] line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: doc.highlightedExcerpt }}
                />
                <div className="mt-4 flex items-center justify-between border-t border-[#30363d] pt-4">
                  <span className="text-[10px] font-mono text-[#484f58]">
                    Last updated {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                  <Link to={`/docs/${doc.slug}`} className="text-xs font-semibold text-[#10b981] hover:text-[#0d9268]">
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
