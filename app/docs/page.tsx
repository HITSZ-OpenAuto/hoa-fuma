import Link from 'next/link';

const REDIRECT_SCRIPT = `(() => {
  const match = document.cookie.match(/(?:^|; )hoa-last-path=([^;]+)/);
  const lastPath = match ? decodeURIComponent(match[1]) : '';
  const target = lastPath.startsWith('/docs/') ? lastPath : '/docs/2025';
  window.location.replace(target);
})();`;

export default function Page() {
  return (
    <main className="text-fd-muted-foreground p-4 text-sm">
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      <noscript>
        <meta content="0;url=/docs/2025" httpEquiv="refresh" />
      </noscript>
      正在跳转到课程目录…
      <Link className="ml-2 underline" href="/docs/2025">
        点此继续
      </Link>
    </main>
  );
}
