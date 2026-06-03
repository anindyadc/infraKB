import { useUIStore } from '../../store/ui.store';
import { X, Folder, Sparkles, Hash, FileUp, ChevronRight, Save } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categories.api';

interface NewDocBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (val: string) => void;
  categoryId: number | '';
  onCategoryChange: (id: number) => void;
  tags: string;
  onTagsChange: (val: string) => void;
  onSave: () => void;
  isPending: boolean;
  onImport?: () => void;
}

export default function NewDocBottomSheet({
  isOpen,
  onClose,
  title,
  onTitleChange,
  categoryId,
  onCategoryChange,
  tags,
  onTagsChange,
  onSave,
  isPending,
  onImport
}: NewDocBottomSheetProps) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <div className={`
      fixed inset-0 z-[200] flex items-end justify-center md:hidden transition-all duration-300 ease-in-out
      ${isOpen ? 'visible' : 'invisible'}
    `}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className={`
        relative w-full bg-card border-t border-border rounded-t-[3rem] p-10 shadow-2xl transition-transform duration-300 ease-out safe-area-inset-bottom
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* Drag Handle */}
        <div className="flex justify-center -mt-6 mb-10">
          <div className="w-16 h-1.5 rounded-full bg-muted-foreground/10" />
        </div>

        <div className="space-y-10">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                 <div className="h-1 w-4 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Deployment Hub</span>
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">Initialize Node</h3>
            </div>
            <button 
              onClick={onClose} 
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground active:scale-90 transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-1">Entity Primary Key (Title)</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="DOC_TITLE_INPUT"
                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 text-lg font-black text-foreground outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all placeholder:opacity-20"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-1 flex items-center gap-2">
                <Folder className="h-3 w-3 text-primary/60" />
                Registry Hierarchy
              </label>
              <div className="relative">
                <select 
                  value={categoryId}
                  onChange={(e) => onCategoryChange(Number(e.target.value))}
                  className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest text-foreground outline-none appearance-none cursor-pointer focus:border-primary/30"
                >
                  <option value={0}>/ ROOT_DIRECTORY</option>
                  {categories?.categories?.map((cat: any) => (
                    <optgroup key={cat.id} label={cat.name.toUpperCase()} className="bg-card">
                      <option value={cat.id}>/ {cat.name.toUpperCase()}</option>
                      {cat.children?.map((child: any) => (
                        <option key={child.id} value={child.id}>
                          &nbsp;&nbsp;{'>'} {child.name.toUpperCase()}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                   <ChevronRight className="h-4 w-4 rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-1 flex items-center gap-2">
                <Hash className="h-3 w-3 text-primary/60" />
                System Tags
              </label>
              <input 
                type="text" 
                value={tags}
                onChange={(e) => onTagsChange(e.target.value)}
                placeholder="prod, linux, automation"
                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 text-sm font-black text-foreground outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all placeholder:opacity-20 uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <button 
              onClick={onImport}
              className="w-full h-16 bg-muted border border-border text-foreground rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-muted/70"
            >
              <FileUp className="h-5 w-5 text-primary/60" />
              <span>Bulk Import Mode</span>
            </button>
            <button 
              onClick={onSave}
              disabled={isPending}
              className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? (
                <div className="h-5 w-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>Commit Protocol</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
