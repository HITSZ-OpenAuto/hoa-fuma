import { RootProvider } from 'fumadocs-ui/provider/next';
import 'katex/dist/katex.css';
import './global.css';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HITSZ 课程攻略共享计划',
  description: '为你的 HITSZ 求学路提供全面的课程资料与经验分享',
  metadataBase: new URL('https://hoa.moe'),
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
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          {children}
          <Toaster />
        </RootProvider>
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
