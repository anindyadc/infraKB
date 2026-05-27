import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createDoc } from '../api/docs.api';
import { getCategories } from '../api/categories.api';
import MarkdownEditor from '../components/editor/MarkdownEditor';
import { Save, X, ChevronLeft, Folder } from 'lucide-react';

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
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-lg font-bold text-foreground focus:outline-none"
              placeholder="Document Title"
            />
            <div className="flex items-center gap-2 mt-0.5">
              <Folder className="h-3 w-3 text-muted-foreground" />
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="bg-transparent text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary outline-none cursor-pointer"
              >
                <option value={0}>Uncategorized</option>
                {categories?.map((cat: any) => (
                  <optgroup key={cat.id} label={cat.name}>
                    <option value={cat.id}>{cat.name} (Main)</option>
                    {cat.children?.map((child: any) => (
                      <option key={child.id} value={child.id}>
                        &nbsp;&nbsp;{child.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{mutation.isPending ? 'Creating...' : 'Create Runbook'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
}
