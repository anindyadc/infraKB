import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createDoc } from '../api/docs.api';
import { getCategories } from '../api/categories.api';
import MarkdownEditor from '../components/editor/MarkdownEditor';
import { Save, X, ChevronLeft, Folder, Terminal, Sparkles } from 'lucide-react';

const DEFAULT_CONTENT = `# New Runbook

## Overview
Describe what this guide does.

## Steps
1. First step
\`\`\`bash
echo "Hello world"
\`\`\`
`;

export default function NewDocPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [title, setTitle] = useState('Untitled Runbook');
  const [categoryId, setCategoryId] = useState<number | ''>(0);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => createDoc(data),
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ['docs'] });
      navigate(`/docs/${newDoc.slug}`);
    },
  });

  const handleSave = () => {
    mutation.mutate({ 
      title, 
      content, 
      categoryId: categoryId === '' || categoryId === 0 ? undefined : categoryId 
    });
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-6 flex-1">
          <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-1">
               <Sparkles className="h-3 w-3 text-primary/60" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Initialization Protocol</span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-2xl font-black text-foreground focus:outline-none tracking-tighter placeholder:opacity-20"
              placeholder="NEW_ENTITY_NAME"
            />
            <div className="flex items-center gap-2 mt-2">
              <Folder className="h-3 w-3 text-primary/40" />
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary outline-none cursor-pointer transition-colors"
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
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="h-3.5 w-3.5" />
            <span>Discard</span>
          </button>
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{mutation.isPending ? 'Deploying...' : 'Publish Runbook'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden bg-[#0d1117]/30 backdrop-blur-sm">
        <MarkdownEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
}
