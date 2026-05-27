import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

export const renderMarkdown = (content: string): string => {
  const renderer = new marked.Renderer();

  renderer.code = (code, language) => {
    const validLanguage = language && hljs.getLanguage(language) ? language : 'plaintext';
    const highlighted = hljs.highlight(code, { language: validLanguage }).value;
    return `<div class="code-wrap my-4 overflow-hidden rounded-lg border border-border bg-muted/30">
      <div class="flex items-center justify-between border-b border-border bg-muted/80 px-4 py-2">
        <span class="font-mono text-xs font-bold uppercase tracking-widest text-primary">${validLanguage}</span>
        <button class="copy-btn rounded border border-border bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors">copy</button>
      </div>
      <pre class="p-4 overflow-x-auto text-sm leading-relaxed"><code class="hljs language-${validLanguage}">${highlighted}</code></pre>
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
