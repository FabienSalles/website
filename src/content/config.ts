import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    categories: z.array(z.string()),
    linkedinPostUrl: z.string().url().optional(),
    service: z.enum([
      'formation-phpunit', 'formation-ddd', 'formation-git',
      'audit', 'accompagnement', 'automatisation',
    ]).optional(),
    series: z.enum(['ego', 'audit']).optional(),
    tldr: z.string().optional(),
    draft: z.boolean().default(false),
    noindex: z.boolean().default(false),
  }),
});


export const collections = {
  blog: blog,
};