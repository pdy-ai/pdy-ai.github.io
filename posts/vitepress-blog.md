---
title: 用 VitePress 搭建个人博客
date: 2026-11-27
tags:
  - 技术
  - VitePress
---

这个博客本身就是用 **VitePress** 搭建的，分享一下建站过程中用到的技术和踩过的坑。

<!-- more -->

## 为什么选 VitePress？

对比过 Hexo、Hugo 和 VitePress 之后，我最终选择了 VitePress：

| 对比项 | VitePress | Hugo |
| --- | --- | --- |
| 默认颜值 | 现代感强 | 依赖主题 |
| 深色模式 | 内置 | 主题提供 |
| 代码高亮 | 内置 Shiki | 内置但一般 |
| 定制难度 | Vue 组件级 | 模板语言较老 |
| 构建速度 | 快 | 极快 |

VitePress 是 Vue 团队出品，Vite 驱动，开箱即得的默认主题就很好看，深色模式和代码高亮都不用折腾。

## 核心配置片段

站点配置非常直观：

```ts
// .vitepress/config.mts
export default defineConfig({
  lang: 'zh-CN',
  title: '彭代颜的博客',
  themeConfig: {
    nav: [{ text: '文章', link: '/posts/' }],
    search: { provider: 'local' },  // 本地全文搜索
    outline: { level: [2, 3], label: '目录' }
  }
})
```

## 三个我踩过的坑

### 1. 数据加载器会包含 index.md

用 `createContentLoader('posts/*.md')` 收集文章时，列表页 `posts/index.md` 自己也会被匹配到，需要在 `transform` 里手动排除：

```ts
transform(raw) {
  return raw
    .filter(p => p.url !== '/posts/')  // 别忘了排除列表页
    // ...
}
```

### 2. 摘要用 `<!-- more -->` 分隔

启用 `excerpt: true` 后，文章里第一个 `<!-- more -->` 之前的内容会被提取为摘要：

```md
---
title: 我的文章
---

开头这段话会作为摘要。

<!-- more -->

正文从这里开始。
```

### 3. 深色模式默认值

想让站点**默认就是深色**，在配置里写 `appearance: 'dark'` 即可，用户仍可通过右上角按钮切换。

## 部署方案

代码推到 GitHub 后由 GitHub Actions 自动构建，发布到 GitHub Pages，全程零成本，只需在每次 `git push` 后等待一分钟。

> 总结：VitePress 非常适合「想认真写博客，但又不想在搭建上花太多时间」的人。推荐。
