'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const HOA_LAST_PATH_COOKIE = 'hoa-last-path';

interface HeroButtonsProps {
  yearMajorMap: Record<string, { id: string; name: string }[]>;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length !== 2) return undefined;

  const cookieValue = parts.pop()?.split(';').shift();
  return cookieValue ? decodeURIComponent(cookieValue) : undefined;
}

export function HeroButtons({ yearMajorMap }: HeroButtonsProps) {
  const router = useRouter();
  const [selecting, setSelecting] = useState(false);
  const [year, setYear] = useState<string>('');

  const years = useMemo(
    () => Object.keys(yearMajorMap).sort((a, b) => b.localeCompare(a)),
    [yearMajorMap]
  );

  const majors = useMemo(
    () => (year ? (yearMajorMap[year] ?? []) : []),
    [yearMajorMap, year]
  );

  useEffect(() => {
    const lastPath = getCookie(HOA_LAST_PATH_COOKIE);
    if (lastPath?.startsWith('/docs')) {
      router.prefetch(lastPath);
    }
  }, [router]);

  const handleDocsClick = useCallback(() => {
    const lastPath = getCookie(HOA_LAST_PATH_COOKIE);
    if (lastPath?.startsWith('/docs')) {
      router.push(lastPath);
    } else if (lastPath === undefined) {
      setSelecting(true);
    } else {
      router.push('/docs');
    }
  }, [router]);

  const handleYearChange = useCallback((value: string) => {
    setYear(value);
  }, []);

  const handleMajorChange = useCallback(
    (value: string) => {
      router.push(`/docs/${year}/${value}`);
    },
    [router, year]
  );

  const rowClasses =
    'flex flex-wrap justify-center gap-4 pt-4 lg:justify-start min-h-10 items-center';
  const triggerClasses = 'h-10 rounded-full';

  return (
    <div className="flex h-[5.25rem] flex-col justify-between">
      <div className={rowClasses}>
        {selecting ? (
          <>
            <Select value={year} onValueChange={handleYearChange}>
              <SelectTrigger className={triggerClasses}>
                <SelectValue placeholder="入学年份" />
              </SelectTrigger>
              <SelectContent className="min-w-0 rounded-xl">
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value="" onValueChange={handleMajorChange} disabled={!year}>
              <SelectTrigger className={triggerClasses}>
                <SelectValue placeholder="专业" />
              </SelectTrigger>
              <SelectContent className="min-w-0 rounded-xl">
                <ScrollArea className="h-72">
                  <div className="p-1">
                    {majors.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </div>
                </ScrollArea>
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            <Button
              variant="default"
              size="lg"
              className="rounded-full transition-transform hover:scale-105"
              onClick={handleDocsClick}
            >
              查看文档
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full transition-transform hover:scale-105"
              asChild
            >
              <Link href="/blog/contribution-guide">参与指南</Link>
            </Button>
          </>
        )}
      </div>
      <p
        className={`text-muted-foreground h-5 shrink-0 text-center text-sm leading-5 lg:text-left ${selecting ? '' : 'invisible'}`}
      >
        进入文档后，可通过侧边栏
        <Sidebar className="mx-0.5 inline size-4 align-text-bottom" />
        随时切换年份和专业
      </p>
    </div>
  );
}
