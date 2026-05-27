import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { renderMarkdown } from '../lib/markdown';
import { Clock, User, Tag, Activity, Hash, ChevronRight } from 'lucide-react';
import 'highlight.js/styles/github.css';

// Using raw axios to bypass the authenticated client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export default function PublicDocPage() {
  const { slug } = useParams();
  
  const { data: doc, isLoading, error } = useQuery({
    queryKey: ['public-doc', slug],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/docs/public/${slug}`);
      return data.data;
    },
    enabled: !!slug,
    retry: false
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-background opacity-30 animate-pulse">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Accessing External Node...</span>
    </div>
  );
  
  if (error || !doc) return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-10 text-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
        <Hash className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-black uppercase tracking-tighter">Entity Not Accessible</h2>
      <p className="text-sm text-muted-foreground font-medium max-w-xs">This document does not exist or has no public access permissions enabled.</p>
      <a href="/login" className="mt-4 text-xs font-black uppercase tracking-widest text-primary hover:underline">Return to Workspace</a>
    </div>
  );

  const html = renderMarkdown(doc.content);

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Public Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-4 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20">
            KB
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tighter uppercase text-foreground">InfraKB</span>
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Public Resource</span>
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hidden sm:block">
          External Knowledge Sync
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16 lg:px-16">
          {/* Document Title Section */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                Public Shared Entity
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {doc.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 pt-4 text-[10px] font-black uppercase tracking-[0.15em]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5 text-primary/60" />
                <span>Operator: <span className="text-foreground">{doc.author.displayName}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary/60" />
                <span>Last Sync: <span className="text-foreground">{new Date(doc.updatedAt).toLocaleDateString()}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-emerald-500/60" />
                <span>Global Views: <span className="text-foreground tabular-nums">{doc.viewCount}</span></span>
              </div>
            </div>
          </div>

          {/* Main Markdown Content */}
          <div className="relative">
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          </div>

          {/* Tags Footer */}
          {doc.tags?.length > 0 && (
            <div className="mt-20 pt-8 border-t border-border/50 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest">
              {doc.tags.map((t: any) => (
                <div key={t.tag.id} className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-muted-foreground">
                  <Tag className="h-3 w-3 text-primary/40" />
                  <span>{t.tag.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* External Footer */}
          <div className="mt-32 pb-12 flex flex-col items-center gap-6 border-t border-border/20 pt-12">
             <div className="opacity-20 grayscale flex items-center gap-6">
                <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl">KB</div>
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Internal Infrastructure Protocol</span>
                  <span className="text-[8px] font-mono tracking-widest text-foreground">EXTERNAL_LINK_READ_ONLY // INFRAKB_NODE_V1</span>
                </div>
             </div>
             <p className="text-[10px] text-muted-foreground font-medium max-w-md text-center">
               This is a secure, read-only view of a document shared via InfraKB. For full access to the command center, contact your infrastructure administrator.
             </p>
          </div>
      </div>
    </div>
  );
}
