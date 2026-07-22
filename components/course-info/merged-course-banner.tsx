'use client';

import { MERGED_COURSE_MAP } from '@/lib/merged-courses';
import { GitMerge, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';


interface MergedCourseBannerProps {
  courseCode: string;
}

export function MergedCourseBanner({ courseCode }: MergedCourseBannerProps) {
  const mergedInfo = MERGED_COURSE_MAP[courseCode.toUpperCase()];

  if (!mergedInfo) {
    return null;
  }

  return (
    <div className="my-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 text-fd-foreground shadow-sm">
      <div className="flex items-center gap-2.5 mb-2 text-blue-500 font-bold text-sm">
        <GitMerge className="w-4 h-4" />
        <span>合班/跨专业课程归档提示 (ECON3001 #1)</span>
      </div>
      <div className="flex items-start gap-2.5 text-sm text-fd-muted-foreground mb-4">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p>{mergedInfo.reason}</p>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg bg-fd-background/80 border border-fd-border text-xs">
        <div>
          <span className="text-fd-muted-foreground block text-[10px]">原课程代码</span>
          <span className="font-mono font-bold text-fd-foreground">{courseCode.toUpperCase()}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-fd-muted-foreground" />
        <div>
          <span className="text-fd-muted-foreground block text-[10px]">目标归档仓库</span>
          <span className="font-mono font-bold text-emerald-500">{mergedInfo.targetRepo}</span>
        </div>
        <Link
          href={mergedInfo.targetPath}
          className="px-3 py-1.5 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
        >
          前往归档页面
        </Link>
      </div>
    </div>
  );
}
