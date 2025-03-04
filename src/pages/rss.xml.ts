import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: any; }) {
  const posts = await getCollection('blog');

  const latestPosts = posts
    .filter((post: any) => !post.data.draft)
    .map((post: any) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
      categories: post.data.categories,
    }))
    .sort((a: any, b: any) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 20);

  return rss({
    title: "Fabien Salles - Blog",
    description:"Articles sur l'artisanat logiciel, le développement et les bonnes pratiques",
    site: context.site,
    items: latestPosts,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: `
      <language>fr</language>
      <atom:link href="${context.site}rss.xml/" rel="self" type="application/rss+xml"/>
    `
  });
}