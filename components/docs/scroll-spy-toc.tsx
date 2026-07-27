'use client';

import { useEffect, useState, useCallback, useTransition, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

export interface TOCHeaderItem {
  id: string;
  title: ReactNode;
  depth: number; // 1 - 6 for H1 - H6
  url: string;
}

export interface ScrollSpyTOCProps {
  /**
   * Pre-parsed TOC items. If omitted or empty, headings (H1-H6) with IDs will be scanned automatically from DOM.
   */
  items?: { title: ReactNode; url: string; depth: number }[];
  /**
   * Title shown at the top of TOC panel. Defaults to '目录'.
   */
  headerTitle?: string;
  /**
   * Optional custom wrapper CSS class name.
   */
  className?: string;
  /**
   * Minimum heading depth to display (1-6). Defaults to 1.
   */
  minDepth?: number;
  /**
   * Maximum heading depth to display (1-6). Defaults to 6.
   */
  maxDepth?: number;
}

/**
 * ScrollSpyTOC component
 * Renders a Table of Contents panel with active section scroll spy highlighting for H1-H6 markdown headers.
 */
export function ScrollSpyTOC({
  items: initialItems,
  headerTitle = '目录',
  className,
  minDepth = 1,
  maxDepth = 6,
}: ScrollSpyTOCProps) {
  const [tocItems, setTocItems] = useState<TOCHeaderItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      const normalized: TOCHeaderItem[] = initialItems.map((item) => {
        const rawUrl = item.url || '';
        const id = rawUrl.includes('#') ? rawUrl.split('#')[1] : rawUrl;
        return {
          id: id || '',
          title: item.title,
          depth: item.depth ?? 2,
          url: rawUrl.startsWith('#') ? rawUrl : `#${id}`,
        };
      });
      setTocItems(
        normalized.filter(
          (item) => item.depth >= minDepth && item.depth <= maxDepth
        )
      );
    } else {
      const scanHeadings = () => {
        const container =
          document.querySelector('article') ||
          document.querySelector('main') ||
          document.body;
        const headingElements = Array.from(
          container.querySelectorAll<HTMLHeadingElement>(
            'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
          )
        );

        const scanned: TOCHeaderItem[] = headingElements
          .map((el) => {
            const depth = parseInt(el.tagName.replace(/^H/i, ''), 10) || 2;
            return {
              id: el.id,
              title: el.textContent || el.id,
              depth,
              url: `#${el.id}`,
            };
          })
          .filter((item) => item.depth >= minDepth && item.depth <= maxDepth);

        setTocItems(scanned);
      };

      scanHeadings();
      const timer = setTimeout(scanHeadings, 300);
      return () => clearTimeout(timer);
    }
  }, [initialItems, minDepth, maxDepth]);

  const handleScroll = useCallback(() => {
    if (tocItems.length === 0) return;

    const headingElements = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop < 50) {
      setActiveId(tocItems[0].id);
      return;
    }

    if (scrollTop + viewportHeight >= scrollHeight - 50) {
      setActiveId(tocItems[tocItems.length - 1].id);
      return;
    }

    let currentActiveId = headingElements[0].id;
    for (const heading of headingElements) {
      const top = heading.getBoundingClientRect().top;
      if (top <= 120) {
        currentActiveId = heading.id;
      } else {
        break;
      }
    }

    startTransition(() => {
      setActiveId(currentActiveId);
    });
  }, [tocItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  if (tocItems.length === 0) {
    return null;
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const targetEl = document.getElementById(id);
    if (targetEl) {
      const topOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label={headerTitle}
      className={cn(
        'rounded-xl border border-border bg-card/60 p-4 text-card-foreground shadow-xs backdrop-blur-xs transition-colors',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-sm font-semibold tracking-wide text-foreground">
          {headerTitle}
        </h3>
        <span className="text-xs text-muted-foreground">
          {tocItems.length} 个章节
        </span>
      </div>

      <ul className="space-y-1 text-xs max-h-[70vh] overflow-y-auto pr-1">
        {tocItems.map((item) => {
          const isActive = item.id === activeId;
          const indentPx = Math.max(0, item.depth - 2) * 12;

          return (
            <li key={item.id} style={{ paddingLeft: `${indentPx}px` }}>
              <a
                href={item.url}
                onClick={(e) => handleClick(e, item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'block py-1 px-2 rounded-md transition-all duration-150 truncate',
                  isActive
                    ? 'font-medium text-primary bg-primary/10 border-l-2 border-primary pl-2.5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
                title={typeof item.title === 'string' ? item.title : undefined}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
