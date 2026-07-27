'use client';

import React, { useEffect, useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { useI18nStore, type Locale } from '@/lib/i18n-client';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useI18nStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-fd-border bg-fd-secondary/30 ${className}`}
      />
    );
  }

  const toggleLocale = () => {
    const nextLocale: Locale = locale === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLocale(nextLocale);
  };

  const handleSelect = (selectedLocale: Locale) => {
    setLocale(selectedLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleLocale();
        }}
        className={`inline-flex items-center justify-center gap-1.5 px-2.5 h-9 rounded-lg border border-fd-border bg-fd-card text-fd-card-foreground text-xs font-medium hover:bg-fd-accent hover:text-fd-accent-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fd-ring ${className}`}
        title={`Language: ${locale === 'zh-CN' ? '中文' : 'English'} (Click to select, right-click to quick toggle)`}
        aria-label="Toggle language"
      >
        <Languages className="w-4 h-4 text-fd-muted-foreground shrink-0" />
        <span className="font-mono tracking-tight uppercase">
          {locale === 'zh-CN' ? 'ZH' : 'EN'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-36 rounded-lg border border-fd-border bg-fd-popover p-1 shadow-md z-50 text-fd-popover-foreground animate-in fade-in-80 zoom-in-95">
            <button
              type="button"
              onClick={() => handleSelect('zh-CN')}
              className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                locale === 'zh-CN'
                  ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                  : 'hover:bg-fd-accent/50 text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              <span>简体中文</span>
              {locale === 'zh-CN' && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
            <button
              type="button"
              onClick={() => handleSelect('en-US')}
              className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                locale === 'en-US'
                  ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                  : 'hover:bg-fd-accent/50 text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              <span>English</span>
              {locale === 'en-US' && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
