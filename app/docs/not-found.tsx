import Link from 'next/link';
import { getAvailableYears } from '@/lib/docs';

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-fd-muted-foreground mb-2 text-sm">404</p>
        <h1 className="text-2xl font-bold">找不到这篇课程文档</h1>
        <p className="text-fd-muted-foreground mt-3">
          链接可能已过期，或课程文档已被移动或删除。请选择年级，再选择专业查找课程。
        </p>
      </div>
      <nav aria-label="选择年级">
        <ul className="flex flex-wrap gap-3">
          {getAvailableYears().map((year) => (
            <li key={year}>
              <Link
                href={`/docs/${year}`}
                prefetch={false}
                className="inline-flex min-h-11 items-center rounded-lg border px-4 py-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {year} 级
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label="恢复导航" className="flex flex-wrap gap-4">
        {/* Resolve remembered paths on the server, never in this cached 404. */}
        <Link
          href="/docs"
          prefetch={false}
          className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          返回课程文档
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          返回首页
        </Link>
      </nav>
    </main>
  );
}
