import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array
  const lowercaseItems = array.map((str) => str.toLowerCase())
  const distinctItems = new Set(lowercaseItems)
  return Array.from(distinctItems)
}

// 定义 blog 集合
const blog = defineCollection({
  // 加载 `src/content/blog/` 目录下的 Markdown 和 MDX 文件。
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // 必填项
  schema: ({ image }) =>
    z.object({
      // 必填项
      title: z.string().max(60),
      description: z.string().max(160),
      publishDate: z.coerce.date(),
      // 选填项
      updatedDate: z.coerce.date().optional(),
      heroImage: z
        .object({
          src: image(),
          alt: z.string().optional(),
          inferSize: z.boolean().optional(),
          width: z.number().optional(),
          height: z.number().optional(),

          color: z.string().optional()
        })
        .optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      language: z.string().optional(),
      draft: z.boolean().default(false),
      // 特殊字段
      comment: z.boolean().default(true)
    })
})

export const collections = { blog }
