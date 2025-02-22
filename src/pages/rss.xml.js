import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return rss({
    title: 'Fabien Salles - Blog',
    description: 'Articles sur l\'artisanat logiciel, le développement et les bonnes pratiques',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}`,
      categories: post.data.categories,
    })),
    customData: `<language>fr</language>`,
  });
}