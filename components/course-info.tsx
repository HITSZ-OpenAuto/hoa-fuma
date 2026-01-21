import type { ReactNode, ComponentType, SVGProps } from 'react';
import { cn } from '@/lib/utils';
import type { CourseInfoData } from '@/lib/types';
import {
  GraduationCap,
  Tag,
  ClipboardCheck,
  BookOpen,
  Beaker,
  UserCheck,
  PencilLine,
  Monitor,
  Users,
  Clock,
  Info,
  Award,
} from 'lucide-react';

type CourseInfoProps = {
  data?: CourseInfoData;
  className?: string;
};

function formatCredit(credit: number) {
  return Number.isInteger(credit) ? credit.toFixed(1) : credit.toString();
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="flex items-start gap-3">
      <dt className="text-muted-foreground flex items-center gap-2 text-sm">
        <Icon className="size-4" />
        {label}
      </dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

const HOUR_DISTRIBUTION_CONFIG = [
  { key: 'theory', label: '理论', icon: BookOpen },
  { key: 'lab', label: '实验', icon: Beaker },
  { key: 'practice', label: '实践', icon: UserCheck },
  { key: 'exercise', label: '习题', icon: PencilLine },
  { key: 'computer', label: '上机', icon: Monitor },
  { key: 'tutoring', label: '辅导', icon: Users },
] as const;

const GRADING_SCHEME_CONFIG = [
  {
    key: 'classParticipation',
    label: '平时表现',
    bgClass: 'bg-emerald-200',
    textClass: 'text-emerald-700',
  },
  {
    key: 'homeworkAssignments',
    label: '平时作业',
    bgClass: 'bg-blue-200',
    textClass: 'text-blue-700',
  },
  {
    key: 'laboratoryWork',
    label: '实验成绩',
    bgClass: 'bg-purple-200',
    textClass: 'text-purple-700',
  },
  {
    key: 'finalExamination',
    label: '期末考试',
    bgClass: 'bg-amber-200',
    textClass: 'text-amber-700',
  },
] as const;

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
          {(() => {
            const activeItems = GRADING_SCHEME_CONFIG.filter(
              ({ key }) => data.gradingScheme[key] > 0
            );
            const regularItems = activeItems.filter(
              ({ key }) => key !== 'finalExamination'
            );
            const finalItem = activeItems.find(
              ({ key }) => key === 'finalExamination'
            );
            const regularTotal = regularItems.reduce(
              (sum, { key }) => sum + data.gradingScheme[key],
              0
            );

            return (
              <div className="flex w-full flex-col gap-1 sm:flex-row sm:gap-px">
                {/* First row: all items except final exam */}
                <div
                  className="flex min-w-0 gap-px"
                  style={{ flex: `${regularTotal} 0 0` }}
                >
                  {regularItems.map(({ key, label, bgClass, textClass }) => {
                    const percentage = data.gradingScheme[key];
                    return (
                      <div key={key} style={{ flex: `${percentage} 0 0` }}>
                        <div className="text-muted-foreground mb-1 truncate text-xs">
                          {label}
                        </div>
                        <div
                          className={cn(
                            'flex h-4 items-center justify-center text-xs font-medium',
                            bgClass,
                            textClass
                          )}
                          title={`${label} ${percentage}%`}
                        >
                          {percentage >= 10 && `${percentage}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Second row on mobile, inline on desktop: final exam */}
                {finalItem && (
                  <div
                    style={{
                      flex: `${data.gradingScheme.finalExamination} 0 0`,
                    }}
                  >
                    <div className="text-muted-foreground mb-1 truncate text-xs">
                      {finalItem.label}
                    </div>
                    <div
                      className={cn(
                        'flex h-4 items-center justify-center text-xs font-medium',
                        finalItem.bgClass,
                        finalItem.textClass
                      )}
                      title={`${finalItem.label} ${data.gradingScheme.finalExamination}%`}
                    >
                      {data.gradingScheme.finalExamination >= 10 &&
                        `${data.gradingScheme.finalExamination}%`}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
