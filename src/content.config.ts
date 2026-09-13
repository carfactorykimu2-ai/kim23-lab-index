import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './content/articles',
    generateId: ({ entry }) => entry.replace(/\.md$/, '').split('/').pop(),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    summary: z.string().optional(),
    magazine: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    step: z.string().optional(),
    car_model: z.string().optional(),
    ecu: z.array(z.string()).default([]),
    device: z.string().optional(),
    can_id: z.string().optional(),
    price: z.number().default(0),
    note_url: z.string().url().optional(),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { articles };
