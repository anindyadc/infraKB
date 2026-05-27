import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Database, Loader2, ChevronRight } from 'lucide-react';
import { suggestDocs } from '../../api/search.api';
import { useDebounce } from '../../hooks/useDebounce';
import { useUIStore } from '../../store/ui.store';

export default function SearchOverlay() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isSearchOverlayOpen, setSearchOverlayOpen } = useUIStore();

  useEffect(() => {
    if (isSearchOverlayOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOverlayOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        setLoading(true);
        try {
          const results = await suggestDocs(debouncedQuery);
          setSuggestions(results);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelect = (slug: string) => {
    navigate(`/docs/${slug}`);
    setSearchOverlayOpen(false);
    setQuery('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchOverlayOpen(false);
      setQuery('');
    }
  };

  return (
    <div className={`
      fixed inset-0 z-[200] bg-background flex flex-col transition-all duration-300 ease-in-out
      ${isSearchOverlayOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-4'}
    `}>
      {/* Search Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card safe-area-inset-top">
        <button 
          onClick={() => setSearchOverlayOpen(false)}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground active:scale-90 transition-transform"
        >
          <X className="h-6 w-6" />
        </button>
        
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search runbooks..."
            className="w-full bg-transparent text-base font-bold uppercase tracking-widest text-foreground outline-none placeholder:text-muted-foreground/30"
          />
        </form>

        {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
      </div>

      {/* Results / Suggestions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {query.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 grayscale">
            <Search className="h-16 w-16 mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Start typing to scan registry</p>
          </div>
        ) : suggestions.length === 0 && !loading ? (
          <div className="text-center py-10 text-muted-foreground/50">
            <p className="text-xs font-black uppercase tracking-widest text-destructive/70">No nodes matched query</p>
          </div>
        ) : (
          suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.slug)}
              className="w-full group flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-4 text-left active:scale-[0.98] transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all">
                <Database className="h-5 w-5" />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="text-sm font-black uppercase tracking-tight text-foreground truncate">{s.title}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{s.category?.name || 'ROOT'}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
            </button>
          ))
        )}
      </div>

      {/* Hint Footer */}
      <div className="p-6 border-t border-border/50 bg-muted/20">
         <p className="text-[9px] font-black uppercase tracking-[0.25em] text-center text-muted-foreground/40">
           Tap ENTER for global registry scan
         </p>
      </div>
    </div>
  );
}
