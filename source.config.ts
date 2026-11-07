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
      includeProcessedMarkdown: { mdxAsPlaceholder: ['CourseInfo'] },
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/**
 * 站外资料页（工作室 / 讲师团资料库）。
 * 独立于课程文档集合：课程目录由 hoa-backend 生成到 content/docs，
 * 资料页需要长期保留，因此单独一个集合，路由挂在 /docs/resources 下。
 */
export const resourcePages = defineCollections({
  type: 'doc',
  dir: 'content/resources',
  postprocess: {
    includeProcessedMarkdown: true,
  },
  schema: pageSchema.extend({
    description: z.string().optional(),
  }),
});

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  postprocess: {
    includeProcessedMarkdown: true,
  },
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
  postprocess: {
    includeProcessedMarkdown: true,
  },
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

export const pages = defineCollections({
  type: 'doc',
  dir: 'content/pages',
  postprocess: {
    includeProcessedMarkdown: true,
  },
  schema: pageSchema.extend({
    showToc: z.boolean().optional(),
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
