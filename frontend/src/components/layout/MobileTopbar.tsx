import { Menu, Search, Edit2, ChevronLeft } from 'lucide-react';
import { useUIStore } from '../../store/ui.store';
import { useQuery } from '@tanstack/react-query';
import { getDoc } from '../../api/docs.api';
import { useParams, useNavigate } from 'react-router-dom';

export default function MobileTopbar() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { 
    setSidebarDrawerOpen, 
    setSearchOverlayOpen, 
    mobilePanel, 
    setMobilePanel,
    selectedDocId 
  } = useUIStore();

  const { data: doc } = useQuery({
    queryKey: ['doc', slug],
    queryFn: () => getDoc(slug!),
    enabled: !!slug && mobilePanel === 'viewer',
  });

  const handleBack = () => {
    if (mobilePanel === 'editor') {
      setMobilePanel('viewer');
    } else if (mobilePanel === 'viewer') {
      setMobilePanel('list');
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center gap-3 px-4 bg-card/80 backdrop-blur-md border-b border-border lg:hidden safe-area-inset-top">
      {/* Left Action */}
      {mobilePanel !== 'list' ? (
        <button onClick={handleBack} className="p-2 -ml-2 text-muted-foreground hover:text-foreground active:scale-90 transition-transform">
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <button onClick={() => setSidebarDrawerOpen(true)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground active:scale-90 transition-transform">
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Center Title */}
      <div className="flex-1 overflow-hidden">
        <span className="block text-sm font-black uppercase tracking-widest text-foreground truncate">
          {mobilePanel === 'viewer' && doc ? doc.title : (mobilePanel === 'editor' ? 'Editing node' : 'InfraKB')}
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <button onClick={() => setSearchOverlayOpen(true)} className="p-2 text-muted-foreground hover:text-foreground">
          <Search className="h-5 w-5" />
        </button>
        {mobilePanel === 'viewer' && selectedDocId && (
          <button onClick={() => setMobilePanel('editor')} className="p-2 text-primary hover:text-primary/80">
            <Edit2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}
