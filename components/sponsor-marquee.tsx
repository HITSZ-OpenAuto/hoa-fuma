'use client';

import { useDeferredValue, useState } from 'react';
import { Search } from 'lucide-react';
import {
  AfdianSponsors,
  type AfdianSponsor,
} from '@/components/afdian-sponsors';

type SponsorMarqueeProps = {
  entries: string[][];
  afdianEntries: AfdianSponsor[];
};

function formatHistoricalEntry(entry: string[]): AfdianSponsor {
  const [nickname, date, message] = entry;
  const [year, month, day] = date.split('.').map(Number);

  return {
    nickname: nickname || '匿名',
    date: [
      year,
      String(month).padStart(2, '0'),
      String(day).padStart(2, '0'),
    ].join('-'),
    message: message || '',
  };
}

export function SponsorMarquee({
  entries,
  afdianEntries,
}: SponsorMarqueeProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const combinedEntries = [
    ...entries.map(formatHistoricalEntry),
    ...afdianEntries,
  ];
  const filteredEntries = deferredQuery
    ? combinedEntries.filter((entry) =>
        [entry.nickname, entry.date, entry.message].some((value) =>
          value.toLowerCase().includes(deferredQuery)
        )
      )
    : combinedEntries;

  return (
    <div className="not-prose py-2">
      <div className="relative mb-4">
        <Search
          className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索"
          aria-label="搜索感谢名单"
          className="bg-fd-background focus-visible:ring-fd-primary/30 h-10 w-full rounded-lg border pr-3 pl-9 text-sm transition-shadow outline-none focus-visible:ring-2"
        />
      </div>

      {filteredEntries.length > 0 ? (
        <AfdianSponsors entries={filteredEntries} />
      ) : (
        <p className="text-fd-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">
          没有找到匹配的捐助记录
        </p>
      )}
    </div>
  );
}
