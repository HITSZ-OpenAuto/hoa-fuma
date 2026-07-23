import Link from 'next/link';
import { Home, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-fd-primary/10 p-4 mb-4 text-fd-primary">
        <HelpCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2">404 - 页面未找到</h1>
      <p className="max-w-md text-fd-muted-foreground mb-8 text-sm sm:text-base">
        抱歉，您访问的课程页面或文档路径可能已被重命名、归档或迁移至合班仓库。
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90"
        >
          <Home className="w-4 h-4" />
          返回首页
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-medium text-fd-foreground shadow-sm transition-colors hover:bg-fd-accent"
        >
          <Search className="w-4 h-4" />
          浏览课程文档
        </Link>
      </div>

      <div className="mt-12 text-xs text-fd-muted-foreground">
        如遇到路由中断或资料丢失问题，请前往{' '}
        <a
          href="https://github.com/HITSZ-OpenAuto/hoa-fuma/issues"
          target="_blank"
          rel="noreferrer"
          className="text-fd-primary underline hover:opacity-80"
        >
          GitHub Issue 提交反馈
        </a>
      </div>
    </div>
  );
}
