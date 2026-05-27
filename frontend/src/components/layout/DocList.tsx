import { useQuery } from '@tanstack/react-query';
import { getDocs } from '../../api/docs.api';
import { useUIStore } from '../../store/ui.store';
import { useParams, Link } from 'react-router-dom';

export default function DocList() {
  const { categorySlug } = useParams();
  const { selectedDocId } = useUIStore();
  
  const { data, isLoading } = useQuery({
    queryKey: ['docs', categorySlug],
    queryFn: () => getDocs({ category: categorySlug }),
  });

  return (
    <div className="flex h-screen w-72 flex-col border-r border-[#30363d] bg-[#1c2128]">
      <div className="p-4 border-b border-[#30363d]">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#484f58]">
          {categorySlug || 'All Documents'}
        </h2>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl font-bold text-[#e6edf3]">{data?.pagination.total || 0}</span>
          <span className="text-sm text-[#10b981]">docs</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="p-4 text-center text-xs text-[#484f58]">Loading docs...</div>
        ) : (
          data?.docs.map((doc: any) => (
            <Link
              key={doc.id}
              to={`/docs/${doc.slug}`}
              className={`block rounded-md p-3 transition-colors ${
                doc.id === selectedDocId
                  ? 'bg-[#262c36] border border-[#10b981]/30'
                  : 'hover:bg-[#21262d] border border-transparent'
              }`}
            >
              <h3 className={`text-sm font-medium leading-snug ${doc.id === selectedDocId ? 'text-[#10b981]' : 'text-[#e6edf3]'}`}>
                {doc.title}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-[#58a6ff]/10 px-1.5 py-0.5 text-[10px] font-mono text-[#58a6ff]">
                  {doc.category?.name || 'Uncategorized'}
                </span>
                <span className="ml-auto text-[10px] font-mono text-[#484f58]">
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
