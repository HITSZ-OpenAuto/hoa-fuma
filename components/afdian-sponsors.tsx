'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type AfdianSponsor = {
  nickname: string;
  date: string;
  message: string;
};

type AfdianSponsorsProps = {
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
          entries: monthEntries.sort((left, right) =>
            right.date.localeCompare(left.date)
          ),
        })),
    }));
}

function SponsorTable({
  months,
}: {
  months: { month: number; entries: AfdianSponsor[] }[];
}) {
  return (
    <div className="border-y">
      <Table className="min-w-[32rem] table-fixed">
        <colgroup>
          <col className="w-20" />
          <col className="w-40" />
          <col />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>月份</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>留言</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {months.flatMap(({ month, entries }) =>
            entries.map((entry, index) => (
              <TableRow key={`${entry.date}-${entry.nickname}-${index}`}>
                {index === 0 && (
                  <TableCell
                    rowSpan={entries.length}
                    className="align-top font-medium"
                  >
                    {month} 月
                  </TableCell>
                )}
                <TableCell className="font-medium break-words whitespace-normal">
                  {entry.nickname || '匿名'}
                </TableCell>
                <TableCell className="text-fd-muted-foreground max-w-80 whitespace-normal">
                  {entry.message || '—'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function AfdianSponsors({ entries }: AfdianSponsorsProps) {
  const years = groupByYear(entries);

  if (years.length === 0) return null;

  return (
    <div className="not-prose py-2">
      <Tabs
        key={years.map(({ year }) => year).join('-')}
        defaultValue={String(years[0].year)}
      >
        <div className="overflow-x-auto pb-2">
          <TabsList variant="line" aria-label="按年份查看捐助记录">
            {years.map(({ year }) => (
              <TabsTrigger key={year} value={String(year)}>
                {year} 年
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {years.map(({ year, months }) => (
          <TabsContent key={year} value={String(year)} className="mt-4">
            <SponsorTable months={months} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
