import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: any; }) {
  const posts = await getCollection('blog');

  const latestPosts = posts
    .filter((post: any) => !post.data.draft) // Exclure les drafts
    .sort((a: any, b: any) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()) // Tri du plus récent au plus ancien
    .slice(0, 20);

  return rss({
    title: 'Fabien Salles - Blog',
    description: 'Articles sur l\'artisanat logiciel, le développement et les bonnes pratiques',
    site: context.site,
    items: latestPosts.map((post: any) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
      categories: post.data.categories,
    })),
    customData: `<language>fr</language>`,
  });
}