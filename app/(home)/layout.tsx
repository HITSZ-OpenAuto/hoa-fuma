import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { FeedbackBanner } from '@/components/feedback-banner';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <FeedbackBanner />
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
    </>
  );
}
