import { resourcePages as resourceCollection } from 'fumadocs-mdx:collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const resources = loader({
  baseUrl: '/external',
  source: toFumadocsSource(resourceCollection, []),
});
