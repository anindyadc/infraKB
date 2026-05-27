import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

export const renderMarkdown = (content: string): string => {
  const renderer = new marked.Renderer();

  renderer.code = (code, language) => {
    const validLanguage = language && hljs.getLanguage(language) ? language : 'plaintext';
    const highlighted = hljs.highlight(code, { language: validLanguage }).value;
    return `<div class="code-wrap my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl">
      <div class="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
        <span class="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">${validLanguage}</span>
        <button class="copy-btn rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95">COPY</button>
      </div>
      <pre class="p-5 overflow-x-auto text-[13px] leading-relaxed text-zinc-100 selection:bg-primary/30"><code class="hljs language-${validLanguage}">${highlighted}</code></pre>
    </div>`;
  };

  renderer.blockquote = (quote) => {
    let type = 'info';
    let content = quote;
    if (quote.includes('⚠️') || quote.includes('Warning')) type = 'warn';
    else if (quote.includes('🚨') || quote.includes('Critical')) type = 'critical';
    else if (quote.includes('💡') || quote.includes('Tip')) type = 'tip';

    const colors = {
      info: 'border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400',
      warn: 'border-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400',
      critical: 'border-red-500 bg-red-500/5 text-red-600 dark:text-red-400',
      tip: 'border-primary bg-primary/5 text-primary-600 dark:text-primary-400',
    };

    return `<div class="callout my-4 rounded-md border-l-4 p-4 text-sm leading-relaxed ${colors[type as keyof typeof colors]} shadow-sm">
      ${content}
    </div>`;
  };

  const rawHtml = marked.parse(content, { renderer }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
};
