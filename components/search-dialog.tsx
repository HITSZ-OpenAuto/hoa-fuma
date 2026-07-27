'use client';

import {
  SearchDialog as FumadocsSearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
} from 'fumadocs-ui/components/dialog/search';
import type { DefaultSearchDialogProps } from 'fumadocs-ui/components/dialog/search-default';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { fetchClient } from 'fumadocs-core/search/client/fetch';
import { oramaStaticClient } from 'fumadocs-core/search/client/orama-static';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { useMemo, useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { searchClientIndex } from '@/lib/client-search-index';
import { useI18nStore } from '@/lib/i18n-client';

function EmptySearchResults() {
  const { t } = useI18nStore();
  return (
    <div className="text-fd-muted-foreground py-12 text-center text-sm">
      {t('noResults')}
    </div>
  );
}

export function SearchDialog({
  defaultTag,
  tags = [],
  api,
  delayMs,
  type,
  allowClear = false,
  links = [],
  footer,
  ...props
}: DefaultSearchDialogProps) {
  const { locale } = useI18n();
  const { t } = useI18nStore();
  const [tag, setTag] = useState(defaultTag);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateOnlineState = () => {
      setIsOffline(!navigator.onLine);
    };

    updateOnlineState();
    window.addEventListener('online', updateOnlineState);
    window.addEventListener('offline', updateOnlineState);

    return () => {
      window.removeEventListener('online', updateOnlineState);
      window.removeEventListener('offline', updateOnlineState);
    };
  }, []);

  const client = useMemo(
    () =>
      type === 'static'
        ? oramaStaticClient({ from: api, locale, tag })
        : fetchClient({ api, locale, tag }),
    [type, api, locale, tag]
  );
  const { search, setSearch, query } = useDocsSearch({ client, delayMs });

  const offlineItems = useMemo(() => {
    if (!search || !search.trim()) return null;
    const clientResults = searchClientIndex(search);
    if (clientResults.length === 0) return 'empty' as const;

    return clientResults.map((item) => ({
      type: 'page' as const,
      id: item.id,
      content: `${item.title} - ${item.description}`,
      url: item.url,
      breadcrumbs: item.year ? [item.year] : undefined,
    }));
  }, [search]);

  const defaultItems = useMemo(() => {
    if (links.length === 0) return null;
    return links.map(([name, link]) => ({
      type: 'page' as const,
      id: name,
      content: name,
      url: link,
    }));
  }, [links]);

  useOnChange(defaultTag, (value) => {
    setTag(value);
  });

  const isUsingOfflineMode = isOffline || Boolean(query.error);
  const itemsToDisplay = isUsingOfflineMode
    ? (offlineItems !== 'empty' ? (offlineItems ?? defaultItems) : defaultItems)
    : (query.data !== 'empty' ? query.data : defaultItems);

  return (
    <FumadocsSearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={!isUsingOfflineMode && query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput placeholder={t('enterQuery')} />
          <SearchDialogClose />
        </SearchDialogHeader>

        {isUsingOfflineMode && (
          <div className="mx-4 mt-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium">
              <WifiOff className="w-3.5 h-3.5" />
              <span>{t('offlineSearch')}</span>
            </div>
            <span className="text-[11px] opacity-80">Local Fuzzy Search</span>
          </div>
        )}

        <SearchDialogList
          items={itemsToDisplay}
          Empty={EmptySearchResults}
        />
      </SearchDialogContent>
      <SearchDialogFooter>
        {tags.length > 0 && (
          <TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
            {tags.map((tag) => (
              <TagsListItem key={tag.value} value={tag.value}>
                {tag.name}
              </TagsListItem>
            ))}
          </TagsList>
        )}
        {footer}
      </SearchDialogFooter>
    </FumadocsSearchDialog>
  );
}
