import 'server-only';
import { type BundledLanguage, codeToHtml } from 'shiki';

/** 服务端把代码渲染为带主题的 HTML,客户端零开销 */
export async function highlightCode(code: string, lang: BundledLanguage = 'tsx'): Promise<string> {
  try {
    return await codeToHtml(code.trim(), { lang, theme: 'vesper' });
  } catch (error) {
    console.error('代码高亮失败,回退为纯文本', error);
    const escaped = code.replace(
      /[&<>]/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] ?? c,
    );
    return `<pre class="shiki"><code>${escaped}</code></pre>`;
  }
}
