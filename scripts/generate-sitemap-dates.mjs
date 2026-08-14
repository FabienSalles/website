import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const dates = {};

// Google only honours lastmod when it can verify it against the page itself,
// so posts declare their own date rather than inheriting the commit date:
// a typo fix would otherwise mark every touched article as freshly updated.
const readFrontmatterDate = (file) => {
  const frontmatter = readFileSync(file, 'utf-8').split('---')[1] ?? '';
  const updated = frontmatter.match(/^\s*updatedDate:\s*['"]?([\d-]+)/m);
  const published = frontmatter.match(/^\s*pubDate:\s*['"]?([\d-]+)/m);
  const date = (updated ?? published)?.[1];
  return date ? new Date(`${date}T00:00:00Z`).toISOString() : null;
};

// Blog posts (.md and .mdx)
const blogFiles = await glob('src/content/blog/**/*.{md,mdx}');
for (const file of blogFiles) {
  const date = readFrontmatterDate(file);
  if (date) {
    // src/content/blog/2023/06/05-slug.md → /blog/2023/06/05-slug/
    const url = file.replace('src/content/blog/', '/blog/').replace(/\.mdx?$/, '/');
    dates[url] = date;
  }
}

// Static pages (excluding dynamic routes with [...] or [param])
const pageFiles = await glob('src/pages/**/*.astro', { ignore: ['**/*[*'] });
for (const file of pageFiles) {
  try {
    const gitDate = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { encoding: 'utf-8' }).trim();
    if (gitDate) {
      let url = file.replace('src/pages', '').replace('.astro', '').replace('/index', '') || '/';
      if (!url.endsWith('/')) url += '/';
      dates[url] = gitDate;
    }
  } catch {
    // File not in git yet, skip
  }
}

writeFileSync('src/data/sitemap-dates.json', JSON.stringify(dates, null, 2));
console.log(`Generated sitemap dates for ${Object.keys(dates).length} URLs`);
