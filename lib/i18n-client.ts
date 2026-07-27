'use client';

import { useState, useEffect } from 'react';
import {
  Locale,
  TranslationKey,
  STORAGE_KEY,
  LOCALE_CHANGE_EVENT,
  getTranslation,
} from './i18n';

export type { Locale, TranslationKey };

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'zh-CN';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'zh-CN' || saved === 'en-US') {
    return saved;
  }
  return 'zh-CN';
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.setAttribute('lang', locale);
  window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: locale }));
}

export function useI18nStore() {
  const [locale, setLocaleState] = useState<Locale>('zh-CN');

  useEffect(() => {
    const initial = getStoredLocale();
    setLocaleState(initial);
    document.documentElement.setAttribute('lang', initial);

    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent<Locale>;
      if (customEvent.detail) {
        setLocaleState(customEvent.detail);
      }
    };

    window.addEventListener(LOCALE_CHANGE_EVENT, handleLocaleChange);
    return () => {
      window.removeEventListener(LOCALE_CHANGE_EVENT, handleLocaleChange);
    };
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setStoredLocale(newLocale);
  };

  const t = (key: TranslationKey): string => {
    return getTranslation(locale, key);
  };

  return { locale, setLocale: changeLocale, t };
}
