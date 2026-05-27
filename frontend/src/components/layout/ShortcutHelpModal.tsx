import { X, Search, Plus, PanelLeft, PanelRight, Keyboard, Info } from 'lucide-react';
import { useUIStore } from '../../store/ui.store';

export default function ShortcutHelpModal() {
  const { isHelpModalOpen, setHelpModalOpen } = useUIStore();

  if (!isHelpModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 overflow-hidden relative">
        {/* Background decorative blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="flex justify-between items-center mb-10 relative">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">System Interface</span>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">Keyboard Maps</h3>
          </div>
          <button 
            onClick={() => setHelpModalOpen(false)} 
            className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 relative">
          <div className="space-y-4">
             <SectionHeader label="Navigation & Layout" />
             <ShortcutItem kbd="/" label="Focus Registry Search" icon={Search} />
             <ShortcutItem kbd="[" label="Toggle Sidebar (Nav)" icon={PanelLeft} />
             <ShortcutItem kbd="]" label="Toggle Registry (Docs)" icon={PanelRight} />
             <ShortcutItem kbd="Esc" label="Exit Search / Close Modal" />
          </div>

          <div className="space-y-4">
             <SectionHeader label="Operations" />
             <ShortcutItem kbd="N" label="Initialize New Runbook" icon={Plus} />
             <ShortcutItem kbd="?" label="Toggle this Help Menu" icon={Info} />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 text-center opacity-30">
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">Ready for input sequence</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 whitespace-nowrap">{label}</span>
      <div className="h-px w-full bg-border/30" />
    </div>
  );
}

function ShortcutItem({ kbd, label, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors uppercase tracking-tight">{label}</span>
      </div>
      <kbd className="min-w-[40px] text-center px-2 py-1.5 rounded-xl border border-border bg-muted/30 font-mono text-[11px] font-black text-primary shadow-sm ring-1 ring-white/5">
        {kbd}
      </kbd>
    </div>
  );
}
