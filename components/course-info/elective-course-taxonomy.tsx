'use client';

import { useState } from 'react';
import { ELECTIVE_CATEGORIES } from '@/lib/elective-courses';

import { BookOpen, GitBranch, Lightbulb, Users, CheckCircle2, ChevronRight } from 'lucide-react';

const iconMap = {
  BookOpen,
  GitBranch,
  Lightbulb,
  Users,
};

export function ElectiveCourseTaxonomy() {
  const [selectedId, setSelectedId] = useState<string>(ELECTIVE_CATEGORIES[0].id);

  const activeCategory = ELECTIVE_CATEGORIES.find((c) => c.id === selectedId) ?? ELECTIVE_CATEGORIES[0];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-fd-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> 全校通选课体系重构规范 (.github #26)
          </div>
          <h3 className="text-xl font-bold text-fd-foreground">HITSZ 全校选修课程体系架构</h3>
          <p className="text-sm text-fd-muted-foreground mt-1">
            覆盖通识、跨专业、创新创业与社会实践四大选修板块，实现学分与课程资料分类归档。
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {ELECTIVE_CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon as keyof typeof iconMap] || BookOpen;
          const isSelected = cat.id === selectedId;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedId(cat.id)}
              className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? `bg-fd-accent/10 ${cat.color} ring-2 ring-blue-500/40 shadow-sm`
                  : 'border-fd-border bg-fd-background hover:bg-fd-accent/5 text-fd-foreground'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-md ${cat.color.split(' ')[0]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{cat.name}</div>
                  <div className="text-[11px] text-fd-muted-foreground opacity-80">{cat.nameEn}</div>
                </div>
              </div>
              <div className="text-xs text-fd-muted-foreground line-clamp-2">{cat.description}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Details */}
      <div className="rounded-lg border border-fd-border bg-fd-background p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-fd-foreground text-lg">{activeCategory.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-fd-secondary text-fd-secondary-foreground font-mono">
              建议最低学分: {activeCategory.minCreditsRequired} 学分
            </span>
          </div>
          <span className="text-xs text-fd-muted-foreground font-mono">ID: {activeCategory.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeCategory.subDomains.map((sub) => (
            <div
              key={sub.code}
              className="flex items-start gap-3 p-3.5 rounded-md border border-fd-border/70 bg-fd-card/60 hover:bg-fd-card transition-colors"
            >
              <div className="p-1.5 rounded bg-blue-500/10 text-blue-500 font-mono text-xs font-bold shrink-0">
                {sub.code}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-fd-foreground flex items-center gap-1">
                  {sub.title}
                  <ChevronRight className="w-3.5 h-3.5 text-fd-muted-foreground shrink-0" />
                </div>
                <div className="text-xs text-fd-muted-foreground mt-0.5">{sub.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
