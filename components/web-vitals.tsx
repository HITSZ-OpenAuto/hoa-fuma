'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { Activity, ChevronDown, ChevronUp, Gauge } from 'lucide-react';

export interface MetricData {
  id: string;
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor' | string;
  delta: number;
}

function getRatingColor(rating?: string) {
  switch (rating) {
    case 'good':
      return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400';
    case 'needs-improvement':
      return 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400';
    case 'poor':
      return 'bg-rose-500/15 text-rose-600 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

function formatMetricValue(name: string, value: number) {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)} ms`;
}

function WebVitalsContent() {
  const searchParams = useSearchParams();
  const isDev = process.env.NODE_ENV === 'development';
  const isDebug = searchParams.get('debug_perf') === '1';
  const showBadge = isDev || isDebug;

  const [metrics, setMetrics] = useState<Record<string, MetricData>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useReportWebVitals((metric) => {
    const metricItem: MetricData = {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    };

    setMetrics((prev) => ({
      ...prev,
      [metric.name]: metricItem,
    }));

    const payload = JSON.stringify(metricItem);
    const url = '/api/analytics/vitals';

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  });

  if (!showBadge) return null;

  const metricKeys = Object.keys(metrics);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans text-xs select-none">
      <div className="flex flex-col items-end gap-1.5">
        {isExpanded && (
          <div className="w-72 overflow-hidden rounded-xl border border-border bg-popover/95 p-3 text-popover-foreground shadow-lg backdrop-blur-md transition-all duration-200">
            <div className="mb-2.5 flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-1.5 font-semibold">
                <Gauge className="h-4 w-4 text-primary" />
                <span>Web Vitals Debug</span>
              </div>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary uppercase">
                {isDev ? 'DEV' : 'DEBUG'}
              </span>
            </div>

            {metricKeys.length === 0 ? (
              <p className="py-3 text-center text-muted-foreground">
                Collecting performance metrics...
              </p>
            ) : (
              <div className="space-y-1.5">
                {Object.values(metrics).map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between rounded-lg bg-muted/40 px-2.5 py-1.5 transition-colors hover:bg-muted/70"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-muted-foreground">
                        {formatMetricValue(m.name, m.value)}
                      </span>
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${getRatingColor(m.rating)}`}
                      >
                        {m.rating || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-foreground shadow-md backdrop-blur-md hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-95"
          aria-label="Toggle Web Vitals Debug Panel"
        >
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">Vitals</span>
          {metricKeys.length > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary/20 px-1 text-[10px] font-bold text-primary">
              {metricKeys.length}
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}

export function WebVitalsMonitor() {
  return (
    <Suspense fallback={null}>
      <WebVitalsContent />
    </Suspense>
  );
}

export function WebVitals() {
  return <WebVitalsMonitor />;
}

export default WebVitalsMonitor;
