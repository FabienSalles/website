import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    categories: z.array(z.string()),
    linkedinPostUrl: z.string().url(),
    draft: z.boolean().default(false),
  }),
});

const cv = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    experiences: z.array(z.object({
      title: z.string(),
      company: z.string(),
      location: z.string(),
      startDate: z.date(),
      endDate: z.date().optional(),
      description: z.string(),
      technologies: z.array(z.string()),
      achievements: z.array(z.string()),
    })),
    skills: z.array(z.object({
      category: z.string(),
      items: z.array(z.string()),
    })),
    education: z.array(z.object({
      degree: z.string(),
      school: z.string(),
      location: z.string(),
      year: z.number(),
      description: z.string().optional(),
    })),
    languages: z.array(z.object({
      name: z.string(),
      level: z.string(),
    })),
  }),
});

export const collections = {
  blog: blog,
  cv: cv,
};