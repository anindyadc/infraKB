import { useUIStore } from '../../store/ui.store';
import { X, Folder, Sparkles, Hash } from 'lucide-react';
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
  isPending
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
        relative w-full bg-card border-t border-border rounded-t-[2.5rem] p-8 shadow-2xl transition-transform duration-300 ease-out safe-area-inset-bottom
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* Drag Handle */}
        <div className="flex justify-center -mt-4 mb-8">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                 <Sparkles className="h-3 w-3 text-primary" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">System Protocol</span>
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground leading-none">Initialize Node</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-muted/50 text-muted-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Entity Name</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="DOC_TITLE_INPUT"
                className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-base font-bold text-foreground outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1 flex items-center gap-2">
                <Folder className="h-3 w-3" />
                Category Mapping
              </label>
              <select 
                value={categoryId}
                onChange={(e) => onCategoryChange(Number(e.target.value))}
                className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-base font-bold text-foreground outline-none appearance-none"
              >
                <option value={0}>/ ROOT_DIRECTORY</option>
                {categories?.map((cat: any) => (
                  <optgroup key={cat.id} label={cat.name.toUpperCase()}>
                    <option value={cat.id}>/ {cat.name.toUpperCase()}</option>
                    {cat.children?.map((child: any) => (
                      <option key={child.id} value={child.id}>
                        &nbsp;&nbsp;{'>'} {child.name.toUpperCase()}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1 flex items-center gap-2">
                <Hash className="h-3 w-3" />
                Tag Classification
              </label>
              <input 
                type="text" 
                value={tags}
                onChange={(e) => onTagsChange(e.target.value)}
                placeholder="linux, shell, infrastructure"
                className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-base font-bold text-foreground outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <button 
            onClick={onSave}
            disabled={isPending}
            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isPending ? 'Syncing...' : 'Deploy Runbook'}
          </button>
        </div>
      </div>
    </div>
  );
}
