'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const HOA_LAST_PATH_COOKIE = 'hoa-last-path';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const SPECIAL_CATEGORIES = ['cross-specialty', 'general-knowledge'];

export function DocsPathMemory() {
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);

    // Save path for both year-based docs and special categories
    if (pathname.startsWith('/docs/') && segments.length >= 2) {
      const isYearBased = /^\d{4}$/.test(segments[1]);
      const isSpecialCategory = SPECIAL_CATEGORIES.includes(segments[1]);

      if (isYearBased || isSpecialCategory) {
        document.cookie = `${HOA_LAST_PATH_COOKIE}=${encodeURIComponent(pathname)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
      }
    }
  }, [pathname]);

  return null;
}
