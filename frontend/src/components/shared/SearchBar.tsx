import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { suggestDocs } from '../../api/search.api';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        const results = await suggestDocs(debouncedQuery);
        setSuggestions(results);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#484f58]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search docs... (/)"
          className="w-full rounded-md border border-[#30363d] bg-[#0d1117] py-1.5 pl-9 pr-3 text-xs text-[#e6edf3] placeholder-[#484f58] focus:border-[#10b981] focus:outline-none focus:ring-1 focus:ring-[#10b981]"
        />
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-md border border-[#30363d] bg-[#161b22] p-1 shadow-2xl">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                navigate(`/docs/${s.slug}`);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-[#21262d]"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#e6edf3]">{s.title}</span>
                <span className="text-[10px] text-[#484f58]">{s.category?.name || 'Uncategorized'}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
