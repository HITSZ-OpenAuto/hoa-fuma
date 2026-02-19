'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <span
      className={cn(
        'text-muted-foreground/70 fixed bottom-6 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-300',
        !visible && 'pointer-events-none invisible opacity-0'
      )}
      aria-hidden
    >
      <ChevronDown className="h-8 w-8 animate-bounce" />
    </span>
  );
}
