---
layout: page
title: 标签
---

<script setup>
import { ref, computed } from 'vue'
import { data as posts } from './posts.data'

// 汇总所有标签
const tagMap = computed(() => {
  const map = new Map()
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!map.has(tag)) map.set(tag, [])
      map.get(tag).push(post)
    }
  }
  return new Map([...map.entries()].sort((a, b) => b[1].length - a[1].length))
})

const activeTag = ref('')

function toggle(tag) {
  activeTag.value = activeTag.value === tag ? '' : tag
}

const shownPosts = computed(() =>
  activeTag.value
    ? posts.filter((p) => p.tags.includes(activeTag.value))
    : []
)
</script>

# 标签

<div class="tag-cloud">
  <button
    v-for="[tag, list] in tagMap"
    :key="tag"
    class="tag-chip"
    :class="{ active: activeTag === tag }"
    @click="toggle(tag)"
  >
    # {{ tag }} <span class="tag-count">{{ list.length }}</span>
  </button>
</div>

<div v-if="activeTag" class="tag-group">
  <div class="tag-group-title"># {{ activeTag }} 下的文章</div>
  <ul class="latest-posts">
    <li v-for="post in shownPosts" :key="post.url">
      <span class="lp-date">{{ post.date }}</span>
      <a class="lp-title" :href="post.url">{{ post.title }}</a>
    </li>
  </ul>
</div>
