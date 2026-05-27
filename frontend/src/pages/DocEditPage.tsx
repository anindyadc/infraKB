import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoc, updateDoc } from '../api/docs.api';
import { getCategories } from '../api/categories.api';
import { uploadAttachment } from '../api/attachments.api';
import MarkdownEditor, { MarkdownEditorHandle } from '../components/editor/MarkdownEditor';
import { Save, X, ChevronLeft, Image as ImageIcon, Folder, Terminal, Hash } from 'lucide-react';
import NewDocBottomSheet from '../components/layout/NewDocBottomSheet';

export default function DocEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>(0);
  const [tags, setTags] = useState('');
  const [showMetaSheet, setShowMetaSheet] = useState(false);
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
      setTags(doc.tags?.map((t: any) => t.tag.name).join(', ') || '');
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
      categoryId: categoryId === '' || categoryId === 0 ? null : categoryId,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== '')
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

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-full opacity-30 animate-pulse">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Opening Modification Buffer...</span>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-6 flex-1">
          <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-1">
               <Terminal className="h-3 w-3 text-primary/60" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Modification Mode</span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-2xl font-black text-foreground focus:outline-none tracking-tighter placeholder:opacity-20"
              placeholder="ENTITY_TITLE_INPUT"
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

              <div className="w-px h-3 bg-border/50 mx-1" />
              <Hash className="h-3 w-3 text-primary/40" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="TAGS_CSV (e.g. linux, nginx)"
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 focus:text-primary focus:outline-none w-48 transition-colors"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Asset</span>
          </button>
          <div className="w-px h-6 bg-border/50 mx-2" />
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="h-3.5 w-3.5" />
            <span>Abort</span>
          </button>
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{mutation.isPending ? 'Syncing...' : 'Commit Changes'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Meta Bottom Sheet */}
      <NewDocBottomSheet 
        isOpen={showMetaSheet}
        onClose={() => setShowMetaSheet(false)}
        title={title}
        onTitleChange={setTitle}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        tags={tags}
        onTagsChange={setTags}
        onSave={handleSave}
        isPending={mutation.isPending}
      />
      
      <div className="flex-1 overflow-hidden bg-[#0d1117]/30 backdrop-blur-sm relative">
        <MarkdownEditor ref={editorHandleRef} value={content} onChange={setContent} />
        
        {/* Mobile FAB to show meta sheet */}
        <button 
          onClick={() => setShowMetaSheet(true)}
          className="md:hidden absolute bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center active:scale-90 transition-all z-40"
        >
          <Save className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
