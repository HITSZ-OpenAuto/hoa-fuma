import { cn } from '@/lib/utils';
import type { CourseGradingScheme } from '@/lib/types';

const COLOR_CLASSES = [
  { bg: 'bg-emerald-200', text: 'text-emerald-700' },
  { bg: 'bg-blue-200', text: 'text-blue-700' },
  { bg: 'bg-purple-200', text: 'text-purple-700' },
  { bg: 'bg-amber-200', text: 'text-amber-700' },
  { bg: 'bg-rose-200', text: 'text-rose-700' },
  { bg: 'bg-cyan-200', text: 'text-cyan-700' },
  { bg: 'bg-indigo-200', text: 'text-indigo-700' },
];

export function GradingBar({ scheme }: { scheme: CourseGradingScheme }) {
  if (!scheme || scheme.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">暂无成绩构成信息</div>
    );
  }

  return (
    <div className="flex w-full flex-row flex-wrap gap-1">
      {scheme.map((item, index) => {
        const colors = COLOR_CLASSES[index % COLOR_CLASSES.length];
        return (
          <div key={item.name} style={{ flex: `${item.percent} 0 0` }}>
            <div className="text-muted-foreground mb-1 truncate text-xs">
              {item.name}
            </div>
            <div
              className={cn(
                'flex h-4 items-center justify-center text-xs font-medium',
                colors.bg,
                colors.text
              )}
              title={`${item.name} ${item.percent}%`}
            >
              {`${item.percent}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
