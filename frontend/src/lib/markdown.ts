import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

export const renderMarkdown = (content: string): string => {
  const renderer = new marked.Renderer();

  renderer.code = (code, language) => {
    const validLanguage = language && hljs.getLanguage(language) ? language : 'plaintext';
    const highlighted = hljs.highlight(code, { language: validLanguage }).value;
    return `<div class="code-wrap my-4 overflow-hidden rounded-lg border border-[#30363d] bg-[#0d1117]">
      <div class="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2">
        <span class="font-mono text-xs font-bold uppercase tracking-widest text-[#10b981]">${validLanguage}</span>
        <button class="copy-btn rounded border border-[#30363d] bg-[#21262d] px-2 py-1 font-mono text-[10px] text-[#8b949e] hover:text-[#10b981]">copy</button>
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
      info: 'border-[#58a6ff] bg-[#58a6ff]/5 text-[#58a6ff]',
      warn: 'border-[#d29922] bg-[#d29922]/5 text-[#d29922]',
      critical: 'border-[#f85149] bg-[#f85149]/5 text-[#f85149]',
      tip: 'border-[#10b981] bg-[#10b981]/5 text-[#10b981]',
    };

    return `<div class="callout my-4 rounded-md border-l-4 p-4 text-sm leading-relaxed ${colors[type as keyof typeof colors]}">
      ${content}
    </div>`;
  };

  const rawHtml = marked.parse(content, { renderer }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
};
