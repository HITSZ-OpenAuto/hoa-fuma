'use client';

import React, { useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick?: () => void;
  className?: string;
  'aria-expanded'?: boolean;
}

export function SearchButton({
  onClick,
  className = '',
  'aria-expanded': ariaExpanded = false,
}: SearchButtonProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClick?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <div role="search">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-fd-muted-foreground bg-fd-secondary/50 hover:bg-fd-secondary border border-fd-border rounded-lg transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
        aria-label="Search documentation"
        aria-expanded={ariaExpanded}
        aria-haspopup="dialog"
      >
        <Search className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Search documentation...</span>
        <span className="sm:hidden">Search...</span>
        <kbd
          className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-fd-muted-foreground bg-fd-background border border-fd-border rounded shadow-xs ml-auto"
          aria-hidden="true"
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    </div>
  );
}

