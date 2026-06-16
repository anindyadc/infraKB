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
  mutationFn: (data: any) => updateDoc(doc!.id, data),
  onSuccess: (updatedDoc) => {
      queryClient.invalidateQueries({ queryKey: ['doc', slug] });
      queryClient.invalidateQueries({ queryKey: ['docs'] });
      navigate(`/docs/${updatedDoc.slug}`);
    },
    onError: (err: any) => {
      alert(`Sync failed: ${err.message || 'Unknown error'}`);
    }
  });

  const handleSave = () => {
    console.log('DocEditPage: Initiating Commit Protocol...', { title, categoryId, tags });
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
    <div className="flex h-full flex-col bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Desktop Header: Premium Command Bar */}
      <div className="hidden md:flex items-center justify-between border-b border-border/50 bg-card/40 backdrop-blur-xl px-8 py-6 z-20 shadow-2xl">
        <div className="flex items-center gap-8 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="group h-12 w-12 flex items-center justify-center rounded-2xl bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 active:scale-95"
            title="Abort Changes"
          >
            <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
          </button>
          
          <div className="flex flex-col flex-1 max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                 <Terminal className="h-3 w-3 text-amber-500" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">Modification Buffer</span>
               </div>
               <div className="h-px w-8 bg-border/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 font-mono">SYS_ENTITY_UPDATE_V2</span>
            </div>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-3xl font-black text-foreground focus:outline-none tracking-tighter placeholder:text-muted-foreground/20 w-full selection:bg-primary/30"
              placeholder="DOCUMENT_TITLE_STUB"
            />
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/50 group focus-within:border-primary/30 transition-all">
                <Folder className="h-3.5 w-3.5 text-primary/40 group-focus-within:text-primary transition-colors" />
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground outline-none cursor-pointer transition-colors appearance-none"
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
              </div>
              
              <div className="h-4 w-px bg-border/50" />
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/50 group focus-within:border-primary/30 transition-all flex-1 max-w-xs">
                <Hash className="h-3.5 w-3.5 text-primary/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="CLASSIFICATION_TAGS (e.g. prod, linux)"
                  className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground focus:text-foreground focus:outline-none w-full transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden lg:flex items-center gap-2 px-5 py-3 rounded-2xl border border-border bg-background text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all active:scale-95 group"
          >
            <ImageIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Link Asset</span>
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-border bg-background text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all active:scale-95"
          >
            <X className="h-4 w-4" />
            <span>Abort</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-primary text-[11px] font-black uppercase tracking-[0.3em] text-primary-foreground shadow-2xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95 overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-2">
              <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{mutation.isPending ? 'Syncing...' : 'Commit Changes'}</span>
            </div>
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      
      {/* Editor Content Area */}
      <div className="flex-1 overflow-hidden bg-zinc-50 dark:bg-[#0d1117] flex flex-col relative transition-colors duration-500">
        {/* Subtle grid pattern for the IDE feel */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.03] pointer-events-none" />

        <div className="flex-1 overflow-hidden px-4 py-2 lg:px-0">
          <MarkdownEditor ref={editorHandleRef} value={content} onChange={setContent} />
        </div>

        {/* Mobile FAB to show meta sheet */}
        <button 
          onClick={() => setShowMetaSheet(true)}
          className="md:hidden absolute bottom-8 right-8 h-16 w-16 rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-90 transition-all z-40 border-4 border-background"
        >
          <Save className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
