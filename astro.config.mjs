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
import sitemapDates from './src/data/sitemap-dates.json';

export default defineConfig({
  site: 'https://fabiensalles.com',
  integrations: [
    tailwind(),
    react(),
    mdx(),
    icon(),
    sitemap({
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