import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import vercel from '@astrojs/vercel'
import netlify from '@astrojs/netlify'
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

// 基础适配器：根据平台自动切换，不添加额外参数
const adapter = isVercel 
  ? vercel() // Vercel 部署时使用基础适配器
  : isNetlify 
    ? netlify() // Netlify 部署时使用基础适配器
    : vercel(); // 本地开发默认（不影响部署）

export default defineConfig({
  site: 'https://www.byx2020.com',
  trailingSlash: 'never',

  // 核心：动态适配器 + 静态输出（保持简洁）
  adapter: adapter,
  output: 'server',

  // 图片服务保留基础配置（平台适配器会自动兼容）
  image: {
    responsiveStyles: true,
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
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

