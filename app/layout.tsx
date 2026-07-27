import { RootProvider } from 'fumadocs-ui/provider/next';
import 'katex/dist/katex.css';
import './global.css';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import type { Metadata } from 'next';
import { SearchDialog } from '@/components/search-dialog';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import { BookmarkDrawer } from '@/components/bookmark-system';
import { ShortcutsHelpModal } from '@/components/shortcuts-help';

export const metadata: Metadata = {
  title: {
    template: '%s | hoa.moe - HITSZ 课程攻略与开源社区',
    default: 'hoa.moe - HITSZ 课程攻略与开源自动化社区',
  },
  description: '为哈尔滨工业大学（深圳）求学路提供全面的课程资料、选修指南与开源代码经验分享',
  metadataBase: new URL('https://hoa.moe'),
  openGraph: {
    title: 'hoa.moe - HITSZ 课程攻略与开源自动化社区',
    description: '为哈尔滨工业大学（深圳）求学路提供全面的课程资料、选修指南与开源代码经验分享',
    url: 'https://hoa.moe',
    siteName: 'hoa.moe',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hoa.moe - HITSZ 课程攻略与开源自动化社区',
    description: '为哈尔滨工业大学（深圳）求学路提供全面的课程资料、选修指南与开源代码经验分享',
  },
  icons: {
    icon: [
      {
        url: '/icons/favicon-light.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icons/favicon-dark.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://fastdl.hoa.moe" />
        <link rel="dns-prefetch" href="https://fastdl.hoa.moe" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider search={{ SearchDialog }}>
          {children}
          <Toaster />
          <BookmarkDrawer />
          <ShortcutsHelpModal />
        </RootProvider>
        <ServiceWorkerRegister />
        {process.env.NEXT_PUBLIC_UMAMI_SRC &&
          process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <Script
              src={process.env.NEXT_PUBLIC_UMAMI_SRC}
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
              strategy="lazyOnload"
            />
          )}
      </body>
    </html>
  );
}

