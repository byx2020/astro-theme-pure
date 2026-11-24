import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import cloudflare from '@astrojs/cloudflare'
import netlify from '@astrojs/netlify'
import vercel from '@astrojs/vercel'
import AstroPureIntegration from 'astro-pure'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// 本地集成
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
import {
  addCopyButton,
  addLanguage,
  addTitle,
  transformerNotationDiff,
  transformerNotationHighlight,
  updateStyle
} from './src/plugins/shiki-transformers.ts'
import config from './src/site.config.ts'

// 动态判断部署平台（依赖平台自动注入的环境变量）
const isVercel = !!process.env.VERCEL
const isNetlify = !!process.env.NETLIFY
const isCloudflare = !!process.env.CF_PAGES || !!process.env.CLOUDFLARE

// 适配器：根据平台自动切换
const adapter = isCloudflare
  ? cloudflare({ imageService: 'compile' }) // Cloudflare：构建期优化预渲染图片，运行时透传
  : isVercel
    ? vercel() // Vercel
    : isNetlify
      ? netlify() // Netlify
      : vercel() // 本地开发默认

export default defineConfig({
  site: process.env.SITE_URL || 'https://www.byx2020.com',
  trailingSlash: 'never',

  // 核心：动态适配器 + 静态输出（保持简洁）
  adapter: adapter,
  output: 'server',

  // 图片服务：Cloudflare 交给适配器 compile 服务；其余平台保持 sharp
  image: {
    responsiveStyles: true,
    ...(isCloudflare ? {} : { service: { entrypoint: 'astro/assets/services/sharp' } })
  },

  integrations: [
    AstroPureIntegration(config)
  ],

  prefetch: true,
  server: {
    host: true
  },

  // Markdown 配置保持不变
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
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        updateStyle(),
        addTitle(),
        addLanguage(),
        addCopyButton(2000)
      ]
    }
  },

  experimental: {
    contentIntellisense: true
  },

  vite: {
    plugins: []
  }
})

