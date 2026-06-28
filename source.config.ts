import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
  applyMdxPreset,
} from 'fumadocs-mdx/config';
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
    weight: z.number().optional(),
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
