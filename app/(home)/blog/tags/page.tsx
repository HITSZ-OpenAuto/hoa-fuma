import Link from 'next/link';
import { BlogPostList } from '@/components/blog-post-list';
import { getPostListItems } from '@/lib/posts-summary';

export default function Page() {
  const items = getPostListItems('blog');

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-12 md:py-12">
      <div className="mb-4 py-4 md:py-6">
        <div className="text-fd-muted-foreground mb-2 flex items-center gap-2 text-sm">
          <Link href="/blog" className="hover:text-fd-foreground">
            博客
          </Link>
          <span>/</span>
        </div>
        <h1 className="text-fd-foreground font-mono text-3xl font-medium">
          未分类
        </h1>
      </div>
      <BlogPostList items={items} activeTag={null} />
    </main>
  );
}

export const metadata = {
  title: '未分类',
  description: '浏览未分类的博客文章',
};
