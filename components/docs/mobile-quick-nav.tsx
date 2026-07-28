'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Menu,
  X,
  ArrowUp,
  ArrowDown,
  List,
  Share2,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShareDrawer } from '@/components/docs/share-drawer';

export interface MobileQuickNavItem {
  id: string;
  title: string;
  depth: number;
}

export interface MobileQuickNavProps {
  items?: { title: React.ReactNode; url: string; depth: number }[];
  className?: string;
}

export function MobileQuickNav({
  items: initialItems,
  className,
}: MobileQuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [headings, setHeadings] = useState<MobileQuickNavItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  const scanHeadings = useCallback(() => {
    if (initialItems && initialItems.length > 0) {
      const parsed = initialItems.map((it) => ({
        id: it.url.replace(/^#/, ''),
        title:
          typeof it.title === 'string' ? it.title : String(it.title ?? '章节'),
        depth: it.depth ?? 2,
      }));
      setHeadings(parsed);
      return;
    }

    const container =
      document.querySelector('article') ||
      document.querySelector('main') ||
      document.body;

    const headingEls = Array.from(
      container.querySelectorAll<HTMLHeadingElement>(
        'h1[id], h2[id], h3[id], h4[id]'
      )
    );

    const scanned = headingEls.map((el) => ({
      id: el.id,
      title: el.textContent?.trim() || el.id,
      depth: parseInt(el.tagName.replace(/^H/i, ''), 10) || 2,
    }));

    setHeadings(scanned);
  }, [initialItems]);

  useEffect(() => {
    scanHeadings();
    const timer = setTimeout(scanHeadings, 400);
    return () => clearTimeout(timer);
  }, [scanHeadings]);

  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;
      let currentId = headings[0]?.id || '';
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 140) {
          currentId = h.id;
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToId = (id: string) => {
    setIsOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const topOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    setIsOpen(false);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Trigger Button (Mobile Only) */}
      <div
        className={cn(
          'fixed bottom-6 right-5 z-40 md:hidden flex items-center gap-2',
          className
        )}
      >
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-fd-primary text-fd-primary-foreground size-12 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
          aria-label="打开移动端章节导航"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="size-5" /> : <List className="size-5" />}
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs duration-200 md:hidden">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className={cn(
              'relative z-10 w-full rounded-t-2xl border-t border-fd-border bg-fd-background p-5 shadow-2xl animate-in slide-in-from-bottom duration-250 max-h-[80vh] flex flex-col',
              'not-prose text-fd-foreground'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="章节 Quick-Nav 导航"
          >
            {/* Header bar */}
            <div className="border-fd-border flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Menu className="text-fd-primary size-4" />
                <span>章节 Fast-Jump / 导航浮窗</span>
                <span className="text-fd-muted-foreground font-mono text-xs">
                  ({headings.length} 节)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="size-7 rounded-full"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Jump Actions Row */}
            <div className="my-3 grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToTop}
                className="h-auto flex-col gap-1 py-2 text-[11px]"
              >
                <ArrowUp className="size-3.5 text-blue-500" />
                回到顶部
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToBottom}
                className="h-auto flex-col gap-1 py-2 text-[11px]"
              >
                <ArrowDown className="size-3.5 text-purple-500" />
                直达底部
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setIsShareOpen(true);
                }}
                className="h-auto flex-col gap-1 py-2 text-[11px]"
              >
                <Share2 className="size-3.5 text-emerald-500" />
                分享本页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new CustomEvent('hoa:open-bookmarks'));
                }}
                className="h-auto flex-col gap-1 py-2 text-[11px]"
              >
                <Bookmark className="size-3.5 text-amber-500" />
                我的书签
              </Button>
            </div>

            {/* Heading Jump List */}
            <div className="my-1 flex-1 space-y-1 overflow-y-auto pr-1">
              {headings.length === 0 ? (
                <p className="text-fd-muted-foreground py-6 text-center text-xs">
                  未找到页面章节标题
                </p>
              ) : (
                headings.map((item) => {
                  const isActive = item.id === activeId;
                  const indentPx = Math.max(0, item.depth - 2) * 10;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToId(item.id)}
                      style={{ paddingLeft: `${indentPx + 12}px` }}
                      className={cn(
                        'w-full text-left py-2 px-3 rounded-lg text-xs flex items-center justify-between transition-colors',
                        isActive
                          ? 'bg-fd-primary/10 text-fd-primary font-medium border-l-2 border-fd-primary'
                          : 'text-fd-muted-foreground hover:bg-fd-accent/60 hover:text-fd-foreground'
                      )}
                    >
                      <span className="truncate">{item.title}</span>
                      <ChevronRight className="ml-2 size-3.5 shrink-0 opacity-60" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Drawer */}
      <ShareDrawer isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
}
