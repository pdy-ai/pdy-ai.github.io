---
layout: page
title: 友链
---

<script setup>
const links = [
  {
    name: 'VitePress 官方文档',
    desc: '本站使用的静态站点框架',
    url: 'https://vitepress.dev',
    avatar: '/favicon.svg'
  },
  {
    name: 'GitHub',
    desc: '全球最大同性交友平台（误）',
    url: 'https://github.com',
    avatar: '/favicon.svg'
  }
  // 在这里继续添加友链，格式如下：
  // { name: '某某的博客', desc: '一句话介绍', url: 'https://xxx', avatar: '头像图片地址' }
]
</script>

# 🤝 友情链接

常逛的博客和网站。想交换友链的话，按下面的格式联系我：

```text
站点名称：彭代颜的博客
站点地址：https://pengdaiyan.top
一句话介绍：技术 × 生活的混合实验场
头像/Logo：https://pengdaiyan.top/favicon.svg
```

<div class="links-grid">
  <a v-for="link in links" :key="link.url" class="link-card" :href="link.url" target="_blank" rel="noopener">
    <img class="lc-avatar" :src="link.avatar" :alt="link.name" />
    <div>
      <div class="lc-name">{{ link.name }}</div>
      <div class="lc-desc">{{ link.desc }}</div>
    </div>
  </a>
</div>
