'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  X,
  FileUp,
  FileCheck,
  ExternalLink,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

export function UploadDialog({ isOpen, onClose, url }: UploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...filesArr]);
      toast.success(`已添加 ${filesArr.length} 个待提交文件`);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArr]);
      toast.success(`已添加 ${filesArr.length} 个待提交文件`);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const generatePRTemplate = () => {
    const filenames = selectedFiles.map((f) => f.name).join(', ');
    return `### 文件上传贡献请求

- **拟新增/更名的文件**: ${filenames || '未选择具体文件'}
- **建议提交位置**: 课程资料相关文件夹
- **贡献者说明**: 通过 HOA 在线上传引导提交

Thanks for contributing to HITSZ-OpenAuto!`;
  };

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(generatePRTemplate());
      setCopied(true);
      toast.success('已复制贡献说明模版至剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败，请手动复制');
    }
  };

  const targetRepoUrl = url || 'https://github.com/HITSZ-OpenAuto';

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-dialog-title"
    >
      <div
        className="border-fd-border bg-fd-card relative w-full max-w-lg overflow-hidden rounded-xl border p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-fd-border flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-fd-primary/10 text-fd-primary flex size-9 items-center justify-center rounded-lg">
              <UploadCloud className="size-5" />
            </div>
            <div>
              <h3
                id="upload-dialog-title"
                className="text-fd-foreground text-base font-semibold"
              >
                上传文件到 HOA
              </h3>
              <p className="text-fd-muted-foreground text-xs">
                协助丰富课程资料，贡献开源社区
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground rounded-lg p-1.5 transition-colors"
            aria-label="关闭弹窗"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 py-4">
          {/* Drag and Drop Zone */}
          <div
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              dragActive
                ? 'border-fd-primary bg-fd-primary/5'
                : 'border-fd-border hover:border-fd-primary/50 hover:bg-fd-muted/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <FileUp className="text-fd-muted-foreground mb-2 size-10" />
            <p className="text-fd-foreground text-sm font-medium">
              拖拽文件到此处，或
              <span className="text-fd-primary ml-1 underline">
                点击选择文件
              </span>
            </p>
            <p className="text-fd-muted-foreground mt-1 text-xs">
              支持 PDF、Zip、Markdown、图片及各类代码/讲义文档
            </p>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-fd-muted-foreground flex items-center justify-between text-xs font-medium">
                <span>已选择 {selectedFiles.length} 个文件</span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  aria-label="清空已选择的文件"
                  className="text-fd-destructive hover:underline"
                >
                  清空
                </button>
              </div>
              <div className="max-h-36 space-y-1.5 overflow-y-auto pr-1">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="border-fd-border bg-fd-muted/40 flex items-center justify-between rounded-md border px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileCheck className="text-fd-primary size-4 shrink-0" />
                      <span className="text-fd-foreground truncate font-medium">
                        {file.name}
                      </span>
                      <span className="text-fd-muted-foreground shrink-0">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      aria-label={`移除 ${file.name}`}
                      className="text-fd-muted-foreground hover:text-fd-destructive transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workflow Note */}
          <div className="bg-fd-muted/60 border-fd-border/50 space-y-1.5 rounded-lg border p-3 text-xs">
            <div className="text-fd-foreground flex items-center gap-1.5 font-medium">
              <Info className="text-fd-primary size-4" />
              <span>开源贡献说明与步骤</span>
            </div>
            <ol className="text-fd-muted-foreground list-inside list-decimal space-y-1 pl-0.5">
              <li>上传文件将直接合并到社区官方 GitHub 课程仓库。</li>
              <li>选择好待提交的文件后，点击下面按钮前往项目仓库。</li>
              <li>在 GitHub Issue / PR 页面粘贴预检说明并提交文件即可。</li>
            </ol>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-fd-border flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyTemplate}
            className="h-8 gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-green-500" />
                已复制说明
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                复制贡献模版
              </>
            )}
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs"
            >
              取消
            </Button>
            <Button
              type="button"
              size="sm"
              asChild
              className="h-8 gap-1.5 text-xs"
            >
              <a href={targetRepoUrl} target="_blank" rel="noopener noreferrer">
                前往仓库提交
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
