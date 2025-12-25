// 1. Import utilities from `astro:content`
import { defineCollection } from "astro:content";

// 2. Import loader(s)
import { glob, file } from "astro/loaders";

// 3. Import Zod
import { z } from "astro/zod";

const articleSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  thumbnail: z.string().nullable().optional(),
});

// 4. Define your collection(s)
const about = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/about" }),
  schema: articleSchema,
});

const article = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/article",
  }),
  schema: articleSchema,
});

const illust = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/illust",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    series: z.string().nullable().optional(),
    link: z.string().nullable().optional(),
  }),
});

const onhourwritings = defineCollection({
  loader: glob({
    pattern: "**/*.md",
  }),
});

const resources = defineCollection({});
const templates = defineCollection({});

// 5. Export a single `collections` object to register your collection(s)
export const collections = {
  about,
  article,
  illust,
  onhourwritings,
  resources,
  templates,
};
