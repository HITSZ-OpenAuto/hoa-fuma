'use client';

import { SITE_CONFIG } from '@/lib/site-config';
import { RefreshCw, ExternalLink, ShieldCheck, Tag } from 'lucide-react';

export function ProjectRenamingBanner() {
  const { renamingHistory, orgName, orgUrl } = SITE_CONFIG;

  return (
    <div className="my-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-fd-foreground shadow-sm">
      <div className="flex items-center gap-2.5 mb-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
        <RefreshCw className="w-4 h-4 animate-spin-slow" />
        <span>项目更名与品牌规范说明 (.github #18)</span>
      </div>
      <div className="text-sm text-fd-muted-foreground leading-relaxed mb-3">
        {renamingHistory.notice}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-fd-background/80 border border-fd-border">
          <Tag className="w-4 h-4 text-fd-muted-foreground shrink-0" />
          <div>
            <span className="text-fd-muted-foreground block text-[10px]">原项目组织名</span>
            <span className="font-mono font-semibold">{renamingHistory.legacyName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-fd-background/80 border border-fd-border">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <span className="text-fd-muted-foreground block text-[10px]">全新标准品牌</span>
            <span className="font-mono font-bold text-blue-500">{renamingHistory.currentName}</span>
          </div>
        </div>
        <a
          href={orgUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-2.5 rounded-lg bg-fd-background/80 border border-fd-border hover:border-amber-500/50 transition-colors"
        >
          <div>
            <span className="text-fd-muted-foreground block text-[10px]">GitHub 组织根域名</span>
            <span className="font-mono font-medium">{orgName}</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-fd-muted-foreground" />
        </a>
      </div>
    </div>
  );
}
