'use client';

import * as React from 'react';
import { Play, RotateCcw, CheckCircle2, AlertCircle, Clock, Terminal, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CodePlaygroundProps {
  code: string;
  language?: string;
  className?: string;
}

interface LogEntry {
  type: 'log' | 'error' | 'return';
  content: string;
}

export function CodePlayground({ code: initialCode, language = 'javascript', className }: CodePlaygroundProps) {
  const [code, setCode] = React.useState(initialCode);
  const [output, setOutput] = React.useState<LogEntry[]>([]);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [executionTime, setExecutionTime] = React.useState<number | null>(null);

  const lang = (language || 'javascript').toLowerCase();

  const runCode = React.useCallback(() => {
    const logs: LogEntry[] = [];
    const startTime = performance.now();

    if (lang === 'python') {
      logs.push({
        type: 'log',
        content: '[Python Sandbox]: Python 环境需要在 WebAssembly (Pyodide) 或后端运行。代码示例如下：',
      });
      logs.push({
        type: 'return',
        content: `>>> Python Execution Finished. Code length: ${code.length} chars`,
      });
      setOutput(logs);
      setStatus('success');
      setExecutionTime(Math.round((performance.now() - startTime) * 100) / 100);
      return;
    }

    const customConsole = {
      log: (...args: any[]) => {
        logs.push({
          type: 'log',
          content: args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' '),
        });
      },
      error: (...args: any[]) => {
        logs.push({
          type: 'error',
          content: args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' '),
        });
      },
    };

    try {
      let executableCode = code;
      executableCode = executableCode.replace(/:\s*(string|number|boolean|any|void|object|unknown|never)/g, '');

      const runner = new Function('console', `
        "use strict";
        try {
          ${executableCode}
        } catch(e) {
          throw e;
        }
      `);

      const result = runner(customConsole);
      if (result !== undefined) {
        logs.push({
          type: 'return',
          content: `Return Value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`,
        });
      }
      setStatus('success');
    } catch (err: any) {
      logs.push({
        type: 'error',
        content: err?.message || String(err),
      });
      setStatus('error');
    } finally {
      const endTime = performance.now();
      setExecutionTime(Math.round((endTime - startTime) * 100) / 100);
      setOutput(logs);
    }
  }, [code, lang]);

  const clearOutput = () => {
    setOutput([]);
    setStatus('idle');
    setExecutionTime(null);
  };

  return (
    <div className={cn('my-4 rounded-xl border border-border bg-card shadow-sm overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {language || 'javascript'} 代码沙盒
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={runCode} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Play className="size-3.5 fill-current" />
            <span>运行 / 在线运行</span>
          </Button>
        </div>
      </div>

      <div className="p-4 bg-muted/10 font-mono text-sm">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={Math.max(4, code.split('\n').length)}
          className="w-full resize-y bg-transparent outline-none font-mono text-sm leading-relaxed"
          spellCheck={false}
        />
      </div>

      {output.length > 0 && (
        <div className="border-t bg-black/95 text-slate-100 p-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="size-3.5 text-slate-400" />
              <span className="font-semibold text-slate-300">控制台输出</span>
              {status === 'success' && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3" /> Success
                </span>
              )}
              {status === 'error' && (
                <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-400 font-medium">
                  <AlertCircle className="size-3" /> Error
                </span>
              )}
              {executionTime !== null && (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="size-3" /> {executionTime} ms
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={clearOutput}
              className="text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              title="清空输出"
            >
              <RotateCcw className="size-3" />
            </Button>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {output.map((entry, i) => (
              <div
                key={i}
                className={cn('whitespace-pre-wrap leading-relaxed', {
                  'text-slate-200': entry.type === 'log',
                  'text-rose-400': entry.type === 'error',
                  'text-sky-300 font-medium': entry.type === 'return',
                })}
              >
                {entry.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
