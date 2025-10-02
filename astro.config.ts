import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import vercel from '@astrojs/vercel'
import AstroPureIntegration from 'astro-pure'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// 其他插件
// import { visualizer } from 'rollup-plugin-visualizer'

// 本地集成
// 本地 rehype & remark 插件
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
// Shiki 相关
import {
  addCopyButton,
  addLanguage,
  addTitle,
  transformerNotationDiff,
  transformerNotationHighlight,
  updateStyle
} from './src/plugins/shiki-transformers.ts'
import config from './src/site.config.ts'

// Astro 官方配置文档：https://astro.build/config
export default defineConfig({
  // 顶层选项
  site: 'https://astro-pure.js.org',
  // 部署到子路径；参考：https://astro-pure.js.org/docs/setup/deployment#platform-with-base-path
  // base: '/astro-pure/',
  trailingSlash: 'never',

  // 适配器
  // Astro 部署指南：https://docs.astro.build/en/guides/deploy/
  // 1. Vercel（无服务器）
  adapter: vercel(),
  output: 'server',
  // 2. Vercel（静态）
  // adapter: vercelStatic(),
  // 3. 本地（独立模式）
  // adapter: node({ mode: 'standalone' }),
  // output: 'server',
  // ---

  image: {
    responsiveStyles: true,
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }, // 图片服务相关

  integrations: [
    // astro-pure 会自动添加 sitemap、mdx 和 unocss
    // sitemap(),
    // mdx(),
    AstroPureIntegration(config)
    // (await import('@playform/compress')).default({
    //   SVG: false,
    //   Exclude: ['index.*.js']
    // }),

    // Vercel 适配器临时修复
    // 不需要静态构建方法
  ],
  // 项目根目录设置示例
  // root: './my-project-directory',

  // 预取选项
  prefetch: true,
  // 服务器选项
  server: {
    host: true
  },
  // Markdown 配置
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
    // Astro 语法高亮文档：https://docs.astro.build/en/guides/syntax-highlighting/
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
    plugins: [
      //   visualizer({
      //     emitFile: true,
      //     filename: 'stats.html'
      //   })
    ]
  }
})
