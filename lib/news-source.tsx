import { newsPosts } from 'fumadocs-mdx:collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const news = loader({
  baseUrl: '/news',
  source: toFumadocsSource(newsPosts, []),
});
