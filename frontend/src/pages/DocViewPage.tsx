import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDoc } from '../api/docs.api';
import { useUIStore } from '../store/ui.store';
import { renderMarkdown } from '../lib/markdown';
import { Edit2, Clock, User, Tag, Share2, Trash2 } from 'lucide-react';
import 'highlight.js/styles/atom-one-dark.css';

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

  if (isLoading) return <div className="p-10 text-center text-[#484f58]">Loading runbook...</div>;
  if (error || !doc) return <div className="p-10 text-center text-red-400">Document not found</div>;

  const html = renderMarkdown(doc.content);

  return (
    <div className="flex h-full flex-col bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-8 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-[#484f58]">
          <span>infrakb</span>
          <span>/</span>
          <span className="text-[#58a6ff]">{doc.category?.name || 'Uncategorized'}</span>
          <span>/</span>
          <span className="text-[#e6edf3]">{doc.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/docs/${doc.slug}/edit`}
            className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Link>
          <button className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]">
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center gap-2 rounded-md border border-red-900/50 bg-[#21262d] px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/20">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto max-w-4xl px-8 py-12">
          <h1 className="text-4xl font-bold tracking-tight text-[#e6edf3]">{doc.title}</h1>
          
          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-[#30363d] pb-8">
            <div className="flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-3 py-1 text-xs text-[#10b981]">
              <User className="h-3.5 w-3.5" />
              <span>{doc.author.displayName}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs text-[#8b949e]">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
            {doc.osEnv && (
              <div className="flex items-center gap-2 rounded-full border border-[#bc8cff]/30 bg-[#bc8cff]/10 px-3 py-1 text-xs text-[#bc8cff]">
                <span className="font-mono">OS:</span>
                <span>{doc.osEnv}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-[#484f58]">
              <span>{doc.viewCount} views</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="prose prose-invert max-w-none md-body" dangerouslySetInnerHTML={{ __html: html }} />
          </div>

          {doc.tags?.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-[#30363d] pt-8">
              {doc.tags.map((t: any) => (
                <div key={t.tag.id} className="flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#161b22] px-2 py-1 text-xs text-[#8b949e]">
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
