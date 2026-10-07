'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import Link from 'fumadocs-core/link';
import { Check, ChevronsUpDown, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import type { StudyLevel } from '@/lib/docs-utils';

export function StudyLevelSelector({
  options,
  studyLevel,
}: {
  options: { level: StudyLevel; url: string }[];
  studyLevel: StudyLevel;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="bg-fd-secondary/50 text-fd-secondary-foreground hover:bg-fd-accent data-popup-open:bg-fd-accent data-popup-open:text-fd-accent-foreground flex items-center gap-2 rounded-lg border p-2 text-start transition-colors">
        <div className="text-fd-primary flex size-5 shrink-0 items-center justify-center">
          <GraduationCap className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium">培养层次</p>
          <p className="text-fd-muted-foreground text-[0.8125rem] leading-4">
            {studyLevel === 'postgrad' ? '研究生' : '本科生'}
          </p>
        </div>
        <ChevronsUpDown className="text-fd-muted-foreground ms-auto size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent className="flex w-(--anchor-width) flex-col gap-1 p-1">
        {options.map(({ level, url }) => (
          <Link
            key={level}
            href={url}
            onClick={() => setOpen(false)}
            className="hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-2 rounded-lg p-1.5"
          >
            <span className="text-sm font-medium">
              {level === 'postgrad' ? '研究生' : '本科生'}
            </span>
            <Check
              className={`text-fd-primary ms-auto size-3.5 shrink-0 ${level === studyLevel ? '' : 'invisible'}`}
            />
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  );
}
