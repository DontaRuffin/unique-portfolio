import { defineCollection, z } from 'astro:content';

const notesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
    publish: z.boolean().default(false),
    created: z.date().optional(),
    updated: z.date().optional(),
  }),
});

export const collections = {
  'notes': notesCollection,
};
