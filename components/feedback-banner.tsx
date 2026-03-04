import { Banner } from 'fumadocs-ui/components/banner';
import Link from 'next/link';

export function FeedbackBanner() {
  return (
    <Banner
      id="homepage-feedback-banner"
      changeLayout={false}
      height="auto"
      className="min-h-12 py-2 pr-10 leading-relaxed"
    >
      <span className="inline-flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 break-keep">
        <span className="whitespace-nowrap">发现问题或有建议？</span>
        <span className="whitespace-nowrap">欢迎在</span>
        <Link
          href="https://github.com/HITSZ-OpenAuto/hoa-fuma/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap underline underline-offset-2"
        >
          GitHub Issues
        </Link>
        <span className="whitespace-nowrap">给我们反馈。</span>
      </span>
    </Banner>
  );
}
