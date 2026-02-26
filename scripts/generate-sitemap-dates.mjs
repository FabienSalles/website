import { execFileSync } from 'child_process';
import { writeFileSync } from 'fs';
import { glob } from 'glob';

const dates = {};

// Blog posts (.md and .mdx)
const blogFiles = await glob('src/content/blog/**/*.{md,mdx}');
for (const file of blogFiles) {
  try {
    const gitDate = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { encoding: 'utf-8' }).trim();
    if (gitDate) {
      // src/content/blog/2023/06/05-slug.md → /blog/2023/06/05-slug/
      const url = file.replace('src/content/blog/', '/blog/').replace(/\.mdx?$/, '/');
      dates[url] = gitDate;
    }
  } catch {
    // File not in git yet, skip
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
