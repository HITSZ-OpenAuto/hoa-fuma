'use client';

import { useCallback, useState } from 'react';
import { Bot, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const AGENT_PROMPT =
  '请阅读 https://hoa.moe/install.txt，按其中的步骤安装 HOA Agent Skills，安装完成后告诉我如何向 HOA 贡献内容。';

export function CopyAgentPrompt() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT);
      setCopied(true);
      toast.success('已复制，粘贴给你的 AI 助手即可开始贡献');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败，请手动访问 hoa.moe/install.txt');
    }
  }, []);

  return (
    <Button
      variant="secondary"
      size="lg"
      className="hidden rounded-full transition-transform hover:scale-105 lg:inline-flex"
      onClick={handleCopy}
    >
      {copied ? <Check className="size-4" /> : <Bot className="size-4" />}
      Agent 技能
    </Button>
  );
}
