import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoc, updateDoc } from '../api/docs.api';
import { getCategories } from '../api/categories.api';
import { uploadAttachment } from '../api/attachments.api';
import MarkdownEditor, { MarkdownEditorHandle } from '../components/editor/MarkdownEditor';
import { Save, X, ChevronLeft, Image as ImageIcon, Folder } from 'lucide-react';

export default function DocEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>(0);
  const editorHandleRef = useRef<MarkdownEditorHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: doc, isLoading } = useQuery({
    queryKey: ['doc', slug],
    queryFn: () => getDoc(slug!),
    enabled: !!slug,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (doc) {
      setContent(doc.content);
      setTitle(doc.title);
      setCategoryId(doc.categoryId || 0);
    }
  }, [doc]);

  const mutation = useMutation({
    mutationFn: (data: any) => updateDoc(doc.id, data),
    onSuccess: (updatedDoc) => {
      queryClient.invalidateQueries({ queryKey: ['doc', slug] });
      queryClient.invalidateQueries({ queryKey: ['docs'] });
      navigate(`/docs/${updatedDoc.slug}`);
    },
  });

  const handleSave = () => {
    mutation.mutate({ 
      title, 
      content,
      categoryId: categoryId === '' || categoryId === 0 ? null : categoryId
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !doc) return;
    
    try {
      const attachment = await uploadAttachment(file, doc.id);
      editorHandleRef.current?.insertText(attachment.markdownEmbed);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-muted-foreground/70">Loading...</div>;

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-muted-foreground hover:text-foreground transition-colors"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-muted-foreground hover:text-foreground transition-colors"
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
            <span>{mutation.isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor ref={editorHandleRef} value={content} onChange={setContent} />
      </div>
    </div>
  );
}
