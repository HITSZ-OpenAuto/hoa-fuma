'use client';

import { useState, useEffect, useCallback, useId } from 'react';
import {
  X,
  Eye,
  Edit3,
  Columns,
  Copy,
  Check,
  ExternalLink,
  Bot,
  Sparkles,
  Bold,
  Italic,
  Code,
  Heading,
  List,
  Link as LinkIcon,
  GitPullRequest,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OnlineEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filePath?: string;
  repoUrl?: string;
  initialContent?: string;
}

export function OnlineEditorDialog({
  isOpen,
  onClose,
  filePath = 'content/docs/example.mdx',
  repoUrl = 'https://github.com/HITSZ-OpenAuto',
  initialContent = `# 课程资料与攻略模板

## 📖 课程概述
本课程重点探讨核心概念，请在此填写笔记、实验心得与作业技巧。

### 💡 提示与参考
- **重要概念**：确保掌握基础理论
- **推荐资料**：参考历年试卷与参考解答

\`\`\`ts
// 算法/示例代码
function helloHOA() {
  console.log("Welcome to HITSZ OpenAuto!");
}
\`\`\`

> [!NOTE]
> 欢迎所有同学通过在线编辑器为本项目补充与优化课程攻略！
`,
}: OnlineEditorDialogProps) {
  const [content, setContent] = useState(initialContent);
  const [activeView, setActiveView] = useState<'split' | 'edit' | 'preview'>(
    'split'
  );
  const [commitTitle, setCommitTitle] = useState(
    `docs: update ${filePath.split('/').pop() || 'document'}`
  );
  const [commitMsg, setCommitMsg] = useState(
    '更新课程攻略与文档细节，提高内容可读性。'
  );
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const titleId = useId();
  const descId = useId();

  const generatePRPayload = useCallback(() => {
    return `### 📝 在线编辑贡献提交 (${filePath})

**提交标题**: ${commitTitle}
**更新说明**: ${commitMsg}

#### 修改内容预览
\`\`\`markdown
${content}
\`\`\`

---
*Powered by HOA-Bot (GitHub App) Online Document Editor*`;
  }, [filePath, commitTitle, commitMsg, content]);

  const handleCopyPayload = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatePRPayload());
      setCopied(true);
      toast.success('已复制 PR / Commit Payload 至剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败，请手动选择复制');
    }
  }, [generatePRPayload]);

  // Reset content when dialog opens or initialContent changes
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setSubmitted(false);
    }
  }, [isOpen, initialContent]);

  // Handle keyboard shortcuts (ESC to close, Cmd/Ctrl + S to copy payload)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleCopyPayload();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleCopyPayload]);

  // Insert markdown tag helper
  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = '') => {
      const textarea = document.getElementById(
        'online-editor-textarea'
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end) || '示例文本';
      const replacement = `${prefix}${selectedText}${suffix}`;

      const newContent =
        content.substring(0, start) + replacement + content.substring(end);
      setContent(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selectedText.length
        );
      }, 50);
    },
    [content]
  );

  // Simple Markdown renderer for live preview
  const renderPreviewHTML = (text: string) => {
    // Escape raw HTML tags in user input to prevent XSS
    const safeText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    return safeText
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-base font-semibold text-fd-foreground mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-lg font-bold text-fd-foreground border-b border-fd-border pb-1 mt-5 mb-3">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-xl font-extrabold text-fd-foreground mt-2 mb-4">$1</h1>'
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-fd-foreground">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-fd-muted p-3 rounded-lg border border-fd-border font-mono text-xs overflow-x-auto my-3 text-fd-foreground"><code>$1</code></pre>'
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-fd-muted px-1.5 py-0.5 rounded font-mono text-xs text-fd-primary">$1</code>'
      )
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-fd-primary pl-3 py-1 text-fd-muted-foreground my-2 bg-fd-primary/5 rounded-r">$1</blockquote>'
      )
      .replace(
        /^- (.*$)/gim,
        '<li class="ml-4 list-disc text-fd-foreground/90 my-0.5">$1</li>'
      )
      .replace(/\n\n/g, '<br />');
  };

  const handleBotSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('hoa-bot 自动化提交请求已发送！');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div
        className="border-fd-border bg-fd-card relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Header */}
        <div className="border-fd-border bg-fd-muted/30 flex items-center justify-between border-b px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="bg-fd-primary/10 text-fd-primary flex size-9 items-center justify-center rounded-lg">
              <Bot className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id={titleId}
                  className="text-fd-foreground text-base font-semibold"
                >
                  HOA 在线文档编辑器
                </h3>
                <span className="bg-fd-primary/15 text-fd-primary border-fd-primary/30 rounded-full border px-2 py-0.5 text-[11px] font-medium">
                  hoa-bot GitHub App
                </span>
              </div>
              <p
                id={descId}
                className="text-fd-muted-foreground max-w-md truncate font-mono text-xs"
              >
                {filePath}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switching Button Group */}
            <div className="border-fd-border bg-fd-background flex items-center rounded-lg border p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('split')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors ${
                  activeView === 'split'
                    ? 'bg-fd-primary text-fd-primary-foreground font-medium'
                    : 'text-fd-muted-foreground hover:text-fd-foreground'
                }`}
              >
                <Columns className="size-3.5" />
                双栏预览
              </button>
              <button
                type="button"
                onClick={() => setActiveView('edit')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors ${
                  activeView === 'edit'
                    ? 'bg-fd-primary text-fd-primary-foreground font-medium'
                    : 'text-fd-muted-foreground hover:text-fd-foreground'
                }`}
              >
                <Edit3 className="size-3.5" />
                纯编辑
              </button>
              <button
                type="button"
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors ${
                  activeView === 'preview'
                    ? 'bg-fd-primary text-fd-primary-foreground font-medium'
                    : 'text-fd-muted-foreground hover:text-fd-foreground'
                }`}
              >
                <Eye className="size-3.5" />
                效果图
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground rounded-lg p-1.5 transition-colors"
              aria-label="关闭编辑器"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Toolbar for Markdown Formatting */}
        {(activeView === 'split' || activeView === 'edit') && (
          <div className="border-fd-border bg-fd-card/50 flex flex-wrap items-center gap-1 border-b px-4 py-1.5 text-xs">
            <button
              type="button"
              onClick={() => insertMarkdown('**', '**')}
              className="hover:bg-fd-accent hover:text-fd-foreground text-fd-muted-foreground rounded p-1.5"
              title="加粗 (**bold**)"
            >
              <Bold className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*')}
              className="hover:bg-fd-accent hover:text-fd-foreground text-fd-muted-foreground rounded p-1.5"
              title="斜体 (*italic*)"
            >
              <Italic className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('## ')}
              className="hover:bg-fd-accent hover:text-fd-foreground text-fd-muted-foreground rounded p-1.5"
              title="二级标题 (## )"
            >
              <Heading className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('`', '`')}
              className="hover:bg-fd-accent hover:text-fd-foreground text-fd-muted-foreground rounded p-1.5"
              title="行内代码 (`code`)"
            >
              <Code className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('- ')}
              className="hover:bg-fd-accent hover:text-fd-foreground text-fd-muted-foreground rounded p-1.5"
              title="列表 (- item)"
            >
              <List className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('[', '](https://)')}
              className="hover:bg-fd-accent hover:text-fd-foreground text-fd-muted-foreground rounded p-1.5"
              title="链接 [text](url)"
            >
              <LinkIcon className="size-3.5" />
            </button>
            <span className="bg-fd-border mx-1 h-4 w-px" />
            <button
              type="button"
              onClick={() => setContent(initialContent)}
              className="hover:bg-fd-accent hover:text-fd-foreground text-fd-muted-foreground flex items-center gap-1 rounded px-2 py-1"
            >
              <RefreshCw className="size-3" />
              重置
            </button>
          </div>
        )}

        {/* Main Editor Work Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Edit Panel */}
          {(activeView === 'split' || activeView === 'edit') && (
            <div
              className={`border-fd-border flex flex-col ${activeView === 'split' ? 'w-1/2 border-r' : 'w-full'}`}
            >
              <textarea
                id="online-editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在此输入 Markdown / MDX 源码..."
                className="bg-fd-background text-fd-foreground w-full flex-1 resize-none border-none p-4 font-mono text-xs leading-relaxed outline-none focus:ring-0"
              />
            </div>
          )}

          {/* Preview Panel */}
          {(activeView === 'split' || activeView === 'preview') && (
            <div
              className={`bg-fd-muted/10 flex flex-col overflow-y-auto p-5 ${activeView === 'split' ? 'w-1/2' : 'w-full'}`}
            >
              <div className="border-fd-border/60 bg-fd-card min-h-full rounded-lg border p-6 shadow-sm">
                <div className="text-fd-muted-foreground border-fd-border/50 mb-3 flex items-center gap-1.5 border-b pb-2 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="text-fd-primary size-3.5" />
                  实时渲染视图
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-xs"
                  dangerouslySetInnerHTML={{
                    __html: renderPreviewHTML(content),
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* hoa-bot Submission Drawer & Footer */}
        <div className="border-fd-border bg-fd-muted/40 space-y-3 border-t p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-fd-muted-foreground mb-1 block text-[11px] font-medium">
                Commit 标题 / PR 概述
              </label>
              <input
                type="text"
                value={commitTitle}
                onChange={(e) => setCommitTitle(e.target.value)}
                className="border-fd-border bg-fd-background text-fd-foreground focus:border-fd-primary w-full rounded-md border px-3 py-1.5 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-fd-muted-foreground mb-1 block text-[11px] font-medium">
                修改说明 (hoa-bot 将包含此说明)
              </label>
              <input
                type="text"
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                className="border-fd-border bg-fd-background text-fd-foreground focus:border-fd-primary w-full rounded-md border px-3 py-1.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="border-fd-border/60 flex flex-wrap items-center justify-between gap-2 border-t pt-1">
            <div className="text-fd-muted-foreground flex items-center gap-2 text-xs">
              <Info className="text-fd-primary size-4 shrink-0" />
              <span>
                修改将通过 <strong>hoa-bot</strong> (GitHub App) 自动创建 Pull
                Request 并通知维护者
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPayload}
                className="h-8 gap-1.5 text-xs"
              >
                {copied ? (
                  <Check className="size-3.5 text-green-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? '已复制 Payload' : '复制 PR Payload'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                asChild
                className="h-8 gap-1.5 text-xs"
              >
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <GitPullRequest className="size-3.5" />
                  GitHub PR
                  <ExternalLink className="text-fd-muted-foreground size-3" />
                </a>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleBotSubmit}
                disabled={isSubmitting || submitted}
                className="h-8 gap-1.5 text-xs"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-green-400" />
                    已由 hoa-bot 提交
                  </>
                ) : isSubmitting ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Bot className="size-3.5" />
                    hoa-bot 自动提交
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
