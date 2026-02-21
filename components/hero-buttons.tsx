'use client';

import { useState } from 'react';
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

const HOA_LAST_PATH_COOKIE = 'hoa-last-path';

interface HeroButtonsProps {
  yearMajorMap: Record<string, { id: string; name: string }[]>;
}

function hasCookie(): boolean {
  return document.cookie
    .split(';')
    .some((c) => c.trim().startsWith(`${HOA_LAST_PATH_COOKIE}=`));
}

export function HeroButtons({ yearMajorMap }: HeroButtonsProps) {
  const router = useRouter();
  const [selecting, setSelecting] = useState(false);
  const [year, setYear] = useState<string>('');

  const years = Object.keys(yearMajorMap).sort((a, b) => b.localeCompare(a));
  const majors = year ? (yearMajorMap[year] ?? []) : [];

  function handleDocsClick() {
    if (hasCookie()) {
      router.push('/docs');
    } else {
      setSelecting(true);
    }
  }

  function handleYearChange(value: string) {
    setYear(value);
  }

  function handleMajorChange(value: string) {
    router.push(`/docs/${year}/${value}`);
  }

  if (selecting) {
    return (
      <div className="space-y-3 pt-4">
        <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
          <Select value={year} onValueChange={handleYearChange}>
            <SelectTrigger className="rounded-full">
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
            <SelectTrigger className="rounded-full">
              <SelectValue placeholder="专业" />
            </SelectTrigger>
            <SelectContent className="min-w-0 rounded-xl">
              {majors.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground text-center text-sm lg:text-left">
          进入文档后，可通过侧边栏
          <Sidebar className="mx-0.5 inline size-4 align-text-bottom" />
          随时切换年份和专业
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4 lg:justify-start">
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
    </div>
  );
}
