import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Database } from 'lucide-react';
import { suggestDocs } from '../../api/search.api';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        setLoading(true);
        try {
          const results = await suggestDocs(debouncedQuery);
          setSuggestions(results);
          setIsOpen(true);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setLoading(false);
        }
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
    <div ref={containerRef} className="relative w-full group">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground/50" />
          )}
        </div>
        <input
          id="global-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="NODE_QUERY_INPUT (/)"
          className="w-full rounded-xl border border-border/50 bg-background/50 py-2.5 pl-11 pr-4 text-xs font-black uppercase tracking-widest text-foreground placeholder-muted-foreground/20 focus:bg-background focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all duration-300"
        />
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-[100] mt-3 rounded-[1.5rem] border border-border/50 bg-card/95 backdrop-blur-2xl p-2 shadow-[0_30px_60px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 border-b border-border/30 mb-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Suggested Entities</span>
          </div>
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                navigate(`/docs/${s.slug}`);
                setIsOpen(false);
              }}
              className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left hover:bg-primary/10 transition-all"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all">
                <Database className="h-4 w-4" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate">{s.title}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">{s.category?.name || 'ROOT'}</span>
              </div>
            </button>
          ))}
          <div className="mt-2 p-3 bg-muted/30 rounded-xl border border-border/20">
             <p className="text-[8px] font-black uppercase tracking-[0.2em] text-center text-muted-foreground/40">Press ENTER for Global Registry Scan</p>
          </div>
        </div>
      )}
    </div>
  );
}
