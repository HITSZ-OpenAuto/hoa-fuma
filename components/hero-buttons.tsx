'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Sidebar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CopyAgentPrompt } from '@/components/copy-agent-prompt';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';
import type { StudyLevel, YearMajorMap } from '@/lib/docs-utils';

interface HeroButtonsProps {
  yearMajorMap: YearMajorMap;
}

function hasCookie(name: string): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .some((cookie) => cookie.trim().startsWith(`${name}=`));
}

export function HeroButtons({ yearMajorMap }: HeroButtonsProps) {
  const router = useRouter();
  const [selecting, setSelecting] = useState(false);
  const [studyLevel, setStudyLevel] = useState<StudyLevel>('undergrad');
  const [year, setYear] = useState<string | null>(null);

  const years = useMemo(
    () =>
      Object.keys(yearMajorMap)
        .filter((year) =>
          yearMajorMap[year].some((major) => major.studyLevel === studyLevel)
        )
        .sort((a, b) => b.localeCompare(a)),
    [yearMajorMap, studyLevel]
  );

  const majors = useMemo(
    () =>
      year
        ? (yearMajorMap[year] ?? []).filter(
            (major) => major.studyLevel === studyLevel
          )
        : [],
    [yearMajorMap, year, studyLevel]
  );

  const handleDocsClick = useCallback(() => {
    if (hasCookie(HOA_LAST_PATH_COOKIE)) {
      router.push('/docs');
    } else {
      setSelecting(true);
    }
  }, [router]);

  const handleYearChange = useCallback((value: string | null) => {
    setYear(value);
  }, []);

  const handleMajorChange = useCallback(
    (value: string | null) => {
      if (value === null) return;
      router.push(`/docs/${year}/${value}`);
    },
    [router, year]
  );

  const rowClasses = selecting
    ? 'flex flex-col items-center gap-2 pt-4 lg:items-start'
    : 'flex flex-wrap justify-center gap-4 pt-4 lg:justify-start min-h-10 items-center';
  const triggerClasses =
    'h-9 rounded-lg border-0 px-3 shadow-none hover:bg-accent data-popup-open:bg-accent dark:bg-transparent dark:hover:bg-accent [&>svg]:hidden';

  return (
    <div className="flex min-h-24 flex-col gap-3">
      <div className={rowClasses}>
        {selecting ? (
          <>
            <p
              id="program-selection-hint"
              className="text-muted-foreground text-sm leading-5"
            >
              选择培养方案
            </p>
            <div
              role="group"
              aria-label="选择培养方案"
              aria-describedby="program-selection-hint"
              className="bg-background/80 inline-flex max-w-full items-center gap-1 rounded-xl border p-1 shadow-xs"
            >
              <Select<StudyLevel>
                value={studyLevel}
                onValueChange={(value) => {
                  if (!value) return;
                  setStudyLevel(value);
                  setYear(null);
                }}
              >
                <SelectTrigger className={triggerClasses} aria-label="培养层次">
                  <SelectValue>
                    {studyLevel === 'postgrad' ? '研究生' : '本科生'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  align="start"
                  className="rounded-xl"
                >
                  <SelectItem value="undergrad">本科生</SelectItem>
                  <SelectItem value="postgrad">研究生</SelectItem>
                </SelectContent>
              </Select>
              <ChevronRight
                aria-hidden="true"
                className="text-muted-foreground/50 size-3.5 shrink-0"
              />
              <Select value={year} onValueChange={handleYearChange}>
                <SelectTrigger className={triggerClasses} aria-label="入学年份">
                  <SelectValue placeholder="入学年份" />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  align="start"
                  className="rounded-xl"
                >
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ChevronRight
                aria-hidden="true"
                className="text-muted-foreground/50 size-3.5 shrink-0"
              />
              <Select
                value={null}
                onValueChange={handleMajorChange}
                disabled={!year}
              >
                <SelectTrigger className={triggerClasses} aria-label="专业">
                  <SelectValue placeholder="专业" />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  align="start"
                  className="max-h-72 rounded-xl"
                >
                  {majors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <CopyAgentPrompt />
          </>
        )}
      </div>
      <p
        className={`text-muted-foreground min-h-5 shrink-0 text-center text-sm leading-5 lg:text-left ${selecting ? '' : 'invisible'}`}
      >
        进入文档后，可通过侧边栏
        <Sidebar className="mx-0.5 inline size-4 align-text-bottom" />
        随时切换年份和专业
      </p>
    </div>
  );
}
