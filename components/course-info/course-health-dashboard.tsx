'use client';

import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CourseInfoData } from '@/lib/types';
import {
  COURSE_AUDIT_DATABASE,
  type CourseAuditRecord,
} from '@/lib/course-review';
import {
  calculateCourseHealth,
  getHealthGradeColor,
} from '@/lib/course-health';

export interface CourseHealthDashboardProps {
  courseData?: CourseInfoData;
  courseCode?: string;
  auditRecord?: CourseAuditRecord;
  className?: string;
}

export function CourseHealthDashboard({
  courseData,
  courseCode,
  auditRecord,
  className,
}: CourseHealthDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeAudit =
    auditRecord || (courseCode ? COURSE_AUDIT_DATABASE[courseCode] : undefined);
  const report = calculateCourseHealth(courseData, activeAudit);
  const colorStyle = getHealthGradeColor(report.grade);

  return (
    <div
      className={cn(
        'not-prose bg-fd-secondary/40 my-6 overflow-hidden rounded-xl border border-fd-border p-5 shadow-xs transition-all',
        className
      )}
      role="region"
      aria-label="课程健康度评估仪表盘"
    >
      {/* Header */}
      <div className="border-fd-border/70 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-fd-primary/10 text-fd-primary flex size-9 items-center justify-center rounded-lg">
            <Activity className="size-5" />
          </div>
          <div>
            <h4 className="flex items-center gap-2 text-base font-semibold">
              课程健康度 / 完整度评估
            </h4>
            <p className="text-fd-muted-foreground text-xs">
              基于文档元数据与社区 Auditing 评测标准
            </p>
          </div>
        </div>

        {/* Grade & Score Badge */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
              colorStyle.badge
            )}
          >
            <ShieldCheck className="size-3.5" />
            {report.statusLabel} ({report.grade})
          </span>
          <div className="text-right">
            <span
              className={cn('text-2xl font-bold font-mono', colorStyle.text)}
            >
              {report.score}
            </span>
            <span className="text-fd-muted-foreground text-xs"> / 100 分</span>
          </div>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="text-fd-muted-foreground flex items-center justify-between text-xs font-medium">
          <span>
            完成度进度 ({report.passedCount}/{report.totalCount} 项对标通过)
          </span>
          <span>{report.score}%</span>
        </div>
        <div className="bg-fd-muted h-2.5 w-full overflow-hidden rounded-full">
          <div
            className={cn(
              'h-full transition-all duration-500 rounded-full',
              colorStyle.bar
            )}
            style={{ width: `${report.score}%` }}
          />
        </div>
      </div>

      {/* Checklist Preview */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {report.metrics
          .slice(0, isExpanded ? report.metrics.length : 6)
          .map((metric) => (
            <div
              key={metric.id}
              className={cn(
                'flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-colors',
                metric.passed
                  ? 'border-fd-border/50 bg-fd-card/60 text-fd-foreground'
                  : 'border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200'
              )}
            >
              {metric.passed ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between font-medium">
                  <span>{metric.name}</span>
                  <span className="text-fd-muted-foreground font-mono text-[10px]">
                    {metric.passed ? `+${metric.weight}分` : '未完成'}
                  </span>
                </div>
                <p className="text-fd-muted-foreground mt-0.5 truncate text-[11px]">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Expand / Collapse toggle */}
      {report.metrics.length > 6 && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-fd-primary inline-flex items-center gap-1 text-xs font-medium hover:underline focus:outline-hidden"
          >
            {isExpanded ? (
              <>
                收起评估细项 <ChevronUp className="size-3.5" />
              </>
            ) : (
              <>
                查看全部 {report.metrics.length} 项细分指标{' '}
                <ChevronDown className="size-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Improvement Suggestions Box */}
      {report.suggestions.length > 0 && (
        <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-900 dark:text-blue-200">
          <div className="mb-1 flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-300">
            <Sparkles className="size-3.5 text-blue-500" />
            社区改进建议
          </div>
          <ul className="text-fd-muted-foreground list-inside list-disc space-y-1">
            {report.suggestions.map((item, idx) => (
              <li key={idx} className="truncate">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
