'use client';

import * as React from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgPreview: string;
  vars: Record<string, string>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: '标准经典主调',
    primaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    bgPreview: '#0f172a',
    vars: {
      '--primary': '217.2 91.2% 59.8%',
      '--accent': '217.2 91.2% 95%',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    description: '柔美马卡龙基调',
    primaryColor: '#cba6f7',
    accentColor: '#f5c2e7',
    bgPreview: '#1e1e2e',
    vars: {
      '--primary': '267 84% 81%',
      '--accent': '316 73% 86%',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: '暗黑朋克紫系',
    primaryColor: '#bd93f9',
    accentColor: '#ff79c6',
    bgPreview: '#282a36',
    vars: {
      '--primary': '265 89% 78%',
      '--accent': '326 100% 74%',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: '极地冰雪沉静蓝',
    primaryColor: '#88c0d0',
    accentColor: '#81a1c1',
    bgPreview: '#2e3440',
    vars: {
      '--primary': '193 43% 67%',
      '--accent': '210 34% 63%',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: '赛博霓虹黄紫',
    primaryColor: '#facc15',
    accentColor: '#f43f5e',
    bgPreview: '#18181b',
    vars: {
      '--primary': '48 96% 53%',
      '--accent': '345 89% 60%',
    },
  },
];

const STORAGE_KEY = 'hoa_theme_preset';

export function ThemeCustomizerDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState('default');

  const applyPreset = React.useCallback((presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId) || THEME_PRESETS[0];
    document.documentElement.dataset.themePreset = preset.id;

    Object.entries(preset.vars).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });

    setActivePreset(preset.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, preset.id);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        applyPreset(saved);
      }
    }
  }, [applyPreset]);

  const selectPreset = (presetId: string) => {
    applyPreset(presetId);
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    toast.success(`预设主题已更改为 ${preset?.name}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsOpen(true)}
        title="自定义主题样式"
      >
        <Palette className="size-4" />
        <span className="sr-only">自定义主题</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">主题预设定制</h2>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                选择适合您的设计色彩方案，更改将即时应用并持久保存。
              </p>

              <div className="grid gap-3 pt-2">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = activePreset === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => selectPreset(preset.id)}
                      className={cn(
                        'flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all hover:border-primary/50',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-8 items-center justify-center rounded-lg border border-white/10 shadow-xs"
                          style={{ backgroundColor: preset.bgPreview }}
                        >
                          <div className="flex gap-1">
                            <span
                              className="size-2.5 rounded-full"
                              style={{ backgroundColor: preset.primaryColor }}
                            />
                            <span
                              className="size-2.5 rounded-full"
                              style={{ backgroundColor: preset.accentColor }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{preset.name}</span>
                            {isSelected && (
                              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                当前
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{preset.description}</span>
                        </div>
                      </div>

                      {isSelected && <Check className="size-4 text-primary stroke-[2.5]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 border-t pt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                完成
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
