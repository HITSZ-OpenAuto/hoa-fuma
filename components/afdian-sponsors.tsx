'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type AfdianSponsor = {
  nickname: string;
  date: string;
  amount: string;
  months: number;
  message: string;
};

type AfdianSponsorsProps = {
  entries: AfdianSponsor[];
};

type MonthGroup = {
  month: number;
  entries: AfdianSponsor[];
};

function groupByYear(entries: AfdianSponsor[]) {
  const years = new Map<number, Map<number, AfdianSponsor[]>>();

  for (const entry of entries) {
    const [year, month] = entry.date.split('-').map(Number);
    const yearGroup = years.get(year) ?? new Map<number, AfdianSponsor[]>();
    const monthGroup = yearGroup.get(month) ?? [];
    monthGroup.push(entry);
    yearGroup.set(month, monthGroup);
    years.set(year, yearGroup);
  }

  return [...years.entries()]
    .sort(([left], [right]) => right - left)
    .map(([year, months]) => ({
      year,
      months: [...months.entries()]
        .sort(([left], [right]) => right - left)
        .map(([month, monthEntries]) => ({
          month,
          entries: monthEntries,
        })),
    }));
}

function MonthSponsors({ month, entries }: MonthGroup) {
  return (
    <section
      aria-labelledby={`afdian-month-${entries[0].date.slice(0, 4)}-${month}`}
    >
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3
          id={`afdian-month-${entries[0].date.slice(0, 4)}-${month}`}
          className="m-0 text-base font-semibold"
        >
          {month} 月
        </h3>
        <span className="text-fd-muted-foreground text-xs">
          {entries.length} 次发电
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map((entry, index) => (
          <article
            key={`${entry.date}-${entry.nickname}-${entry.amount}-${index}`}
            className="bg-fd-card text-fd-card-foreground rounded-xl border p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h4 className="m-0 truncate text-sm font-medium">
                  {entry.nickname || '匿名'}
                </h4>
                <time
                  dateTime={entry.date}
                  className="text-fd-muted-foreground mt-1 block text-xs"
                >
                  {Number(entry.date.slice(8, 10))} 日
                </time>
              </div>
              <div className="shrink-0 text-right">
                <p className="m-0 font-semibold tabular-nums">
                  ¥{entry.amount}
                </p>
                {entry.months > 1 && (
                  <p className="text-fd-muted-foreground m-0 mt-1 text-xs">
                    {entry.months} 个月
                  </p>
                )}
              </div>
            </div>
            {entry.message && (
              <p className="text-fd-muted-foreground m-0 mt-3 text-sm leading-6">
                {entry.message}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function AfdianSponsors({ entries }: AfdianSponsorsProps) {
  const years = groupByYear(entries);

  return (
    <div className="not-prose py-2">
      {years.length > 0 ? (
        <Tabs defaultValue={String(years[0].year)}>
          <div className="overflow-x-auto pb-2">
            <TabsList variant="line" aria-label="按年份查看爱发电记录">
              {years.map(({ year }) => (
                <TabsTrigger key={year} value={String(year)}>
                  {year} 年
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {years.map(({ year, months }) => (
            <TabsContent
              key={year}
              value={String(year)}
              className="mt-4 space-y-8"
            >
              {months.map((month) => (
                <MonthSponsors key={month.month} {...month} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-fd-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">
          暂无爱发电记录
        </p>
      )}
    </div>
  );
}
