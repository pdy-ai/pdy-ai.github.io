---
layout: home

hero:
  name: 彭代颜的博客
  text: 记录、思考、分享
  tagline: 技术 × 生活的混合实验场 —— 写代码，也写生活
  image:
    src: /hero.svg
    alt: 彭代颜的博客
  actions:
    - theme: brand
      text: 开始阅读
      link: /posts/
    - theme: alt
      text: 关于我
      link: /about/

---

<script setup>
import { data as posts } from './posts.data'
const latest = posts.slice(0, 5)
</script>

<div style="padding-top: 24px;">

## 📝 最新文章

<ul class="latest-posts">
  <li v-for="post in latest" :key="post.url">
    <span class="lp-date">{{ post.date }}</span>
    <a class="lp-title" :href="post.url">{{ post.title }}</a>
  </li>
</ul>

<p style="margin-top: 12px;">
  <a href="/posts/" class="view-all">查看全部文章 →</a>
</p>

</div>

<style>
.view-all {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
</style>
