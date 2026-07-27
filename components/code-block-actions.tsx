'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useI18nStore } from '@/lib/i18n-client';
import { CodePlayground } from '@/components/code-playground';

export interface CodeBlockActionsProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlockActions({
  code,
  language,
  className = '',
}: CodeBlockActionsProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18nStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(t('copied'));
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code block:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const displayLanguage = language
    ? language.replace(/^language-/, '').toUpperCase()
    : 'TEXT';

  return (
    <div className={`rounded-t-lg overflow-hidden ${className}`}>
      <div
        className="flex items-center justify-between px-4 py-1.5 bg-fd-muted/80 border-b border-fd-border/50 text-xs font-mono text-fd-muted-foreground select-none"
      >
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-fd-accent text-fd-accent-foreground border border-fd-border/50">
            {displayLanguage}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium hover:bg-fd-accent hover:text-fd-foreground transition-colors focus:outline-none"
          title={copied ? t('copied') : t('copyCode')}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500 font-sans">{t('copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">{t('copyCode')}</span>
            </>
          )}
        </button>
      </div>

      <CodePlayground code={code} language={language} />
    </div>
  );
}

export function CodeBlockWrapper({
  children,
  code,
  language,
}: {
  children: React.ReactNode;
  code?: string;
  language?: string;
}) {
  return (
    <div className="relative my-4 rounded-lg border border-fd-border bg-fd-card overflow-hidden group">
      {code && <CodeBlockActions code={code} language={language} />}
      <div className="overflow-x-auto p-4 text-xs font-mono">{children}</div>
    </div>
  );
}

