import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

/**
 * Premium Markdown Renderer
 * Designed to match high-end documentation standards (Vercel, Stripe, Tailwind)
 */
export const renderMarkdown = (content: string): string => {
  const renderer = new marked.Renderer();

  // 1. Enhanced Code Block Renderer
  renderer.code = (code, language) => {
    const validLanguage = language && hljs.getLanguage(language) ? language : 'plaintext';
    const highlighted = hljs.highlight(code, { language: validLanguage }).value;
    
    // Base64 encode the code to safely pass it to the onclick handler without escaping hell
    const b64Code = btoa(unescape(encodeURIComponent(code)));
    
    return `<div class="code-block-container my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-xl transition-all duration-300 h-auto"><div class="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.02] px-5 py-2"><div class="flex items-center gap-3"><div class="flex gap-1.5"><div class="h-2 w-2 rounded-full bg-white/10"></div><div class="h-2 w-2 rounded-full bg-white/10"></div><div class="h-2 w-2 rounded-full bg-white/10"></div></div><span class="ml-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">${validLanguage}</span></div><button class="copy-btn group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[9px] font-bold tracking-tight text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-white transition-all active:scale-95" onclick="window.__copyCode(this, '${b64Code}')"><span class="btn-text">COPY</span></button></div><pre class="scrollbar-thin scrollbar-thumb-white/10 overflow-x-auto text-[13.5px] leading-[1.6] text-zinc-100 selection:bg-primary/30 py-3"><code class="hljs language-${validLanguage} font-mono inline-block min-w-full px-5">${highlighted}</code></pre></div>`;
  };

  // 2. Enhanced Callout Renderer
  renderer.blockquote = (quote) => {
    let type = 'info';
    if (quote.includes('⚠️') || quote.includes('Warning')) type = 'warn';
    else if (quote.includes('🚨') || quote.includes('Critical')) type = 'critical';
    else if (quote.includes('💡') || quote.includes('Tip')) type = 'tip';

    const colors = {
      info: 'border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400',
      warn: 'border-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400',
      critical: 'border-red-500 bg-red-500/5 text-red-600 dark:text-red-400',
      tip: 'border-primary bg-primary/5 text-primary-600 dark:text-primary-400',
    };

    return `<div class="callout my-6 rounded-xl border-l-[5px] p-5 text-[14.5px] leading-relaxed ${colors[type as keyof typeof colors]} shadow-sm shadow-black/5">
      ${quote}
    </div>`;
  };

  const rawHtml = marked.parse(content, { renderer }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
};
