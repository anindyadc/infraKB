import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoc, updateDoc } from '../api/docs.api';
import { uploadAttachment } from '../api/attachments.api';
import MarkdownEditor, { MarkdownEditorHandle } from '../components/editor/MarkdownEditor';
import { Save, X, ChevronLeft, Image as ImageIcon } from 'lucide-react';

export default function DocEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const editorHandleRef = useRef<MarkdownEditorHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: doc, isLoading } = useQuery({
    queryKey: ['doc', slug],
    queryFn: () => getDoc(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (doc) {
      setContent(doc.content);
      setTitle(doc.title);
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
    mutation.mutate({ title, content });
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

  if (isLoading) return <div className="p-10 text-center text-[#484f58]">Loading...</div>;

  return (
    <div className="flex h-full flex-col bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-[#8b949e] hover:text-[#e6edf3]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-lg font-bold text-[#e6edf3] focus:outline-none"
            placeholder="Document Title"
          />
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
            className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-md bg-[#10b981] px-3 py-1.5 text-xs font-bold text-[#0d1117] hover:bg-[#0d9268] disabled:opacity-50"
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
