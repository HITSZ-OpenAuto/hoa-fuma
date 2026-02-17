'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const HOA_LAST_PATH_COOKIE = 'hoa-last-path';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function DocsPathMemory() {
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (pathname.startsWith('/docs/') && segments.length >= 2) {
      document.cookie = `${HOA_LAST_PATH_COOKIE}=${encodeURIComponent(pathname)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
    }
  }, [pathname]);

  return null;
}
