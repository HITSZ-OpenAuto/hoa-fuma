import { NextResponse } from 'next/server';
import { source } from '@/lib/source/docs';

export async function GET() {
  const baseUrl = 'https://hoa.moe';
  const pages = source.getPages();

  const itemsXml = pages
    .slice(0, 50)
    .map(
      (page) => `
    <item>
      <title><![CDATA[${page.data.title || 'HOA 文档'}]]></title>
      <link>${baseUrl}${page.url}</link>
      <guid isPermaLink="true">${baseUrl}${page.url}</guid>
      <description><![CDATA[${page.data.description || 'HITSZ OpenAuto 课程与项目文档资料'}]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HITSZ-OpenAuto (hoa.moe) 课程与文档更新</title>
    <link>${baseUrl}</link>
    <description>哈尔滨工业大学（深圳）开源自动化与全校课程资料平台</description>
    <language>zh-CN</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
