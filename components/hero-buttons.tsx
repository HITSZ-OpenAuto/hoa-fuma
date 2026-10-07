'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, CircleAlert } from 'lucide-react';
import { Tooltip } from '@base-ui/react/tooltip';
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
  const [hintOpen, setHintOpen] = useState(false);

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
            <div className="text-muted-foreground flex items-center gap-1 text-sm leading-5">
              <p id="program-selection-hint">请选择你的培养方案</p>
              <Tooltip.Root open={hintOpen} onOpenChange={setHintOpen}>
                <Tooltip.Trigger
                  aria-label="培养方案切换提示"
                  aria-describedby="program-selection-tooltip"
                  closeOnClick={false}
                  onClick={() => setHintOpen(true)}
                  className="hover:text-foreground focus-visible:ring-ring/50 inline-flex size-6 items-center justify-center rounded-md bg-transparent outline-none focus-visible:ring-2"
                >
                  <CircleAlert aria-hidden="true" className="size-3.5" />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner sideOffset={6} className="z-50">
                    <Tooltip.Popup
                      id="program-selection-tooltip"
                      role="tooltip"
                      className="bg-popover text-popover-foreground max-w-64 rounded-lg border px-3 py-2 text-xs leading-5 shadow-md"
                    >
                      进入文档后，可通过侧边栏随时切换培养方案
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
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
    </div>
  );
}
