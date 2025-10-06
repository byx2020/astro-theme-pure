import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // === 基本配置 ===
  /** 网站标题。将用于元数据和浏览器标签页标题。 */
  title: '边缘星云',
  /** 将用于首页和版权声明 */
  author: '边缘星2020',
  /** 网站的描述元数据。可用于页面元数据。 */
  description: '个人网站',
  /** 网站的默认图标，应为`public/`目录中图片的路径。 */
  favicon: '/favicon/favicon.ico',
  /** 指定本网站的默认语言。 */
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    // 日期语言设置
    dateLocale: 'zh-CN',
    dateOptions: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
  },
  /** 设置要在首页显示的logo图片。 */
  logo: {
    src: 'src/assets/xz_cr_500x500.webp',
    alt: 'Avatar'
  },

  // === 全局配置 ===
  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // 仍在测试中
  head: [
    /*  Telegram频道 */
    // {
    //   tag: 'meta',
    //   attrs: { name: 'telegram:channel', content: '@cworld0_cn' },
    //   content: ''
    // }
  ],
  customCss: [],

  /** 配置网站的头部。 */
  header: {
    menu: [
  { title: '博客', link: '/blog' },
  // { title: '项目', link: '/projects' },
  { title: '友链', link: '/links' },
  { title: '关于', link: '/about' }
    ]
  },

  /** 配置网站的底部。 */
  footer: {
    // 年份格式
    // year: `© ${new Date().getFullYear()}`,
    year: `© 2020-${new Date().getFullYear()} `,
    // links: [
    //   // 备案链接
    //   {
    //     title: '萌ICP备案 114514',
    //     link: 'https://icp.gov.moe/?keyword=114514',
    //     style: 'text-sm' // Uno/TW CSS类
    //   },
    //   {
    //     title: '旅行者',
    //     link: 'https://www.travellings.cn/go.html',
    //     style: 'text-sm'
    //   },
    //   // 隐私政策链接
    //   {
    //     title: '网站政策',
    //     link: '/terms/list',
    //     pos: 2 // 位置设为2将被附加到版权行
    //   }
    // ],
    /** 启用在网站底部显示“由Astro和Pure主题提供支持”链接。 */
    credits: true,
    /** 本网站社交媒体账户的可选详情。 */
    social: { github: 'https://github.com/byx2020' }
  },

  content: {
    /** 外部链接配置 */
    externalLinks: {
      content: ' ↗',
      /** 外部链接元素的属性 */
      properties: {
        style: 'user-select:none'
      }
    },
    /** 博客分页的页面大小（可选） */
    blogPageSize: 8,
    // 目前支持微博、x、bluesky
    share: ['weibo', 'x', 'bluesky']
  }
}

export const integ: IntegrationUserConfig = {
  // 链接管理
  // 查看：https://astro-pure.js.org/docs/integrations/links
  links: {
    // 友链日志
    logbook: [
  { date: '2025-03-16', content: '有漏水吗？' },
  { date: '2025-03-16', content: '漏了什么？' },
  { date: '2025-03-16', content: '我这里全是水，真的，全是水！' },
  { date: '2025-03-16', content: '肯定是水的问题。' },
  { date: '2025-03-16', content: '把这句加到智慧语录里吧。' }
    ],
    // 自身链接信息
    applyTip: [
  { name: '名称', val: theme.title },
  { name: '简介', val: theme.description || '无' },
  { name: '链接', val: 'https://byx2020.com/' },
  { name: '头像', val: 'https://byx2020.com/favicon/favicon.ico' }
    ]
  },
  // 启用页面搜索功能
  pagefind: true,
  // 在底部添加随机名言（默认在首页底部）
  // 查看：https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  quote: {
    // https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%9C%B0%E5%9D%80
    // server: 'https://v1.hitokoto.cn/?c=i',
    // target: (data) => (data as { hitokoto: string }).hitokoto || 'Error'
    // https://github.com/lukePeavey/quotable
    // https://api.quotable.io/quotes/random?maxLength=60
    // target: `(data) => data[0].content || 'Error'`
    server: 'https://v1.jinrishici.com/tianqi/xingxing',
    target: `(data) => data.content || 'Error'`
  },
  // UnoCSS排版
  // 查看：https://unocss.dev/presets/typography
  typography: {
    class: 'prose text-base text-muted-foreground',
    // 块引用字体样式，正常或斜体（排版中默认斜体）
    blockquoteStyle: 'normal',
    // 行内代码块样式，code或modern（排版中默认code）
    inlineCodeBlockStyle: 'modern'
  },
  // 可添加缩放效果的灯箱库
  // 查看：https://astro-pure.js.org/docs/integrations/others#medium-zoom
  mediumZoom: {
    enable: true, // 禁用将不会加载整个库
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // 评论系统
  waline: {
    enable: true,
    // 服务器服务链接
    server: 'https://waline.byx2020.com/',
    // 参考 https://waline.js.org/en/guide/features/emoji.html
    emoji: ['bmoji', 'weibo'],
    // 参考 https://waline.js.org/en/reference/client/props.html
    additionalConfigs: {
      // search: false,
      pageview: true,
      comment: true,
      locale: {
        reaction0: '点赞',
        placeholder: '欢迎评论。（填写邮箱可接收回复，无需登录）'
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
