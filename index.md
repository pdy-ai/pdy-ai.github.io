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
import { computed } from 'vue'
import { data as posts } from './posts.data'

const latest = computed(() => posts.slice(0, 6))
const featured = computed(() => latest.value[0])
const rest = computed(() => latest.value.slice(1))

const tagTotal = computed(() => new Set(posts.flatMap((p) => p.tags)).size)

const stats = computed(() => {
  const years = posts.map((p) => Number(p.date.slice(0, 4))).filter((y) => y > 0)
  const span = years.length ? Math.max(...years) - Math.min(...years) + 1 : 0
  return [
    { label: '篇文章', value: posts.length },
    { label: '个标签', value: tagTotal.value },
    { label: '年记录', value: span }
  ]
})

// 摘要只取首段，去掉标签与 HTML 实体后截断，避免长文把首页首屏撑开
function firstParagraph(html) {
  const matched = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(String(html || ''))
  return matched ? matched[1] : String(html || '')
}

function summary(html, max = 96) {
  const text = firstParagraph(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

const featuredSummary = computed(() => summary(featured.value?.excerpt))

function pad(n) {
  return String(n).padStart(2, '0')
}
</script>

<div class="hm">
  <header class="hm-head">
    <p class="hm-kicker">Index</p>
    <h2 class="hm-title">最新文章</h2>
    <p class="hm-desc">按时间倒序的近期更新，也是这座小站持续的呼吸。</p>
    <a class="hm-more" href="/posts/">全部文章 <span aria-hidden="true">→</span></a>
  </header>

  <article v-if="featured" class="hm-feature">
    <div class="hm-feature__meta">
      <span class="hm-num">01</span>
      <time>{{ featured.date }}</time>
      <span class="hm-badge">最新</span>
    </div>
    <h3 class="hm-feature__title">
      <a :href="featured.url">{{ featured.title }}</a>
    </h3>
    <p v-if="featuredSummary" class="hm-feature__excerpt">{{ featuredSummary }}</p>
    <a class="hm-feature__link" :href="featured.url">
      继续阅读 <span aria-hidden="true">→</span>
    </a>
  </article>

  <ol class="hm-index">
    <li v-for="(post, i) in rest" :key="post.url" class="hm-row">
      <span class="hm-row__num">{{ pad(i + 2) }}</span>
      <time class="hm-row__date">{{ post.date }}</time>
      <a class="hm-row__title" :href="post.url">{{ post.title }}</a>
      <span v-if="post.tags.length" class="hm-row__tags">#{{ post.tags.join(' · #') }}</span>
    </li>
  </ol>

  <div class="hm-stats">
    <div v-for="s in stats" :key="s.label" class="hm-stat">
      <span class="hm-stat__num" :data-count="s.value">{{ pad(s.value) }}</span>
      <span class="hm-stat__label">{{ s.label }}</span>
    </div>
  </div>
</div>
