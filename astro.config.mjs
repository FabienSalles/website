import { defineConfig } from 'astro/config';
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
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});