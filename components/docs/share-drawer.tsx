'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Check,
  Link as LinkIcon,
  FileText,
  Quote,
  X,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
}

export function ShareDrawer({ isOpen, onClose, title, url }: ShareDrawerProps) {
  const [copiedType, setCopiedType] = useState<'link' | 'md' | 'quote' | null>(
    null
  );

  const activeTitle =
    title ||
    (typeof document !== 'undefined' ? document.title : 'hoa.moe 课程文档');
  const activeUrl =
    url ||
    (typeof window !== 'undefined' ? window.location.href : 'https://hoa.moe');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async (
    text: string,
    type: 'link' | 'md' | 'quote',
    successMsg: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      toast.success(successMsg, {
        description: '已成功复制到剪贴板，可直接粘贴分享',
      });
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      toast.error('复制失败', {
        description: '请检查浏览器剪贴板权限或手动复制',
      });
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: activeTitle,
          url: activeUrl,
        });
        toast.success('分享成功');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('原生长享失败');
        }
      }
    } else {
      toast.info('当前浏览器不支持系统原生分享，已使用剪贴板复制模式');
    }
  };

  const markdownLink = `[${activeTitle}](${activeUrl})`;
  const markdownQuote = `> **${activeTitle}**\n> 来源: [hoa.moe 课程攻略与开源社区](${activeUrl})\n> 分享时间: ${new Date().toLocaleDateString('zh-CN')}`;

  const hasNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs duration-200 sm:items-center sm:p-4">
      {/* Overlay Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer / Modal Container */}
      <div
        className={cn(
          'relative z-10 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-fd-border bg-fd-background p-6 shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200',
          'not-prose text-fd-foreground'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-drawer-title"
      >
        {/* Header */}
        <div className="border-fd-border flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-fd-primary/10 text-fd-primary flex size-9 items-center justify-center rounded-lg">
              <Share2 className="size-5" />
            </div>
            <div>
              <h3 id="share-drawer-title" className="text-base font-semibold">
                分享此页面 / 导出 Markdown
              </h3>
              <p className="text-fd-muted-foreground text-xs">
                快速复制链接或格式化 Markdown 文本
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="关闭分享窗口"
            className="size-8 rounded-full"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Page Preview Box */}
        <div className="border-fd-border bg-fd-muted/30 mt-4 rounded-lg border p-3">
          <div className="flex items-start gap-2">
            <FileText className="text-fd-primary mt-0.5 size-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{activeTitle}</p>
              <p className="text-fd-muted-foreground mt-0.5 truncate font-mono text-xs">
                {activeUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Group */}
        <div className="mt-5 space-y-2.5">
          {/* Action 1: Direct Link */}
          <div className="border-fd-border/70 bg-fd-card hover:bg-fd-accent/40 flex items-center justify-between rounded-xl border p-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                <LinkIcon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">网页 URL 链接</p>
                <p className="text-fd-muted-foreground text-xs">
                  直接复制标准网页网址
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(activeUrl, 'link', '网页链接已复制')}
              className="h-8 gap-1.5 text-xs"
            >
              {copiedType === 'link' ? (
                <>
                  <Check className="size-3.5 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  复制链接
                </>
              )}
            </Button>
          </div>

          {/* Action 2: Markdown Link */}
          <div className="border-fd-border/70 bg-fd-card hover:bg-fd-accent/40 flex items-center justify-between rounded-xl border p-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-purple-500/10 text-purple-500">
                <FileText className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Markdown 超链接</p>
                <p className="text-fd-muted-foreground text-xs">
                  导出 `[标题](URL)` 格式
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleCopy(markdownLink, 'md', 'Markdown 链接已复制')
              }
              className="h-8 gap-1.5 text-xs"
            >
              {copiedType === 'md' ? (
                <>
                  <Check className="size-3.5 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  复制 Markdown
                </>
              )}
            </Button>
          </div>

          {/* Action 3: Markdown Quote */}
          <div className="border-fd-border/70 bg-fd-card hover:bg-fd-accent/40 flex items-center justify-between rounded-xl border p-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
                <Quote className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Markdown 引用块</p>
                <p className="text-fd-muted-foreground text-xs">
                  包含标题、来源与日期的引用框
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleCopy(markdownQuote, 'quote', 'Markdown 引用片段已复制')
              }
              className="h-8 gap-1.5 text-xs"
            >
              {copiedType === 'quote' ? (
                <>
                  <Check className="size-3.5 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  复制引用
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Native Share Button (if supported) */}
        {hasNativeShare && (
          <div className="border-fd-border mt-4 border-t pt-3">
            <Button
              variant="secondary"
              className="h-9 w-full gap-2 text-xs"
              onClick={handleNativeShare}
            >
              <ExternalLink className="size-3.5" />
              调用系统原生分享...
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
