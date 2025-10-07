---
title: '常见问题'
description: '常见问题解答'
order: 4
---

## 路由

### 博客特定路由

博客的路由格式类似 `/blog/:year/:id`

参见 [4.0.2-beta如何使文章链接中包含年份](https://github.com/cworld1/astro-theme-pure/discussions/37#discussioncomment-11905851)。

## 内容

### `heroImage` 支持网络图片

应配合 `inferSize: true` 使用以获取图片尺寸。示例：

```yaml
heroImage:
  { src: 'https://img.tukuppt.com/ad_preview/00/15/09/5e715a320b68e.jpg!/fw/980', inferSize: true }
```

## Vite

### Vite 阻塞请求

```log
请求被阻塞。不允许此主机（"xxx"）。
要允许此主机，请在 vite.config.js 中将 "xxx" 添加到 `preview.allowedHosts` 中。
```

参见 [选项 server.allowedHosts 未考虑 "true"](https://github.com/vitejs/vite/issues/19242)

## 包

### `BUN_LINK_PKG` 问题

参见 [BUN_LINK_PKG 环境变量无法设置成功](https://github.com/cworld1/astro-theme-pure/issues/51)
