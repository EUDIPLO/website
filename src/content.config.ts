import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default("The EUDIPLO maintainers"),
    tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
    // Drafts build in `astro dev` only.
    draft: z.boolean().default(false),
  }),
});

const useCases = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/use-cases" }),
  schema: z.object({
    title: z.string(),
    // Headline of the detail page.
    headline: z.string(),
    description: z.string().max(200),
    order: z.number(),
    kind: z.enum(["verify", "issue", "test"]),
    who: z.string(),
    // Card text on the overview and the home page.
    summary: z.string(),
    facts: z.array(
      z.object({
        label: z.string(),
        text: z.string().optional(),
        chips: z.array(z.string()).optional(),
        href: z.url().optional(),
        linkText: z.string().optional(),
      }),
    ),
    cta: z.object({ text: z.string(), href: z.url() }),
  }),
});

export const collections = { blog, "use-cases": useCases };
