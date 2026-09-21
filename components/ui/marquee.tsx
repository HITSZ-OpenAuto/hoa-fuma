import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  duration?: string;
  reverse?: boolean;
};

export function Marquee({
  children,
  className,
  duration = '80s',
  reverse = false,
}: MarqueeProps) {
  return (
    <div
      className={cn('marquee', reverse && 'marquee-reverse', className)}
      style={{ '--marquee-duration': duration } as CSSProperties}
    >
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
