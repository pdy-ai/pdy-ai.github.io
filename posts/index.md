---
layout: page
title: 文章
---

<script setup>
import { data as posts } from '../posts.data'

// 只取首段纯文本，避免把标题、表格等原始 Markdown 塞进列表
function excerptText(html, max = 120) {
  const matched = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(String(html || ''))
  const text = (matched ? matched[1] : String(html || ''))
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}
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
    <p v-if="post.excerpt" class="pi-excerpt">{{ excerptText(post.excerpt) }}</p>
  </li>
</ul>
