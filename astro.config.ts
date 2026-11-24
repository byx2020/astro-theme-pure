import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import AstroPureIntegration from 'astro-pure'
import { defineConfig, svgoOptimizer } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// Local integrations
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
// Shiki
import {
  addCollapse,
  addCopyButton,
  addLanguage,
  addTitle,
  updateStyle
} from './src/plugins/shiki-custom-transformers.ts'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerRemoveNotationEscape
} from './src/plugins/shiki-official/transformers.ts'
import config from './src/site.config.ts'

// 动态判断部署平台（依赖平台自动注入的环境变量）
// - Netlify 注入 NETLIFY；
// - Cloudflare Pages 注入 CF_PAGES，Cloudflare Workers（新版统一体验）注入 WORKERS_CI，
//   CLOUDFLARE 为兼容兜底；
// - Vercel 为默认分支（未命中上两者即 Vercel / 本地开发），无需显式检测。
const isNetlify = !!process.env.NETLIFY
const isCloudflare = !!process.env.CF_PAGES || !!process.env.CLOUDFLARE || !!process.env.WORKERS_CI

// 适配器：根据平台动态 import，只加载当前平台的适配器。
// 为什么不能顶层静态 import 三个适配器：配置加载阶段 Node 会解析所有静态 import，
// 例如 Vercel 构建时会连带加载 @astrojs/netlify → @netlify/config → find-up，
// 而 Vercel 用 bun install + Node 运行，bun 的 hoisting 布局会让 find-up 在
// 嵌套路径 @netlify/config/node_modules/find-up 找不到，报
// "Cannot find package .../@netlify/config/node_modules/find-up/index.js"。
// 改用动态 import 后，Vercel 只加载 @astrojs/vercel，从源头规避该依赖解析问题。
const adapter = isCloudflare
  ? (await import('@astrojs/cloudflare')).default({ imageService: 'compile' }) // Cloudflare：构建期优化预渲染图片，运行时透传
  : isNetlify
    ? (await import('@astrojs/netlify')).default() // Netlify：构建期 sharp 优化
    : (await import('@astrojs/vercel')).default({ imageService: true }) // Vercel（默认 / 本地开发）

// https://astro.build/config
export default defineConfig({
  // [Basic]
  site: process.env.SITE_URL || 'https://www.byx2020.com',
  // Deploy to a sub path
  // https://astro-pure.js.org/docs/setup/deployment#platform-with-base-path
  // base: '/astro-pure/',
  trailingSlash: 'never',
  // root: './my-project-directory',
  server: { host: true },
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: {
    // prefetchAll: true,
    defaultStrategy: 'viewport'
  },

  // [Adapter]
  // https://docs.astro.build/en/guides/deploy/
  adapter: adapter,
  output: 'server',
  // Local (standalone)
  // adapter: node({ mode: 'standalone' }),
  // output: 'server',

  // [Assets]
  image: {
    responsiveStyles: true,
    // Cloudflare 分支不显式设 sharp（由适配器 imageService:'compile' 接管）；
    // 其余平台（Vercel/Netlify/本地）保持构建期 sharp 优化。
    ...(isCloudflare ? {} : { service: { entrypoint: 'astro/assets/services/sharp' } }),
    // domains: ['ghchart.rshah.org'],
    remotePatterns: [{ protocol: 'https' }]
  },
  // 不再加载自定义字体：移除 Satoshi 本地字体配置，改用访问者设备已安装的系统字体
  // （字体栈见 BaseHead.astro 的 body font-family），以提升加载速度。

  // [Markdown]
  markdown: {
    // 使用 Astro 6 推荐的 unified() 配置 remark/rehype 插件与 GFM，
    // 替代已废弃的 markdown.remarkPlugins / rehypePlugins / gfm，消除 deprecation 警告。
    // 注意：unified() 的 gfm 只作用于 .md 文件；.mdx 的 GFM 表格由下方 integrations 中
    // 显式注册的 mdx({ gfm: true }) 保证（@astrojs/mdx 不会读取 processor 里的 gfm）。
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [rehypeKatex, {}],
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: { className: ['anchor'] },
            content: { type: 'text', value: '#' }
          }
        ]
      ]
    }),
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        // Two copies of @shikijs/types (one under node_modules
        // and another nested under @astrojs/markdown-remark → shiki).
        // Official transformers
        // @ts-ignore this happens due to multiple versions of shiki types
        transformerNotationDiff(),
        // @ts-ignore this happens due to multiple versions of shiki types
        transformerNotationHighlight(),
        // @ts-ignore this happens due to multiple versions of shiki types
        transformerRemoveNotationEscape(),
        // Custom transformers
        // @ts-ignore this happens due to multiple versions of shiki types
        updateStyle(),
        // @ts-ignore this happens due to multiple versions of shiki types
        addTitle(),
        // @ts-ignore this happens due to multiple versions of shiki types
        addLanguage(),
        // @ts-ignore this happens due to multiple versions of shiki types
        addCopyButton(2000), // timeout in ms
        // @ts-ignore this happens due to multiple versions of shiki types
        addCollapse(15) // max lines that needs to collapse
      ]
    }
  },

  // [Integrations]
  integrations: [
    // 显式注册 mdx 并启用 gfm，确保 .mdx 文件的 GFM 表格正常渲染
    // （unified() 的 gfm 不影响 MDX）。astro-pure 会检测到已存在 @astrojs/mdx
    // 而跳过其默认注册 mdx({ optimize: true })。
    mdx({ gfm: true, optimize: true }),
    // astro-pure will automatically add sitemap, mdx & unocss
    // sitemap(),
    AstroPureIntegration(config)
  ],

  // [Experimental]
  experimental: {
    // Allow compatible editors to support intellisense features for content collection entries
    // https://docs.astro.build/en/reference/experimental-flags/content-intellisense/
    contentIntellisense: true,
    // Enable SVGO optimization for SVG assets
    // https://docs.astro.build/en/reference/experimental-flags/svg-optimization/
    svgOptimizer: svgoOptimizer(),
    // Enables pre-rendering your prefetched pages on the client in supported browsers.
    // https://docs.astro.build/en/reference/experimental-flags/client-prerender/
    clientPrerender: true,
    // https://docs.astro.build/en/reference/experimental-flags/queued-rendering/
    queuedRendering: {
      enabled: true
    }
  }
})
