'use client';

import { Info, Clock, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function CourseSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'not-prose bg-fd-secondary/50 my-6 overflow-hidden rounded-lg border p-5 space-y-4 animate-in fade-in duration-300',
        className
      )}
      aria-busy="true"
      aria-label="课程信息加载中"
    >
      {/* Header Section: 基本信息 */}
      <div className="flex flex-wrap items-center gap-4">
        <h4 className="text-fd-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <Info className="size-4 text-blue-500/50" aria-hidden="true" />
          <Skeleton className="h-4 w-16" />
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        </div>
      </div>

      {/* Middle Section: 学时分配 */}
      <div className="border-fd-border/60 flex flex-wrap items-center gap-4 border-t pt-4">
        <h4 className="text-fd-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <Clock className="size-4 text-orange-500/50" aria-hidden="true" />
          <Skeleton className="h-4 w-16" />
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>
      </div>

      {/* Bottom Section: 成绩构成 */}
      <div className="border-fd-border/60 space-y-3 border-t pt-4">
        <div className="flex items-center gap-2">
          <h4 className="text-fd-muted-foreground flex items-center gap-2 text-sm font-semibold">
            <Award className="size-4 text-yellow-500/50" aria-hidden="true" />
            <Skeleton className="h-4 w-16" />
          </h4>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-full rounded-md" />
          <div className="flex items-center justify-between text-xs">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
