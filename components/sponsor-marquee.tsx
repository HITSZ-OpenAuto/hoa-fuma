'use client';

import { useDeferredValue, useState } from 'react';
import { Search } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils';

type SponsorMarqueeProps = {
  entries: string[][];
};

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

export function SponsorMarquee({ entries }: SponsorMarqueeProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filteredEntries = deferredQuery
    ? entries.filter((entry) =>
        entry.some((value) => value.toLowerCase().includes(deferredQuery))
      )
    : entries;
  const rows = Array.from({ length: 6 }, (_, rowIndex) =>
    entries.filter((_, entryIndex) => entryIndex % 6 === rowIndex)
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

      {deferredQuery ? (
        filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="space-y-3">
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
