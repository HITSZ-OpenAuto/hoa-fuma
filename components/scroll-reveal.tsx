'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type ScrollRevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

export function ScrollReveal({
  delay = 0,
  className,
  style,
  children,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.dataset.revealed = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealed = 'true';
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-revealed="false"
      className={cn(
        'translate-y-6 opacity-0 transition-all duration-700 ease-out will-change-transform data-[revealed=true]:translate-y-0 data-[revealed=true]:opacity-100',
        className
      )}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}
