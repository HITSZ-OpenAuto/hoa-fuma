'use client';

import type { ComponentProps, ReactNode } from 'react';
import {
  Accordion as FumaAccordion,
  Accordions as FumaAccordions,
} from 'fumadocs-ui/components/accordion';
import Link from 'fumadocs-core/link';

function parseMarkdownLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link
        key={match.index}
        href={match[2]}
        className="font-medium underline decoration-fd-primary underline-offset-[3.5px] decoration-[1.5px] hover:opacity-80 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {match[1]}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function Accordion({
  title,
  ...props
}: ComponentProps<typeof FumaAccordion>) {
  const parsedTitle =
    typeof title === 'string' ? parseMarkdownLinks(title) : title;

  return <FumaAccordion title={<>{parsedTitle}</>} {...props} />;
}

export const Accordions = FumaAccordions;
