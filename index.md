---
layout: home

hero:
  name: 彭代颜的博客
  text: 记录、思考、分享
  tagline: 写代码，也写生活。技术随笔与生活杂谈的混合空间。
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

<div class="home-posts">

<div class="hp-header">
  <h2 class="hp-heading">最新文章</h2>
  <a class="hp-more" href="/posts/">全部文章</a>
</div>

<ul class="latest-posts">
  <li v-for="post in latest" :key="post.url">
    <span class="lp-date">{{ post.date }}</span>
    <a class="lp-title" :href="post.url">{{ post.title }}</a>
  </li>
</ul>

</div>
