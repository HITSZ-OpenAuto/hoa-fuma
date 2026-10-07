'use client';

import { useCallback, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AGENT_PROMPT =
  '请阅读 https://hoa.moe/install.txt，按其中的步骤安装 HOA Agent Skills，安装完成后告诉我如何向 HOA 贡献内容。';

export function CopyAgentPrompt() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <Button
      variant="secondary"
      size="lg"
      className="hidden rounded-full transition-transform hover:scale-105 lg:inline-flex"
      onClick={handleCopy}
    >
      {copied ? <Check aria-hidden="true" className="size-4" /> : null}
      <span aria-live="polite">
        {copied ? '已复制提示词' : '安装 Agent 技能'}
      </span>
    </Button>
  );
}
