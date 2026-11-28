<script setup lang="ts">
/**
 * 全站滚动动效层 —— GSAP Timeline + ScrollTrigger
 *
 * 设计原则：
 * 1. 所有动画只在浏览器端构建（onMounted / 路由切换后 nextTick），SSR 输出保持静态。
 * 2. 全部收纳进 gsap.context()，路由切换时 revert，避免动效作用在已销毁的 DOM 上。
 * 3. 用 gsap.matchMedia 尊重 prefers-reduced-motion，用户关闭动效时一切照常静止显示。
 * 4. ScrollTrigger 按页面自上而下创建；字体、图片加载后再 refresh 修正触发点。
 */
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// 移动端地址栏伸缩会改变视口高度，忽略这类 resize，避免动画反复重算
ScrollTrigger.config({ ignoreMobileResize: true })

const MOTION_OK = '(prefers-reduced-motion: no-preference)'
const EASE = 'power2.out'

const route = useRoute()
let ctx: gsap.Context | null = null
let mm: gsap.MatchMedia | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null
let pointerHandler: ((e: PointerEvent) => void) | null = null
let pointerRaf = 0
let disposed = false

/* 等字体 / 图片落地后修正触发位置 */
function scheduleRefresh(delay = 160) {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    refreshTimer = null
    if (!disposed) ScrollTrigger.refresh()
  }, delay)
}

function teardown() {
  clearPointerGlow()
  mm?.revert()
  mm = null
  ctx?.revert()
  ctx = null
}

function clearPointerGlow() {
  if (pointerHandler) window.removeEventListener('pointermove', pointerHandler)
  pointerHandler = null
  if (pointerRaf) cancelAnimationFrame(pointerRaf)
  pointerRaf = 0
}

/* Hero 跟随指针的冷光，仅桌面精确指针 + 允许动效时启用 */
function heroPointerGlow() {
  const hero = document.querySelector<HTMLElement>('.VPHero')
  if (!hero) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (!window.matchMedia(MOTION_OK).matches) return

  let latest: { x: number; y: number } | null = null
  pointerHandler = (e: PointerEvent) => {
    const rect = hero.getBoundingClientRect()
    latest = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    if (pointerRaf) return
    pointerRaf = requestAnimationFrame(() => {
      pointerRaf = 0
      if (!latest) return
      hero.style.setProperty('--mx', `${latest.x}px`)
      hero.style.setProperty('--my', `${latest.y}px`)
    })
  }
  window.addEventListener('pointermove', pointerHandler, { passive: true })
}

/* ---------------- 首页 Hero：入场时间轴 + 滚动视差 ---------------- */
function heroIntro() {
  const hero = document.querySelector('.VPHero')
  if (!hero) return

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  const name = hero.querySelector('.name')
  const text = hero.querySelector('.text')
  const tagline = hero.querySelector('.tagline')
  const actions = hero.querySelectorAll('.actions .action')

  // 标题像被扫描线「刷」出来：从左向右揭示
  if (name)
    tl.from(name, {
      clipPath: 'inset(0 100% 0 0)',
      y: 14,
      opacity: 0,
      duration: 1
    })
  if (text) tl.from(text, { y: 20, opacity: 0, duration: 0.75 }, name ? '-=0.55' : 0)
  if (tagline) tl.from(tagline, { y: 14, opacity: 0, duration: 0.65 }, '-=0.45')
  if (actions.length) tl.from(actions, { y: 12, opacity: 0, stagger: 0.1, duration: 0.55 }, '-=0.35')

  heroPointerGlow()

  // 滚动时 Hero 缓慢上移并淡出，为下方索引让出视线
  gsap.to(hero.querySelector('.container') || hero, {
    y: 48,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
}

/* ---------------- 首页：索引版式 ---------------- */
function homeIndex() {
  const head = document.querySelector('.hm-head')
  if (head) gsap.from(head, { y: 16, opacity: 0, duration: 0.6, ease: EASE })

  const feature = document.querySelector('.hm-feature')
  if (feature) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: feature, start: 'top 86%', once: true }
    })
    const meta = feature.querySelector('.hm-feature__meta')
    const title = feature.querySelector('.hm-feature__title')
    const excerpt = feature.querySelector('.hm-feature__excerpt')
    const link = feature.querySelector('.hm-feature__link')
    if (meta) tl.from(meta, { y: 14, opacity: 0, duration: 0.55, ease: EASE })
    if (title) tl.from(title, { y: 26, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.32')
    if (excerpt) tl.from(excerpt, { y: 16, opacity: 0, duration: 0.6, ease: EASE }, '-=0.5')
    if (link) tl.from(link, { y: 10, opacity: 0, duration: 0.45, ease: EASE }, '-=0.4')
  }

  const rows = gsap.utils.toArray<HTMLElement>('.hm-row')
  if (rows.length) {
    gsap.from(rows, {
      y: 22,
      opacity: 0,
      duration: 0.6,
      ease: EASE,
      stagger: 0.07,
      scrollTrigger: {
        trigger: document.querySelector('.hm-index'),
        start: 'top 88%',
        once: true
      }
    })
  }

  // 统计数字：进入视口时计数
  gsap.utils.toArray<HTMLElement>('.hm-stat').forEach((stat, i) => {
    gsap.from(stat, {
      y: 16,
      opacity: 0,
      duration: 0.55,
      delay: i * 0.06,
      ease: EASE,
      scrollTrigger: { trigger: stat, start: 'top 94%', once: true }
    })

    const num = stat.querySelector<HTMLElement>('.hm-stat__num')
    if (!num) return
    const end = Number(num.dataset.count || 0)
    if (!Number.isFinite(end)) return
    const counter = { v: 0 }
    gsap.to(counter, {
      v: end,
      duration: 1.3,
      ease: 'power2.out',
      snap: { v: 1 },
      scrollTrigger: { trigger: stat, start: 'top 94%', once: true },
      onUpdate: () => {
        num.textContent = String(Math.round(counter.v)).padStart(2, '0')
      }
    })
  })
}

