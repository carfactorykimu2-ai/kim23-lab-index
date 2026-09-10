import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/articles' }),
  schema: z.object({
    title: z.string(),
    car: z.string(),
    ecu: z.string(),
    purpose: z.string(),
    note_url: z.string().url().optional(),
    related: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
  }),
});

export const collections = { articles };
