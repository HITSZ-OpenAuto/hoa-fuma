'use client';

import { COURSE_AUDIT_DATABASE, type CourseAuditRecord } from '@/lib/course-review';
import { ShieldCheck, Check, UserCheck, Award } from 'lucide-react';


interface CourseReviewBadgeProps {
  courseCode: string;
}

export function CourseReviewBadge({ courseCode }: CourseReviewBadgeProps) {
  const audit: CourseAuditRecord | undefined = COURSE_AUDIT_DATABASE[courseCode.toUpperCase()];

  if (!audit) {
    return null;
  }

  const checklistItems = [
    { key: 'syllabus', label: '教学大纲' },
    { key: 'lectureNotes', label: '课件讲义' },
    { key: 'labGuides', label: '实验指导' },
    { key: 'examMaterials', label: '历年试题' },
    { key: 'licenseCompliance', label: '开源协议' },
    { key: 'codeLintPassed', label: '格式校验' },
  ];

  return (
    <div className="my-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-fd-foreground shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-500/20">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <div className="font-bold text-fd-foreground text-base flex items-center gap-2">
              <span>{audit.courseCode} 课程审查质量认证</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono">
                P3 #{audit.issueId} 已整改完成
              </span>
            </div>
            <div className="text-xs text-fd-muted-foreground mt-0.5">
              {audit.department} · {audit.courseName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-fd-muted-foreground">
            <UserCheck className="w-3.5 h-3.5" />
            <span>审核人: {audit.assignee}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>质量得分: {audit.score}/100</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-fd-muted-foreground mb-4 leading-relaxed">{audit.summary}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
        {checklistItems.map((item) => {
          const isPassed = audit.checklist[item.key as keyof typeof audit.checklist];
          return (
            <div
              key={item.key}
              className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-center transition-colors ${
                isPassed
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'bg-fd-background/50 border-fd-border text-fd-muted-foreground'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
