import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    date: z.date(),
    topic: z.string().optional(),
    mastodonRef: z.string().optional(),
  }),
});

export const collections = { blog: blogCollection };
