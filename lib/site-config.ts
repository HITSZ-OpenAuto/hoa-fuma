export interface SiteConfig {
  name: string;
  domain: string;
  orgName: string;
  orgUrl: string;
  fullProjectName: string;
  tagline: string;
  description: string;
  renamingHistory: {
    legacyName: string;
    currentName: string;
    canonicalDomain: string;
    notice: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  name: 'hoa.moe',
  domain: 'https://hoa.moe',
  orgName: 'HITSZ-OpenAuto',
  orgUrl: 'https://github.com/HITSZ-OpenAuto',
  fullProjectName: 'HITSZ-OpenAuto (hoa.moe)',
  tagline: '哈尔滨工业大学（深圳）开源课程与学习资源社区',
  description: '全校课程资料共享、在线文档预览与社区共同维护平台',
  renamingHistory: {
    legacyName: 'HITSZ-OpenAuto',
    currentName: 'hoa.moe / OpenAuto',
    canonicalDomain: 'hoa.moe',
    notice: '为了统一品牌标识并提升国际化体验，组织主站点与相关服务统一归纳为 hoa.moe (OpenAuto) 品牌框架。',
  },
};
