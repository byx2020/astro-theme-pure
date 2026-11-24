/**
 * 集中式中文 UI 文案字典。
 *
 * 这是 astro-pure 主题「Swizzle 中文化」的唯一文案来源：
 * 所有被 Swizzle 到 `src/components/custom/` 的主题组件，只在这里读取中文文案，
 * 不再各自硬编码中文。改措辞只需改本文件；跟随上游升级时，
 * swizzle 副本与上游原版的差异被收敛为「import + {ui.xxx} 字符串替换」。
 *
 * 注意：本文件不启用 Astro i18n 路由 —— 本站点为单语言（中文）站，
 * i18n 路由只管 URL 多语言前缀，不翻译 UI 字符串，对单语言站是负收益。
 */
export const ui = {
  paginator: {
    prev: '上一页',
    next: '下一页',
  },
  quote: {
    loading: '加载中…',
  },
  copyright: {
    author: '作者',
    publishedAt: '发布日期',
    copyright: '版权',
    copyLink: '复制链接',
    getQrcode: '获取二维码',
    shareTo: (target: string) => `分享到 ${target}`,
    buyCoffee: '请我喝杯咖啡 ☕',
    linkCopied: '链接已复制！',
  },
  header: {
    brand: '品牌',
    navMenuItem: '导航菜单项',
    search: '搜索',
    darkTheme: '深色主题',
    menu: '菜单',
    setTheme: (theme?: string) => {
      const map: Record<string, string> = {
        dark: '深色',
        light: '浅色',
        system: '跟随系统',
      }
      return `已切换主题为${theme ? (map[theme] ?? theme) : '系统'}`
    },
  },
  hero: {
    draft: '(草稿)',
    update: '更新日期',
    blurImage: '背景模糊图',
    viewMoreByTag: (tag: string) => `查看更多带有 ${tag} 标签的文章`,
  },
  toc: {
    title: '目录',
    scrollToSection: (text: string) => `滚动到章节：${text}`,
  },
  postPreview: {
    pin: '[置顶]',
    draft: '(草稿)',
    tags: '标签',
  },
  search: {
    devMode: '你处于开发模式，搜索功能已禁用。',
  },
  backToTop: '返回顶部',
}
