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
    
    return `
      <div class="code-block-container my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl transition-all duration-300 h-auto">
        <!-- Top Bar / Header -->
        <div class="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.03] px-6 py-3">
          <div class="flex items-center gap-3">
            <div class="flex gap-1.5">
              <div class="h-2.5 w-2.5 rounded-full bg-white/10"></div>
              <div class="h-2.5 w-2.5 rounded-full bg-white/10"></div>
              <div class="h-2.5 w-2.5 rounded-full bg-white/10"></div>
            </div>
            <span class="ml-2 font-mono text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
              ${validLanguage}
            </span>
          </div>

          <button 
            class="copy-btn group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] font-bold tracking-tight text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)"
          >
            <span class="group-hover:hidden">COPY</span>
            <span class="hidden group-hover:inline">CLICK TO COPY</span>
          </button>
        </div>

        <!-- Code Content Area: Dynamic Height -->
        <pre class="scrollbar-thin scrollbar-thumb-white/10 overflow-x-auto text-[14px] leading-[1.7] text-zinc-100 selection:bg-primary/30 py-5">
          <code class="hljs language-${validLanguage} font-mono inline-block min-w-full px-6">${highlighted}</code>
        </pre>
      </div>
    `;
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

    return `<div class="callout my-8 rounded-xl border-l-[6px] p-6 text-[15px] leading-relaxed ${colors[type as keyof typeof colors]} shadow-sm shadow-black/5">
      ${quote}
    </div>`;
  };

  const rawHtml = marked.parse(content, { renderer }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
};
