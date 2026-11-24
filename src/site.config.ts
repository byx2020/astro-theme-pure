import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // [Basic]
  /** Title for your website. Will be used in metadata and as browser tab title. */
  title: '边缘星云',
  /** Will be used in index page & copyright declaration */
  author: '边缘星2020',
  /** Description metadata for your website. Can be used in page metadata. */
  description: '边缘星2020的个人网站，包含EdgeCloud文档、边缘星的杂货铺、红色警戒2地图及其他博客文章等内容',
  /** The default favicon for your site which should be a path to an image in the `public/` directory. */
  favicon: '/favicon/favicon.ico',
  /** The default social card image for your site which should be a path to an image in the `public/` directory. */
  socialCard: '/images/social-card.png',
  /** Specify the default language for this site. */
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    // Date locale
    dateLocale: 'zh-CN',
    dateOptions: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
  },
  /** Set a logo image to show in the homepage. */
  logo: {
    src: '/src/assets/xz_cr_500x500.webp',
    alt: 'Avatar'
  },

  titleDelimiter: '•',
  prerender: true, // pagefind search is not supported with prerendering disabled
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // Still in test
  head: [
    {
      tag: 'meta',
      attrs: {
        name: 'keywords',
        content: '边缘星云, 边缘星2020, byx2020, edgestar2020, 边缘星的杂货铺, 边缘星, edgestar, byx, 边缘云, edgecloud'
      }
    }
    /* Telegram channel */
    // {
    //   tag: 'meta',
    //   attrs: { name: 'telegram:channel', content: '@cworld0_cn' },
    //   content: ''
    // }
  ],
  customCss: [],

  /** Configure the header of your site. */
  header: {
    menu: [
      { title: '文章', link: '/posts' },
      // { title: 'Docs', link: '/docs' },
      // { title: 'Projects', link: '/projects' },
      { title: '友链', link: '/links' },
      { title: '关于', link: '/about' }
    ]
  },

  /** Configure the footer of your site. */
  footer: {
    // Year format
    year: `© 2020-${new Date().getFullYear()} `,
    // links: [
    //   // Registration link
    //   {
    //     title: '萌ICP备案',
    //     link: 'https://icp.gov.moe/?keyword=',
    //     style: 'text-sm' // Uno/TW CSS class
    //   },
    //   // Privacy Policy link
    //   {
    //     title: '网站政策',
    //     link: '/terms',
    //     pos: 2 // position set to 2 will be appended to copyright line
    //   }
    // ],
    /** Enable displaying a “Astro & Pure theme powered” link in your site’s footer. */
    credits: true,
    /** Optional details about the social media accounts for this site. */
    social: [
      { icon: 'github', label: 'GitHub', href: 'https://github.com/byx2020' }
    ]
  },

  // [Content]
  content: {
    /** External links configuration */
    externalLinks: {
      content: ' ↗',
      /** Properties for the external links element */
      properties: { style: 'user-select:none' }
    },
    /** Blog page size for pagination (optional) */
    blogPageSize: 10,
    /** Share buttons to show */
    // Currently support weibo, x, bluesky
    share: ['weibo', 'x', 'bluesky']
    /** Enable image captions (default false) */
    // imageCaption: true
  }
}

export const integ: IntegrationUserConfig = {
  // [Links]
  // https://astro-pure.js.org/docs/integrations/links
  links: {
    // Friend logbook
    logbook: [
      { date: '2025-03-16', content: '有漏水吗？' },
      { date: '2025-03-16', content: '漏了什么？' },
      { date: '2025-03-16', content: '我这里全是水，真的，全是水！' },
      { date: '2025-03-16', content: '肯定是水的问题。' },
      { date: '2025-03-16', content: '把这句加到智慧语录里吧。' }
    ],
    // Yourself link info
    applyTip: [
      { name: '名称', val: theme.title },
      { name: '简介', val: theme.description || '无' },
      { name: '链接', val: 'https://byx2020.com/' },
      { name: '头像', val: 'https://byx2020.com/favicon/favicon.ico' }
    ],
    // Cache avatars in `public/avatars/` to improve user experience.
    cacheAvatar: false
  },
  // [Search]
  pagefind: true,
  // Add a random quote to the footer (default on homepage footer)
  // See: https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  // [Quote]
  quote: {
    // - 本地 quotes.json（P2 已复制）
    server: '/quotes.json',
    target: `(data) => {
      const quotes = Array.isArray(data) ? data : [];
      if (quotes.length === 0) return '众星罗列夜明深，岩点孤灯月未沉';
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    }`
  },
  // [Typography]
  // https://unocss.dev/presets/typography
  typography: {
    class: 'prose text-base text-muted-foreground',
    // The style of blockquote font `normal` / `italic` (default to italic in typography)
    blockquoteStyle: 'normal',
    // The style of inline code block `code` / `modern` (default to code in typography)
    inlineCodeBlockStyle: 'modern'
  },
  // [Lightbox]
  // A lightbox library that can add zoom effect
  // https://astro-pure.js.org/docs/integrations/others#medium-zoom
  mediumZoom: {
    enable: true, // disable it will not load the whole library
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // Comment system
  waline: {
    enable: true,
    // Server service link
    server: 'https://waline.byx2020.com/',
    // Show meta info for comments
    showMeta: false,
    // Refer https://waline.js.org/en/guide/features/emoji.html
    emoji: ['qq', 'tieba', 'bmoji', 'weibo'],
    // Refer https://waline.js.org/en/reference/client/props.html
    additionalConfigs: {
      search: false,
      pageview: true,
      comment: true,
      locale: {
        reaction0: '点赞',
        placeholder: '欢迎评论留言。\n（填写邮箱后可在评论区显示你的Gravatar头像，同时在你的评论被他人回复时会收到邮件通知，无需登录）'
      },
      imageUploader: false
    }
  }
}

export const terms: CardListData = {
  title: '条款内容',
  list: [
    {
      title: '隐私政策',
      link: '/terms/privacy-policy'
    },
    {
      title: '服务条款',
      link: '/terms/terms-and-conditions'
    },
    {
      title: '版权声明',
      link: '/terms/copyright'
    },
    {
      title: '免责声明',
      link: '/terms/disclaimer'
    }
  ]
}

const config = { ...theme, integ } as Config
export default config
