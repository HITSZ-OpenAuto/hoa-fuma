'use client';

import * as React from 'react';
import { Bookmark, BookmarkCheck, Trash2, Search, ExternalLink, BookmarkPlus, FolderBookmark, X } from 'lucide-react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BookmarkItem {
  id: string;
  title: string;
  path: string;
  createdAt: number;
}

const STORAGE_KEY = 'hoa_bookmarks';

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(items: BookmarkItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('hoa:bookmarks-changed'));
  } catch (err) {
    console.error('Failed to save bookmarks:', err);
  }
}

export function BookmarkButton({ title, path }: { title?: string; path?: string }) {
  const currentPathname = usePathname();
  const targetPath = path || currentPathname || '/';
  const targetTitle = title || (typeof document !== 'undefined' ? document.title : targetPath);

  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const checkStatus = React.useCallback(() => {
    const items = getBookmarks();
    setIsBookmarked(items.some((item) => item.path === targetPath));
  }, [targetPath]);

  React.useEffect(() => {
    checkStatus();
    const handleChanged = () => checkStatus();
    window.addEventListener('hoa:bookmarks-changed', handleChanged);
    return () => window.removeEventListener('hoa:bookmarks-changed', handleChanged);
  }, [checkStatus]);

  const toggleBookmark = () => {
    const items = getBookmarks();
    const existingIndex = items.findIndex((item) => item.path === targetPath);

    if (existingIndex >= 0) {
      items.splice(existingIndex, 1);
      saveBookmarks(items);
      setIsBookmarked(false);
      toast.info('已移除书签', { description: targetTitle });
    } else {
      const newItem: BookmarkItem = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title: targetTitle,
        path: targetPath,
        createdAt: Date.now(),
      };
      items.unshift(newItem);
      saveBookmarks(items);
      setIsBookmarked(true);
      toast.success('已添加书签', { description: targetTitle });
    }
  };

  const openDrawer = () => {
    window.dispatchEvent(new CustomEvent('hoa:open-bookmarks'));
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Button
        variant={isBookmarked ? 'default' : 'outline'}
        size="sm"
        onClick={toggleBookmark}
        className="gap-1.5"
        title={isBookmarked ? '移除书签' : '添加书签'}
      >
        {isBookmarked ? (
          <>
            <BookmarkCheck className="size-4 text-primary-foreground fill-current" />
            <span>已收藏</span>
          </>
        ) : (
          <>
            <BookmarkPlus className="size-4" />
            <span>收藏本页</span>
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={openDrawer}
        title="查看所有书签"
      >
        <FolderBookmark className="size-4" />
        <span className="sr-only">打开书签库</span>
      </Button>
    </div>
  );
}

export function BookmarkDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [bookmarks, setBookmarks] = React.useState<BookmarkItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const refreshBookmarks = React.useCallback(() => {
    setBookmarks(getBookmarks());
  }, []);

  React.useEffect(() => {
    refreshBookmarks();
    const handleChanged = () => refreshBookmarks();
    const handleOpen = () => setIsOpen(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('hoa:bookmarks-changed', handleChanged);
    window.addEventListener('hoa:open-bookmarks', handleOpen);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hoa:bookmarks-changed', handleChanged);
      window.removeEventListener('hoa:open-bookmarks', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [refreshBookmarks]);

  if (!isOpen) return null;

  const filtered = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    saveBookmarks(updated);
    toast.success('已删除书签');
  };

  const clearAll = () => {
    if (confirm('确定要清空所有书签吗？')) {
      saveBookmarks([]);
      toast.success('已清空所有书签');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-background p-6 shadow-2xl border-l border-border animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">书签收藏夹</h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">
              {bookmarks.length}
            </span>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="my-4 relative">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索书签标题或路径..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
              <Bookmark className="size-10 stroke-1 mb-2 opacity-50" />
              <p className="text-sm">暂无匹配的书签</p>
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b.id}
                className="group relative flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <a
                  href={b.path}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 min-w-0 pr-2"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm truncate">{b.title}</span>
                    <ExternalLink className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0" />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground truncate mt-0.5">
                    {b.path}
                  </div>
                </a>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => deleteBookmark(b.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  title="删除"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>

        {bookmarks.length > 0 && (
          <div className="mt-4 border-t pt-4 flex justify-between items-center text-xs text-muted-foreground">
            <span>快捷键: <kbd className="rounded border px-1 py-0.5 bg-muted font-mono">⌘ + B</kbd> 开/关</span>
            <Button variant="ghost" size="xs" onClick={clearAll} className="text-destructive hover:bg-destructive/10">
              清空全部
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
