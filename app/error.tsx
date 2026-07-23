'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled website runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-rose-500/10 p-4 mb-4 text-rose-500">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">系统遇到意外错误</h2>
      <p className="max-w-md text-fd-muted-foreground mb-8 text-sm leading-relaxed">
        页面加载出现异常 ({error.message || '网络连接或资源加载中断'})。您可以尝试重新加载或返回首页。
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90"
        >
          <RefreshCw className="w-4 h-4" />
          重新尝试加载
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-medium text-fd-foreground shadow-sm transition-colors hover:bg-fd-accent"
        >
          <Home className="w-4 h-4" />
          返回网站首页
        </Link>
      </div>
    </div>
  );
}
