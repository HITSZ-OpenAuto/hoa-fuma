import {
  defineCollections,
  defineConfig,
  defineDocs,
  applyMdxPreset,
} from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import z from 'zod';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkAlert from 'remark-github-blockquote-alert';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    dynamic: true,
    mdxOptions: (environment) =>
      applyMdxPreset({
        remarkImageOptions: {
          external: false,
        },
        remarkPlugins: [remarkMath, remarkAlert],
        rehypePlugins: (plugins) => [rehypeKatex, ...plugins],
      })(environment),
    postprocess: {
      includeProcessedMarkdown: false,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
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
    date: z.iso
      .date()
      .or(z.iso.datetime({ offset: true }))
      .or(z.date()),
    tags: z.array(z.string()).optional(),
    weight: z.number().optional(),
  }),
});

export const newsPosts = defineCollections({
  type: 'doc',
  dir: 'content/news',
  schema: pageSchema.extend({
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
    date: z.iso
      .date()
      .or(z.iso.datetime({ offset: true }))
      .or(z.date()),
    weight: z.number().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    providerImportSource: '@/components/mdx',
    remarkImageOptions: {
      external: false,
    },
    remarkPlugins: [remarkMath, remarkAlert],
    rehypePlugins: (plugins) => [rehypeKatex, ...plugins],
  },
});
