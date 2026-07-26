'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Bot, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const AGENT_PROMPT =
  '请阅读 https://hoa.moe/install.txt，按其中的步骤安装 HOA Agent Skills，安装完成后告诉我如何向 HOA 贡献内容。';

const AGENT_LOGOS = [
  { src: '/logos/claudecode.svg', alt: 'Claude Code' },
  { src: '/logos/codex.svg', alt: 'Codex' },
  { src: '/logos/trae.svg', alt: 'TRAE' },
  { src: '/logos/workbuddy.png', alt: 'WorkBuddy' },
];

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
      <span className="flex items-center">
        {AGENT_LOGOS.map((logo, index) => (
          <span
            key={logo.src}
            className={`bg-background flex size-5 items-center justify-center rounded-full border ${index > 0 ? '-ml-1.5' : ''}`}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              title={logo.alt}
              width={12}
              height={12}
              className="size-3 rounded-full"
            />
          </span>
        ))}
      </span>
    </Button>
  );
}
