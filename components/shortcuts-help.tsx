'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Keyboard, X, Compass, Wrench, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ShortcutGroup {
  category: string;
  icon: React.ReactNode;
  items: { keys: string[]; description: string }[];
}

export function ShortcutsHelpModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const pendingPrefixRef = React.useRef<{ key: string; time: number } | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key;

      if (key === '?') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (key === 'Escape' && isOpen) {
        setIsOpen(false);
        return;
      }

      const now = Date.now();
      if (pendingPrefixRef.current && now - pendingPrefixRef.current.time < 1000) {
        const prefix = pendingPrefixRef.current.key;
        pendingPrefixRef.current = null;

        if (prefix === 'g') {
          if (key === 'h') {
            e.preventDefault();
            router.push('/');
            return;
          }
          if (key === 'd') {
            e.preventDefault();
            router.push('/docs');
            return;
          }
          if (key === 'b') {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('hoa:open-bookmarks'));
            return;
          }
        }
      }

      if (key.toLowerCase() === 'g') {
        pendingPrefixRef.current = { key: 'g', time: now };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, router]);

  if (!isOpen) return null;

  const groups: ShortcutGroup[] = [
    {
      category: '页面导航',
      icon: <Compass className="size-4 text-primary" />,
      items: [
        { keys: ['G', 'H'], description: '前往首页 (Home)' },
        { keys: ['G', 'D'], description: '前往文档 (Docs)' },
        { keys: ['G', 'B'], description: '查看书签 (Bookmarks)' },
      ],
    },
    {
      category: '快捷工具',
      icon: <Wrench className="size-4 text-primary" />,
      items: [
        { keys: ['⌘ / Ctrl', 'B'], description: '快速打开/关闭书签抽屉' },
        { keys: ['Shift', '?'], description: '打开快捷键帮助指南' },
      ],
    },
    {
      category: '系统选项',
      icon: <Settings className="size-4 text-primary" />,
      items: [
        { keys: ['Esc'], description: '关闭当前弹窗 / 模态框' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in p-4">
      <div
        className="fixed inset-0"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <Keyboard className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">键盘快捷键指南</h2>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {groups.map((group) => (
            <div key={group.category} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground border-b pb-1">
                {group.icon}
                <span>{group.category}</span>
              </div>
              <div className="grid gap-2">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          {kIdx > 0 && <span className="text-xs text-muted-foreground">+</span>}
                          <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs font-semibold shadow-xs">
                            {k}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
          随时按下 <kbd className="rounded border px-1.5 py-0.5 bg-muted font-mono">?</kbd> 召唤此菜单
        </div>
      </div>
    </div>
  );
}
