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
    avatar: 'https://vitepress.dev/vitepress-logo-large.svg'
  }
]
</script>

# 友情链接

常逛的博客和网站。想交换友链的话，按下面的格式联系我：

```
站点名称：彭代颜的博客
站点地址：https://pengdaiyan.top
一句话介绍：技术 × 生活的混合实验场
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
