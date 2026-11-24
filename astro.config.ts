import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import cloudflare from '@astrojs/cloudflare'
import netlify from '@astrojs/netlify'
import vercel from '@astrojs/vercel'
import AstroPureIntegration from 'astro-pure'
import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config'
import type { FontProvider } from 'astro'
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
// - Vercel 注入 VERCEL；Netlify 注入 NETLIFY；
// - Cloudflare Pages 注入 CF_PAGES，Cloudflare Workers（新版统一体验）注入 WORKERS_CI，
//   CLOUDFLARE 为兼容兜底。
const isVercel = !!process.env.VERCEL
const isNetlify = !!process.env.NETLIFY
const isCloudflare = !!process.env.CF_PAGES || !!process.env.CLOUDFLARE || !!process.env.WORKERS_CI

// 适配器：根据平台自动切换
const adapter = isCloudflare
  ? cloudflare({ imageService: 'compile' }) // Cloudflare：构建期优化预渲染图片，运行时透传
  : isNetlify
    ? netlify() // Netlify：构建期 sharp 优化
    : vercel({ imageService: true }) // Vercel（默认 / 本地开发）

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
  // Enable font preloading and optimization
  // https://docs.astro.build/en/guides/fonts/
  // 使用本地自托管 Satoshi 可变字体（复用本地 public/fonts 的字体文件），
  // 避免 fontshare CDN 网络依赖，同时保留 --font-satoshi 变量供主题 <Font> 组件使用。
  fonts: [
    {
      // 类型断言为 FontProvider<Record<string, any>>，规避 tsconfig declaration:true 下
      // local() 返回 FontProvider<LocalFamilyOptions>（LocalFamilyOptions 未导出）导致 ts(2883) 类型泄漏
      provider: fontProviders.local() as FontProvider<Record<string, any>>,
      name: 'Satoshi',
      cssVariable: '--font-satoshi',
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/Satoshi-Variable.ttf'],
            weight: '100 900',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/Satoshi-VariableItalic.ttf'],
            weight: '100 900',
            style: 'italic'
          }
        ]
      }
    }
  ],

  // [Markdown]
  markdown: {
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
    ],
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
    // astro-pure will automatically add sitemap, mdx & unocss
    // sitemap(),
    // mdx(),
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
