import { defineConfig, presetMini, presetTypography, type Rule } from 'unocss'
// 导入UnoCSS的核心配置函数、迷你预设、排版预设以及规则类型

import { integ } from './src/site.config.ts'
// 从站点配置文件导入集成配置

const typographyCustom = integ.typography || {}
// 获取自定义排版配置（若站点配置中无typography属性则默认为空对象）

// 定义常用颜色变量（基于CSS自定义属性，用于排版配置）
// fg：主要文字颜色（使用前景色变量，带透明度控制）
const fg = 'hsl(var(--foreground) / var(--un-text-opacity, 1))'
// fgMuted：弱化文字颜色（使用弱化区域文字颜色变量，带透明度控制）
const fgMuted = 'hsl(var(--muted-foreground) / var(--un-text-opacity, 1))'
// bgMuted：弱化背景颜色（使用弱化区域背景色变量，带透明度控制）
const bgMuted = 'hsl(var(--muted) / var(--un-bg-opacity, 1))'

// 排版预设的自定义配置
const typographyConfig = {
  cssExtend: {
    // 标题样式配置
    'h2,h3,h4,h5,h6': {
      'scroll-margin-top': '3rem', // 滚动时标题距离顶部的边距（用于锚点跳转定位）
      // 'font-weight': '500', // 注释掉的字体权重配置
      'font-weight': '600', // 字体权重为600（半粗体）
      color: fg // 文字颜色使用主要文字颜色
    },
    // 标题内链接样式（通常是锚点链接）
    'h1>a,h2>a,h3>a,h4>a,h5>a,h6>a': {
      'margin-inline-start': '0.75rem', // 左侧外边距
      color: fgMuted, // 链接颜色使用弱化文字颜色
      transition: 'opacity 0.2s ease', // 透明度过渡动画（0.2秒，缓动效果）
      opacity: '0' // 默认隐藏（不透明度为0）
    },
    // 标题内链接获取焦点时的样式
    'h1>a:focus,h2>a:focus,h3>a:focus,h4>a:focus,h5>a:focus,h6>a:focus': {
      opacity: 1 // 显示链接（不透明度为1）
    },
    // 标题 hover 时内部链接的样式
    'h1:hover>a,h2:hover>a,h3:hover>a,h4:hover>a,h5:hover>a,h6:hover>a': {
      opacity: 1 // 显示链接
    },
    // 标题被锚点定位时内部链接的样式
    'h1:target>a,h2:target>a,h3:target>a,h4:target>a,h5:target>a,h6:target>a': {
      opacity: 1 // 显示链接
    },
    // 块引用样式
    blockquote: {
      color: fgMuted, // 颜色使用弱化文字颜色
      position: 'relative', // 相对定位（用于伪元素定位）
      overflow: 'hidden', // 超出部分隐藏
      'border-width': '2px', // 边框宽度
      'border-left': '2px solid hsl(var(--border))', // 关键修改：替换 inherit，明确设置左侧边框的样式和颜色
      'border-radius': 'var(--radius)', // 使用全局圆角变量
      'padding-inline': '1.6rem', // 左右内边距
      'box-shadow': '0 5px 0 ' + bgMuted, // 底部阴影（使用弱化背景色）
      // 若自定义排版配置中blockquoteStyle为'normal'，则取消斜体样式
      ...(typographyCustom.blockquoteStyle === 'normal' && { 'font-style': 'normal' })
    },
    // 块引用的伪元素（用于添加装饰性引号）
    'blockquote::after': {
      color: fgMuted, // 颜色使用弱化文字颜色
      position: 'absolute', // 绝对定位
      content: '"”"', // 内容为右引号
      top: '2.6rem', // 顶部定位
      right: '-1.4rem', // 右侧定位
      'font-size': '10rem', // 超大字体
      'font-family': // 字体族
        '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
      transform: 'rotate(-15deg)', // 旋转-15度
      opacity: '0.1' // 低透明度（装饰效果）
    },
    // 表格样式
    table: {
    display: 'block',
    'font-size': '.9em',
    'border-collapse': 'collapse', /* 合并边框，避免间隙和重叠 */
    'border-width': '0', /* 完全禁用表格自身外边框 */
    },
  'thead th, tbody td': {
    'border-style': 'solid',
    'border-color': 'hsl(var(--border) / 1)', /* 统一边框颜色 */
    'border-width': '0 2px 2px 0', /* 默认：仅右侧和底部边框（内部边框） */
    'text-align': 'start',
    padding: '0.6em',
    },
    /* 第一列单元格：添加左边框（构成表格左外边框） */
    'thead th:first-child, tbody td:first-child': {
      'border-left-width': '2px',
    },
    /* 第一行单元格：添加上边框（构成表格上外边框） */
    'thead tr:first-child th': {
      'border-top-width': '2px',
    },
    /* 最后一列单元格：添加右边框（构成表格右外边框） */
    'thead th:last-child, tbody td:last-child': {
      'border-right-width': '2px',
    },
    /* 最后一行单元格：添加下边框（构成表格下外边框） */
    'tbody tr:last-child td': {
      'border-bottom-width': '2px',
    },
    /* 表头样式补充（保持字体权重） */
    'thead th': {
      'font-weight': '700',
      color: fg,
    },
    // 列表样式
    'ol, ul': {
      'padding-left': '1.625em' // 左侧内边距（用于容纳列表标记）
    },
    'ol>li, ul>li': {
      'padding-inline-start': '.5em' // 列表项左侧内边距
    },
    'ul>li::marker': {
      color: fgMuted, // 无序列表标记颜色
      '--un-text-opacity': '0.35' // 标记透明度
    },
    li: {
      'margin-top': '.5em', // 列表项顶部外边距
      'margin-bottom': '.5em' // 列表项底部外边距
    },
    // 行内代码样式（当自定义配置为modern时生效）
    ...(typographyCustom.inlineCodeBlockStyle === 'modern' && {
      ':not(pre) > code': { // 非代码块内的代码（行内代码）
        color: fgMuted, // 颜色使用弱化文字颜色
        padding: '0.3em 0.5em', // 内边距
        // border: '2px solid hsl(var(--border) / 1)', // 边框（使用边框色变量）
        // 'border-radius': 'var(--radius)', // 圆角
        'background-color': 'hsl(var(--muted) / var(--un-bg-opacity, 1))' // 背景色（使用弱化背景色）
      },
      // 取消行内代码默认的前后引号
      ':not(pre)>code::before,:not(pre)>code::after': {
        content: 'none'
      }
    }),
    // 其他元素样式
    img: {
      'border-radius': 'var(--radius)', // 图片圆角
      margin: '0 auto' // 图片水平居中
    },
    hr: {
      '--un-prose-hr': 'hsl(var(--border) / 1)' // 分隔线颜色（使用边框色变量）
    },
    kbd: { // 键盘按键样式
      color: fg, // 文字颜色
      'border-color': 'hsl(var(--border) / 1)', // 边框颜色
      'border-width': '2px', // 边框宽度
      'box-shadow': // 阴影效果
        '0 0 0 1px hsl(var(--primary-foreground) / 1), 0 3px hsl(var(--primary-foreground) / 1)'
    },
    strong: {
      // 'font-weight': '600', // 注释掉的字体权重
      'font-weight': '700', // 加粗字体权重
      color: fg // 文字颜色
    },
    a: { // 链接样式
      'word-wrap': 'break-word', // 自动换行（长单词）
      'word-break': 'break-word', // 单词内换行
      'overflow-wrap': 'anywhere', // 溢出时任意位置换行
      'font-weight': '500', // 字体权重
      color: fg // 链接颜色
    },
    'code:not(pre code)': { // 非代码块内的代码
      'white-space': 'pre-wrap!important', // 保留空白并自动换行（强制生效）
      'word-break': 'break-all!important' // 强制单词内换行
    }
  }
}

