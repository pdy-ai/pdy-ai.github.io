---
layout: page
title: 归档
---

<script setup>
import { computed } from 'vue'
import { data as posts } from './posts.data'

const byYear = computed(() => {
  const map = new Map()
  for (const post of posts) {
    const year = post.date.slice(0, 4) || '未知'
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(post)
  }
  return new Map([...map.entries()].sort((a, b) => b[0] - a[0]))
})
</script>

# 归档

共 {{ posts.length }} 篇文章，按时间倒序排列。

<div v-for="[year, list] in byYear" :key="year">
  <div class="archive-year">
    <span class="ay-label">{{ year }}</span>
    <span class="ay-line"></span>
    <span class="tag-count">{{ list.length }} 篇</span>
  </div>
  <ul class="archive-list">
    <li v-for="post in list" :key="post.url">
      <span class="al-date">{{ post.date.slice(5) }}</span>
      <a class="al-title" :href="post.url">{{ post.title }}</a>
    </li>
  </ul>
</div>
