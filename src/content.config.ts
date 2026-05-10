import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    industry: z.string(),
    duration: z.string(),
    date: z.coerce.date(),
    role: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    outcomes: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases, blog };
