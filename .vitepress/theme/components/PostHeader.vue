<script setup lang="ts">
/**
 * 文章页页头：标题 / 日期 / 标签 / 阅读时长
 * 挂在 doc-before 插槽，仅在带 date 的文章页出现。
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter } = useData()
const route = useRoute()
const minutes = ref(0)

const show = computed(
  () =>
    Boolean(frontmatter.value.title) &&
    Boolean(frontmatter.value.date) &&
    !frontmatter.value.layout &&
    route.path.startsWith('/posts/') &&
    route.path !== '/posts/'
)

const tags = computed<string[]>(() => {
  const raw = frontmatter.value.tags as unknown
  return Array.isArray(raw) ? raw.map(String) : []
})

const dateText = computed(() => {
  const raw = frontmatter.value.date as unknown
  const text = raw instanceof Date ? raw.toISOString() : String(raw ?? '')
  const matched = /^(\d{4})-(\d{2})-(\d{2})/.exec(text)
  return matched ? `${matched[1]}-${matched[2]}-${matched[3]}` : text
})

function countReadingTime() {
  const text = document.querySelector('.vp-doc')?.textContent ?? ''
  const chars = text.replace(/\s+/g, '').length
  minutes.value = Math.max(1, Math.round(chars / 400))
}

onMounted(() => nextTick(countReadingTime))
watch(
  () => route.path,
  () => nextTick(countReadingTime)
)
</script>

<template>
  <header v-if="show" class="post-head">
    <div class="post-head__meta">
      <time>{{ dateText }}</time>
      <span v-if="minutes" class="post-head__read">约 {{ minutes }} 分钟</span>
    </div>
    <h1 class="post-head__title">{{ frontmatter.title }}</h1>
    <ul v-if="tags.length" class="post-head__tags">
      <li v-for="tag in tags" :key="tag"># {{ tag }}</li>
    </ul>
  </header>
</template>
