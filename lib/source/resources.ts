import { resourcePages as resourceCollection } from 'fumadocs-mdx:collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

/**
 * 站外资料页集合，路由挂在 /resources 下，
 * 这样进入资料页时仍保留课程文档的左侧目录。
 */
export const resources = loader({
  baseUrl: '/resources',
  source: toFumadocsSource(resourceCollection, []),
});
