/**
 * Safe, lightweight regex-based Markdown parser to convert basic markdown into HTML.
 * Prevents malicious XSS scripting by escaping tags, while allowing structured tags.
 */
export function parseMarkdownToHtml(markdown: string | null | undefined): string {
  if (!markdown) return 'Chưa có mô tả.';

  // 1. First, escape raw HTML characters to prevent XSS injection
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Parse Headers (# Title, ## Title, ### Title)
  html = html.replace(/^### (.*?)$/gm, '<h4 class="text-sm font-bold text-slate-900 mt-4 mb-2">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 class="text-base font-bold text-slate-800 mt-5 mb-2.5 pb-1 border-b border-slate-100">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 class="text-lg font-extrabold text-slate-950 mt-6 mb-3">$1</h2>');

  // 3. Parse Images: !\[alt_text\]\(image_url\)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
    return `<img src="${url}" alt="${alt}" class="w-full max-w-[800px] h-auto rounded-xl border border-slate-200 shadow-sm my-4 mx-auto block hover:shadow-md transition-shadow" />`;
  });

  // 4. Parse Links: \[link_text\]\(link_url\)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-bold">${text}</a>`;
  });

  // 5. Parse Bold (**text** or __text__)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // 6. Parse Italic (*text* or _text_)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // 7. Parse Tables (Lines starting and ending with '|')
  const lines = html.split('\n');
  let inTable = false;
  let isFirstRow = false;
  const processedLinesAfterTable = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const isSeparator = /^\|[\s\:\-\|]*\|$/.test(line);
      if (isSeparator) {
        continue;
      }
      
      const cells = line.split('|')
        .slice(1, -1)
        .map(c => c.trim());

      if (!inTable) {
        inTable = true;
        isFirstRow = true;
        processedLinesAfterTable.push('<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-slate-200 text-sm"><thead class="bg-slate-50"><tr>');
      } else {
        isFirstRow = false;
      }

      if (isFirstRow) {
        cells.forEach(cell => {
          processedLinesAfterTable.push(`<th class="border border-slate-200 px-4 py-2 text-left font-bold text-slate-800">${cell}</th>`);
        });
        processedLinesAfterTable.push('</tr></thead><tbody class="divide-y divide-slate-100 bg-white">');
      } else {
        processedLinesAfterTable.push('<tr>');
        cells.forEach(cell => {
          processedLinesAfterTable.push(`<td class="border border-slate-200 px-4 py-2 text-slate-600">${cell}</td>`);
        });
        processedLinesAfterTable.push('</tr>');
      }
    } else {
      if (inTable) {
        inTable = false;
        processedLinesAfterTable.push('</tbody></table></div>');
      }
      processedLinesAfterTable.push(lines[i]);
    }
  }
  if (inTable) {
    processedLinesAfterTable.push('</tbody></table></div>');
  }

  // 8. Parse Lists (Lines starting with "- " or "* ")
  let inList = false;
  const processedLinesAfterList = processedLinesAfterTable.map(line => {
    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      const content = listMatch[1];
      if (!inList) {
        inList = true;
        return `<ul class="list-disc pl-5 my-2 space-y-1 text-slate-600 text-sm"><li>${content}</li>`;
      }
      return `<li>${content}</li>`;
    } else {
      if (inList) {
        inList = false;
        return `</ul>\n${line}`;
      }
      return line;
    }
  });
  if (inList) {
    processedLinesAfterList.push('</ul>');
  }

  // 9. Convert remaining newlines to line breaks, grouping non-list lines into paragraph-like divs
  html = processedLinesAfterList.map(line => {
    const trimmed = line.trim();
    // If it's already an HTML block tag from our parser, don't wrap it in p/div
    const isHtmlBlock = 
      trimmed.startsWith('<h') || 
      trimmed.startsWith('<ul') || 
      trimmed.startsWith('<li') || 
      trimmed.startsWith('</ul') || 
      trimmed.startsWith('<img') || 
      trimmed.startsWith('<div') || 
      trimmed.startsWith('</div') || 
      trimmed.startsWith('<table') || 
      trimmed.startsWith('</table') || 
      trimmed.startsWith('<thead') || 
      trimmed.startsWith('</thead') || 
      trimmed.startsWith('<tbody') || 
      trimmed.startsWith('</tbody') || 
      trimmed.startsWith('<tr') || 
      trimmed.startsWith('</tr') || 
      trimmed.startsWith('<td') || 
      trimmed.startsWith('</td') || 
      trimmed.startsWith('<th') || 
      trimmed.startsWith('</th');

    if (isHtmlBlock) {
      return line;
    }
    if (trimmed === '') {
      return '<div class="h-3"></div>';
    }
    return `<p class="mb-2 text-slate-600 text-sm leading-relaxed">${line}</p>`;
  }).join('\n');

  return html;
}
