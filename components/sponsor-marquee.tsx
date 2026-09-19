'use client';

import { useDeferredValue, useState } from 'react';
import { Search } from 'lucide-react';
import {
  AfdianSponsors,
  type AfdianSponsor,
} from '@/components/afdian-sponsors';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils';

type SponsorMarqueeProps = {
  entries: string[][];
  afdianEntries: AfdianSponsor[];
};

function formatAfdianEntry(entry: AfdianSponsor) {
  const [year, month, day] = entry.date.split('-').map(Number);
  return [entry.nickname, `${year}.${month}.${day}`, entry.message];
}

function sponsorTimestamp(entry: string[]) {
  const [year, month, day] = entry[1].split(/[.-]/).map(Number);
  return Date.UTC(year, month - 1, day);
}

function SponsorCard({
  entry,
  className,
}: {
  entry: string[];
  className?: string;
}) {
  const [name, date, message] = entry;

  return (
    <article
      className={cn(
        'bg-fd-card text-fd-card-foreground flex h-24 w-64 shrink-0 flex-col rounded-xl border p-3 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate font-medium">{name || '匿名'}</h3>
        <time className="text-fd-muted-foreground shrink-0 text-xs">
          {date}
        </time>
      </div>
      {message && (
        <p className="text-fd-muted-foreground mt-2 line-clamp-2 text-sm leading-5">
          {message}
        </p>
      )}
    </article>
  );
}

export function SponsorMarquee({
  entries,
  afdianEntries,
}: SponsorMarqueeProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filteredAfdianEntries = deferredQuery
    ? afdianEntries.filter((entry) =>
        [
          entry.nickname,
          entry.date,
          entry.amount,
          `${entry.months} 个月`,
          entry.message,
        ].some((value) => value.toLowerCase().includes(deferredQuery))
      )
    : afdianEntries;
  const filteredHistoricalEntries = deferredQuery
    ? entries.filter((entry) =>
        entry.some((value) => value.toLowerCase().includes(deferredQuery))
      )
    : entries;
  const filteredEntries = [
    ...filteredHistoricalEntries,
    ...filteredAfdianEntries.map(formatAfdianEntry),
  ].sort((left, right) => sponsorTimestamp(right) - sponsorTimestamp(left));
  const rows = Array.from({ length: 6 }, (_, rowIndex) =>
    filteredEntries.filter((_, entryIndex) => entryIndex % 6 === rowIndex)
  );

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

      <AfdianSponsors entries={filteredAfdianEntries} />

      {deferredQuery ? (
        filteredEntries.length > 0 ? (
          <div
            className={cn(
              'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3',
              filteredAfdianEntries.length > 0 && 'mt-8'
            )}
          >
            {filteredEntries.map((entry, index) => (
              <SponsorCard
                key={`${entry[0]}-${entry[1]}-${index}`}
                entry={entry}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <p className="text-fd-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">
            没有找到匹配的捐助记录
          </p>
        )
      ) : (
        <div
          className={cn(
            'space-y-3',
            filteredAfdianEntries.length > 0 && 'mt-8'
          )}
        >
          {rows.map((row, rowIndex) => (
            <Marquee
              key={rowIndex}
              duration={`${90 + rowIndex * 5}s`}
              reverse={rowIndex % 2 === 1}
            >
              {row.map((entry, entryIndex) => (
                <SponsorCard
                  key={`${entry[0]}-${entry[1]}-${entryIndex}`}
                  entry={entry}
                />
              ))}
            </Marquee>
          ))}
        </div>
      )}
    </div>
  );
}