// 主题颜色配置（关联CSS自定义属性，支持透明度）
const themeColors = {
  border: 'hsl(var(--border) / <alpha-value>)', // 边框颜色（带透明度参数）
  input: 'hsl(var(--input) / <alpha-value>)', // 输入框颜色
  ring: 'hsl(var(--ring) / <alpha-value>)', // 焦点环颜色
  background: 'hsl(var(--background) / <alpha-value>)', // 背景色
  foreground: 'hsl(var(--foreground) / <alpha-value>)', // 前景色（主要文字）
  primary: { // 主色调
    DEFAULT: 'hsl(var(--primary) / <alpha-value>)', // 主色默认值
    foreground: 'hsl(var(--primary-foreground) / <alpha-value>)' // 主色区域文字色
  },
  secondary: { // 次要色调
    DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
    foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
  },
  destructive: { // 危险/删除操作颜色
    DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
    foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
  },
  muted: { // 弱化区域颜色
    DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
    foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
  },
  accent: { // 强调色
    DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
    foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
  },
  popover: { // 弹出层颜色
    DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
    foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
  },
  card: { // 卡片颜色
    DEFAULT: 'hsl(var(--card) / <alpha-value>)',
    foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
  }
}

// 自定义UnoCSS规则
const rules: Rule<object>[] = [
  // 修复 UnoCSS 迷你预设的 sr-only 样式（屏幕阅读器专用，视觉隐藏）
  [
    'sr-only',
    {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      'white-space': 'nowrap',
      'border-width': '0'
    }
  ],
  // 自定义 object-cover 规则（控制替换元素的内容适配方式）
  [
    'object-cover',
    {
      'object-fit': 'cover' // 内容覆盖容器，保持比例裁剪
    }
  ],
  // 自定义 bg-cover 规则（控制背景图尺寸）
  [
    'bg-cover',
    {
      'background-size': 'cover' // 背景图覆盖容器，保持比例裁剪
    }
  ]
]

// 导出UnoCSS配置
export default defineConfig({
  presets: [
    presetMini(), // 启用迷你预设（核心基础样式）
    presetTypography(typographyConfig) // 启用排版预设（应用自定义排版配置）
  ],
  rules, // 应用自定义规则
  theme: {
    colors: themeColors // 应用主题颜色配置
  },
  // 安全列表：确保这些类名即使未被检测到也会被UnoCSS处理
  // https://unocss.dev/guide/extracting#limitations
  safelist: [
    // 目录相关样式
    'rounded-t-2xl',
    'rounded-b-2xl',
    // 排版相关样式
    'text-base',
    'prose'
  ]
})

