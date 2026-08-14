import { defineConfig } from 'astro/config';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import fs from 'node:fs';
import path from 'node:path';
import sitemapDates from './src/data/sitemap-dates.json';

const BLOG_DIR = './src/content/blog';

const collectNoindexedPosts = (dir) => {
  const excluded = new Set();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const nested of collectNoindexedPosts(full)) excluded.add(nested);
      continue;
    }
    if (!/\.mdx?$/.test(entry.name)) continue;
    const frontmatter = fs.readFileSync(full, 'utf-8').split('---')[1] ?? '';
    if (!/^\s*(noindex|draft):\s*true\s*$/m.test(frontmatter)) continue;
    const slug = full.replace(/^.*content\/blog\//, '').replace(/\.mdx?$/, '');
    excluded.add(`/blog/${slug}/`);
  }
  return excluded;
};

const excludedPaths = collectNoindexedPosts(BLOG_DIR);

export default defineConfig({
  site: 'https://fabiensalles.com',
  integrations: [
    tailwind(),
    react(),
    mdx(),
    icon(),
    sitemap({
      filter(page) {
        const { pathname } = new URL(page);
        if (pathname.startsWith('/blog/categories/')) return false;
        return !excludedPaths.has(decodeURIComponent(pathname));
      },
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (sitemapDates[path]) {
          item.lastmod = new Date(sitemapDates[path]);
        }
        return item;
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"]
      }
    }),
  ],
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [rehypeAutolinkHeadings, {
        behavior: 'append',
        properties: { class: 'heading-anchor', ariaLabel: 'Lien direct vers cette section' },
        content: { type: 'text', value: '#' },
      }],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true
    }
  }
});