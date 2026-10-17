import { notFound } from 'next/navigation';
import { createElement } from 'react';
import { renderPlaceholder } from 'fumadocs-core/mdx-plugins/remark-llms.runtime';
import { renderToMarkdown } from 'fumadocs-core/server';
import { CourseInfo } from '@/components/course-info';
import { getDocsCourse } from '@/lib/course-frontmatter';
import { source } from '@/lib/source/docs';
import { pages } from '@/lib/source/pages';
import { blog, news } from '@/lib/source/posts';

export const revalidate = false;

export async function GET(
  _request: Request,
  { params }: RouteContext<'/llms.mdx/[...slug]'>
) {
  const { slug } = await params;
  if (slug.at(-1) !== 'content.md') notFound();

  const path = slug.slice(0, -1);
  if (path.at(-1) === 'index') path.pop();

  const [section, ...segments] = path;
  const page =
    section === 'docs'
      ? source.getPage(segments)
      : section === 'blog'
        ? blog.getPage(segments)
        : section === 'news'
          ? news.getPage(segments)
          : pages.getPage(path);
  if (!page) notFound();

  const course = section === 'docs' ? getDocsCourse(segments) : undefined;
  const content = [
    `# ${page.data.title}`,
    `URL: ${new URL(page.url, 'https://hoa.moe').href}`,
    page.data.description,
    await renderPlaceholder(await page.data.getText('processed'), {
      CourseInfo: () =>
        renderToMarkdown(createElement(CourseInfo, { data: course })),
    }),
  ];

  return new Response(`${content.filter(Boolean).join('\n\n')}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
