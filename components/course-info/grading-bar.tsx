import { cn } from '@/lib/utils';
import type { CourseGradingScheme } from '@/lib/types';
import { GRADING_SCHEME_CONFIG } from './config';

export function GradingBar({ scheme }: { scheme: CourseGradingScheme }) {
  const activeItems = GRADING_SCHEME_CONFIG.filter(
    ({ key }) => scheme[key] > 0
  );
  const regularItems = activeItems.filter(
    ({ key }) => key !== 'finalExamination'
  );
  const finalItem = activeItems.find(({ key }) => key === 'finalExamination');
  const regularTotal = regularItems.reduce(
    (sum, { key }) => sum + scheme[key],
    0
  );

  return (
    <div className="flex w-full flex-col gap-1 sm:flex-row sm:gap-px">
      <div
        className="flex min-w-0 gap-px"
        style={{ flex: `${regularTotal} 0 0` }}
      >
        {regularItems.map(({ key, label, bgClass, textClass }) => {
          const percentage = scheme[key];
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
      {finalItem && (
        <div style={{ flex: `${scheme.finalExamination} 0 0` }}>
          <div className="text-muted-foreground mb-1 truncate text-xs">
            {finalItem.label}
          </div>
          <div
            className={cn(
              'flex h-4 items-center justify-center text-xs font-medium',
              finalItem.bgClass,
              finalItem.textClass
            )}
            title={`${finalItem.label} ${scheme.finalExamination}%`}
          >
            {scheme.finalExamination >= 10 && `${scheme.finalExamination}%`}
          </div>
        </div>
      )}
    </div>
  );
}
