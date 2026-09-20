import {describe, it, expect} from 'vitest';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const collectHtmlFiles = (dir: string): string[] => {
  return readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(fullPath);
    return entry.name === 'index.html' ? [fullPath] : [];
  });
};

const stripArticleBody = (html: string): string => {
  const opening = /<div class="prose prose-lg[^"]*"[^>]*>/.exec(html);
  if (!opening) return html;

  let depth = 0;
  let cursor = opening.index;
  while (cursor < html.length) {
    if (html.startsWith('<div', cursor)) {
      depth++;
      cursor += 4;
      continue;
    }
    if (html.startsWith('</div>', cursor)) {
      depth--;
      cursor += 6;
      if (depth === 0) return html.slice(0, opening.index) + html.slice(cursor);
      continue;
    }
    cursor++;
  }
  return html;
};

// Layout chrome (nav/footer in src/layouts/Layout.astro) and article bodies (MDX content
// in src/content/blog/**) sit outside this iteration's impl_files scope (src/pages/, src/components/).
const clickableElements = (html: string): string[] => {
  const withoutChrome = html
    .replace(/<header[\s\S]*?<\/header>/g, '')
    .replace(/<footer[\s\S]*?<\/footer>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '');
  const withoutArticleBody = stripArticleBody(withoutChrome);

  return [...withoutArticleBody.matchAll(/<(a|button)\b[^>]*>/g)]
    .filter(match => match[1] !== 'a' || /\shref="/.test(match[0]))
    .map(match => match[0]);
};

describe('Click tagging (built pages)', () => {
  const pages = collectHtmlFiles('dist');

  it('builds pages to check', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it.each(pages)('tags every clickable element with a non-empty type, location and label on %s', file => {
    const elements = clickableElements(readFileSync(file, 'utf-8'));

    for (const element of elements) {
      expect(element).toContain('data-umami-event="Click"');
      expect(element).toMatch(/data-umami-event-type="[^"]+"/);
      expect(element).toMatch(/data-umami-event-location="[^"]+"/);
      expect(element).toMatch(/data-umami-event-label="[^"]+"/);
    }
  });
});
