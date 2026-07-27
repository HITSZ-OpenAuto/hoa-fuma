import { defineI18n } from 'fumadocs-core/i18n';

export type Locale = 'zh-CN' | 'en-US';

export const i18n = defineI18n({
  defaultLanguage: 'zh-CN',
  languages: ['zh-CN', 'en-US'],
  hideLocale: 'default-locale',
});

export const translations = {
  'zh-CN': {
    search: '搜索',
    feedback: '页面反馈',
    edit: '编辑此页',
    theme: '主题模式',
    language: '语言',
    helpful: '有帮助',
    unhelpful: '无帮助',
    offlineSearch: '离线搜索模式',
    copyCode: '复制代码',
    copied: '已复制',
    zoomImage: '点击放大',
    close: '关闭',
    docs: '文档',
    blog: '博客',
    news: '新闻',
    links: '友链',
    wasThisHelpful: '这一页对你有帮助吗？',
    sendFeedback: '发送反馈',
    leaveComment: '请留下您的宝贵意见或建议...',
    thankYouFeedback: '感谢您的反馈！',
    submitting: '提交中...',
    noResults: '未找到相关结果',
    enterQuery: '输入关键词搜索...',
  },
  'en-US': {
    search: 'Search',
    feedback: 'Page Feedback',
    edit: 'Edit Page',
    theme: 'Theme',
    language: 'Language',
    helpful: 'Helpful',
    unhelpful: 'Unhelpful',
    offlineSearch: 'Offline Search Mode',
    copyCode: 'Copy Code',
    copied: 'Copied',
    zoomImage: 'Click to zoom',
    close: 'Close',
    docs: 'Docs',
    blog: 'Blog',
    news: 'News',
    links: 'Links',
    wasThisHelpful: 'Was this page helpful?',
    sendFeedback: 'Send Feedback',
    leaveComment: 'Please leave your feedback or suggestions...',
    thankYouFeedback: 'Thank you for your feedback!',
    submitting: 'Submitting...',
    noResults: 'No results found',
    enterQuery: 'Type keywords to search...',
  },
} as const;

export type TranslationKey = keyof typeof translations['zh-CN'];

export const STORAGE_KEY = 'hoa_locale';
export const LOCALE_CHANGE_EVENT = 'hoa-locale-change';

export function getTranslation(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] ?? translations['zh-CN'][key] ?? key;
}
