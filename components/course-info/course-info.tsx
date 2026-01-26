import {
  Info,
  Clock,
  Award,
  GraduationCap,
  Tag,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CourseInfoData } from '@/lib/types';
import { InfoItem } from './info-item';
import { GradingBar } from './grading-bar';
import { formatCredit } from './utils';
import { HOUR_DISTRIBUTION_CONFIG } from './config';

type CourseInfoProps = {
  data?: CourseInfoData;
  className?: string;
};

export function CourseInfo({ data, className }: CourseInfoProps) {
  if (!data) {
    return (
      <div
        className={cn(
          'not-prose text-muted-foreground rounded-lg border border-dashed p-4 text-sm',
          className
        )}
      >
        课程信息缺失。
      </div>
    );
  }

  return (
    <section
      className={cn(
        'not-prose bg-fd-secondary/50 overflow-hidden rounded-lg border',
        className
      )}
    >
      <div className="space-y-4 px-5 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Info className="size-4 text-blue-500" />
            基本信息
          </h4>
          <dl className="flex flex-wrap items-start gap-4">
            <InfoItem
              label="学分"
              icon={GraduationCap}
              value={formatCredit(data.credit)}
            />
            <InfoItem label="课程性质" icon={Tag} value={data.courseNature} />
            <InfoItem
              label="考核方式"
              icon={ClipboardCheck}
              value={data.assessmentMethod}
            />
          </dl>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t pt-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="size-4 text-orange-500" />
            学时分配
          </h4>
          <dl className="flex flex-wrap items-start gap-4">
            {HOUR_DISTRIBUTION_CONFIG.map(({ key, label, icon }) => {
              const value = data.hourDistribution[key];
              if (value <= 0) return null;
              return (
                <InfoItem
                  key={key}
                  label={label}
                  icon={icon}
                  value={`${value} 学时`}
                />
              );
            })}
          </dl>
        </div>

        <div className="border-t pt-4">
          <div className="mb-3 flex items-center gap-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <Award className="size-4 text-yellow-500" />
              成绩构成
            </h4>
          </div>
          <GradingBar scheme={data.gradingScheme} />
        </div>
      </div>
    </section>
  );
}
