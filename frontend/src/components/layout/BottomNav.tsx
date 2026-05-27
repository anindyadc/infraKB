import { LayoutGrid, Search, Plus, User, Tag } from 'lucide-react';
import { useUIStore } from '../../store/ui.store';
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const { mobilePanel, setMobilePanel, setSearchOverlayOpen } = useUIStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-card/80 backdrop-blur-md border-t border-border flex items-center justify-around px-2 md:hidden safe-area-inset-bottom">
      <NavItem 
        icon={LayoutGrid} 
        label="Docs" 
        active={mobilePanel === 'list'} 
        onClick={() => {
          setMobilePanel('list');
          navigate('/');
        }} 
      />
      <NavItem 
        icon={Search} 
        label="Search" 
        onClick={() => setSearchOverlayOpen(true)} 
      />

      {/* FAB - New Runbook */}
      <div className="relative -mt-10">
        <button
          onClick={() => navigate('/docs/new')}
          className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/40 active:scale-90 transition-all ring-4 ring-background"
          title="New Runbook"
        >
          <Plus className="h-7 w-7 stroke-[3px]" />
        </button>
      </div>

      <NavItem 
        icon={Tag} 
        label="Tags" 
        onClick={() => {}} // TODO: Implement tags sheet
      />
      <NavItem 
        icon={User} 
        label="Me" 
        onClick={() => navigate('/admin')} // Quick link to admin/profile
      />
    </nav>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
    >
      <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
