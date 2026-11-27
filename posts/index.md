---
layout: page
title: 文章
---

<script setup>
import { data as posts } from '../posts.data'
</script>

# 全部文章

共 {{ posts.length }} 篇

<ul class="post-list">
  <li v-for="post in posts" :key="post.url" class="post-item">
    <div class="pi-meta">
      <span>{{ post.date }}</span>
      <span v-for="tag in post.tags" :key="tag">· #{{ tag }}</span>
    </div>
    <a class="pi-title" :href="post.url">{{ post.title }}</a>
    <div v-if="post.excerpt" class="pi-excerpt" v-html="post.excerpt"></div>
  </li>
</ul>
