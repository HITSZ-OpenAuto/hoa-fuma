import type { Metadata } from 'next';
import { Callout } from 'fumadocs-ui/components/callout';

export const metadata: Metadata = {
  title: '隐私政策 - HITSZ 课程攻略共享计划',
  description: 'HITSZ OpenAuto 隐私政策',
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-12 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">隐私政策</h1>

      <section className="prose dark:prose-invert max-w-none space-y-6">
        <p>
          HITSZ
          OpenAuto（hoa.moe）重视你的隐私。本页面说明我们如何收集和使用访问数据。
        </p>

        <h2 className="text-xl font-semibold">我们使用的分析工具</h2>
        <p>
          本站使用{' '}
          <a
            href="https://umami.is"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-primary underline"
          >
            Umami
          </a>{' '}
          进行网站访问分析。Umami
          是一款开源、注重隐私的网站分析工具，我们仅启用了基础功能。
        </p>

        <h2 className="text-xl font-semibold">Umami 收集的信息</h2>
        <p>Umami 基础模式会收集以下非个人身份信息：</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>页面 URL 和来源页面（Referrer）</strong> —
            了解哪些页面被访问以及访问来源
          </li>
          <li>
            <strong>浏览器、操作系统和设备类型</strong> — 从 User-Agent
            中提取的基础信息
          </li>
          <li>
            <strong>国家/地区</strong> — 从匿名化的 IP
            地址中获取，无法定位到具体地址
          </li>
          <li>
            <strong>屏幕分辨率和语言</strong> — 用于统计访问设备特征
          </li>
        </ul>

        <Callout type="info" title="我们不会">
          <ul className="mt-1 list-disc space-y-1 pl-6">
            <li>使用 Cookies 追踪用户</li>
            <li>收集个人身份信息（姓名、邮箱等）</li>
            <li>进行跨站点追踪或浏览器指纹识别</li>
            <li>将数据分享给第三方</li>
          </ul>
        </Callout>

        <h2 className="text-xl font-semibold">数据存储</h2>
        <p>
          所有分析数据存储在我们自己托管的 Umami
          实例（stats.hoa.moe）中，不会上传至任何第三方服务器。
        </p>

        <h2 className="text-xl font-semibold">联系方式</h2>
        <p>
          如果你对本隐私政策有任何疑问，请通过邮件联系我们：{' '}
          <a href="mailto:hi@hoa.moe" className="text-fd-primary underline">
            hi@hoa.moe
          </a>
        </p>

        <p className="text-muted-foreground text-sm">
          本政策最后更新于 2026 年 7 月 5 日。
        </p>
      </section>
    </main>
  );
}