/* ---------------- 各列表页：滚动逐条浮现 ---------------- */
function listReveals() {
  // 文章列表
  gsap.utils.toArray<HTMLElement>('.post-item').forEach((el) => {
    gsap.from(el, {
      y: 26,
      opacity: 0,
      duration: 0.62,
      ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    })
  })

  // 归档：年份标题时间轴（标签 → 横线生长 → 篇数）
  gsap.utils.toArray<HTMLElement>('.archive-year').forEach((group) => {
    const label = group.querySelector('.ay-label')
    const line = group.querySelector('.ay-line')
    const count = group.querySelector('.tag-count')
    const tl = gsap.timeline({
      scrollTrigger: { trigger: group, start: 'top 90%', once: true }
    })
    if (label) tl.from(label, { y: 20, opacity: 0, duration: 0.55, ease: EASE })
    if (line)
      tl.from(
        line,
        { scaleX: 0, transformOrigin: 'left center', duration: 0.75, ease: EASE },
        '-=0.3'
      )
    if (count) tl.from(count, { opacity: 0, duration: 0.4, ease: EASE }, '-=0.45')
  })

  gsap.utils.toArray<HTMLElement>('.archive-list').forEach((list) => {
    gsap.from(list.children, {
      y: 16,
      opacity: 0,
      duration: 0.5,
      ease: EASE,
      stagger: 0.05,
      scrollTrigger: { trigger: list, start: 'top 94%', once: true }
    })
  })

  // 标签云
  const chips = gsap.utils.toArray<HTMLElement>('.tag-cloud .tag-chip')
  if (chips.length) {
    gsap.from(chips, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.6)',
      stagger: 0.035,
      scrollTrigger: {
        trigger: document.querySelector('.tag-cloud'),
        start: 'top 92%',
        once: true
      }
    })
  }

  // 相册
  gsap.utils.toArray<HTMLElement>('.photo-card').forEach((card) => {
    gsap.from(card, {
      y: 30,
      opacity: 0,
      scale: 0.985,
      duration: 0.7,
      ease: EASE,
      scrollTrigger: { trigger: card, start: 'top 95%', once: true }
    })
  })

  // 友链
  gsap.utils.toArray<HTMLElement>('.link-card').forEach((card) => {
    gsap.from(card, {
      y: 18,
      opacity: 0,
      duration: 0.55,
      ease: EASE,
      scrollTrigger: { trigger: card, start: 'top 95%', once: true }
    })
  })
}

/* ---------------- 正文页：页头、标题与段落轻量浮现 ---------------- */
function docReveals() {
  // 首页另有专属编排，避免重复动画
  if (document.querySelector('.VPHero')) return

  const doc = document.querySelector('.vp-doc')
  if (!doc) return

  // 文章页页头（doc-before 插槽）
  const head = document.querySelector('.post-head')
  if (head) {
    gsap.from(head.children, {
      y: 18,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out'
    })
  }

  // VitePress 会把正文包进一层 div，这里取真正的顶层块级元素
  const wrap =
    doc.children.length === 1 && doc.firstElementChild?.tagName === 'DIV'
      ? (doc.firstElementChild as HTMLElement)
      : (doc as HTMLElement)

  Array.from(wrap.children)
    .filter(
      (el) =>
        el instanceof HTMLElement &&
        !el.matches(
          '.post-head, .tag-cloud, .photo-grid, .links-grid, .hm, .comments-wrapper, script, style'
        )
    )
    .forEach((el) => {
      gsap.from(el, {
        y: 14,
        opacity: 0,
        duration: 0.5,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 95%', once: true }
      })
    })
}

function build() {
  teardown()

  ctx = gsap.context(() => {
    // 顶部阅读进度条
    const bar = document.querySelector<HTMLElement>('.motion-progress__bar')
    if (bar) {
      gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' })
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => gsap.set(bar, { scaleX: self.progress })
      })
    }

    mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      heroIntro()
      homeIndex()
      listReveals()
      docReveals()
    })
  }, document.body)

  scheduleRefresh()
}

onMounted(() => {
  build()
  // 字体 / 图片就绪后修正触发点
  if (document.fonts?.ready) document.fonts.ready.then(() => scheduleRefresh(0))
  window.addEventListener('load', () => scheduleRefresh(0), { once: true })
})

watch(
  () => route.path,
  () => {
    teardown()
    nextTick(() => {
      if (disposed) return
      // 等 VitePress 完成新页面 DOM 替换后再构建
      requestAnimationFrame(() => {
        if (!disposed) build()
      })
    })
  }
)

onUnmounted(() => {
  disposed = true
  if (refreshTimer) clearTimeout(refreshTimer)
  teardown()
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="motion-progress" aria-hidden="true">
    <div class="motion-progress__bar"></div>
  </div>
</template>
