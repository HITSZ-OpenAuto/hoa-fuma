import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
const courseInfoSchema = z.object({
  credit: z.number(),
  assessmentMethod: z.string(),
  courseNature: z.string(),
  hourDistribution: z.object({
    theory: z.number(),
    lab: z.number(),
    practice: z.number(),
    exercise: z.number(),
    computer: z.number(),
    tutoring: z.number(),
  }),
  gradingScheme: z.array(
    z.object({
      name: z.string(),
      percent: z.number(),
    })
  ),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      course: courseInfoSchema.optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    authors: z
      .array(
        z.object({
          name: z.string(),
          link: z.string().optional(),
          image: z.string().optional(),
        })
      )
      .optional(),
    description: z.string().optional(),
    date: z.iso.date().or(z.date()),
  }),
});

export const newsPosts = defineCollections({
  type: 'doc',
  dir: 'content/news',
  schema: frontmatterSchema.extend({
    authors: z
      .array(
        z.object({
          name: z.string(),
          link: z.string().optional(),
          image: z.string().optional(),
        })
      )
      .optional(),
    description: z.string().optional(),
    date: z.iso.date().or(z.date()),
  }),
});

const pageFiles = readdirSync(join(process.cwd(), 'content'), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory() && /^page\d+$/.test(entry.name))
  .map((entry) => `${entry.name}/index.mdx`);

export const staticPages = defineCollections({
  type: 'doc',
  dir: 'content',
  schema: frontmatterSchema.extend({
    description: z.string().optional(),
  }),
  files: pageFiles,
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: (plugins) => [rehypeKatex, ...plugins],
  },
});
