import { RootProvider } from 'fumadocs-ui/provider/next';
import 'katex/dist/katex.css';
import './global.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HITSZ 课程攻略共享计划',
  description: '为你的 HITSZ 求学路提供全面的课程资料与经验分享',
  metadataBase: new URL('https://hoa.moe'),
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          {children}
          <Toaster />
        </RootProvider>
        <Script
          src="https://stats.hoa.moe/script.js"
          data-website-id="300d85bd-f997-42d4-9bcf-b26666daa293"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
