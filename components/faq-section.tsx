import Script from 'next/script';
import type { ReactNode } from 'react';
import Link from 'fumadocs-core/link';
import { cn } from '@/lib/utils';

type FaqItem = {
  question: string;
  answer: string;
};

function parseMarkdownLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]*(?:\([^)]*\)[^)]*)*)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link
        key={match.index}
        href={match[2]}
        className="decoration-fd-primary font-medium underline decoration-[1.5px] underline-offset-[3.5px] transition-opacity hover:opacity-80"
      >
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

type FaqSectionProps = {
  items: FaqItem[];
  title?: string;
  className?: string;
};

export function FaqSection({
  items,
  title = '常见问题',
  className,
}: FaqSectionProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
      },
    })),
  };

  const scriptId = `faq-jsonld-${items.length}-${items[0]?.question.length ?? 0}`;

  return (
    <section className={cn('my-10', className)}>
      <Script
        id={scriptId}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
      <h2>{title}</h2>
      <div className="mt-6 space-y-8">
        {items.map((item) => (
          <div key={item.question}>
            <h3 className="mb-2 text-lg font-medium">{item.question}</h3>
            <p className="text-fd-muted-foreground leading-relaxed">
              {parseMarkdownLinks(item.answer)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
