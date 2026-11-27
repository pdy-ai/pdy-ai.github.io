<script setup lang="ts">
/**
 * 首页弹幕墙 —— Poetize 风格
 * 访客留言以弹幕形式飘过首页 Hero 区域
 * 句子来源：预设列表（后续可接入 Giscus 动态拉取）
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

// ============ 弹幕内容（想改就改这里） ============
const SENTENCES = [
  '相信记录的力量 ✨',
  '欢迎来到彭代颜的小站！',
  '今天也要元气满满哦',
  '技术改变生活 💻',
  '写代码，也写生活',
  '你好呀，陌生人 👋',
  '愿我们都被这个世界温柔以待',
  '记录、思考、分享',
  'Stay hungry, stay foolish',
  '博客好漂亮啊！',
  '路过留个爪 🐾',
  '愿有岁月可回首，且以代码到白头',
  'Hello, World!',
  '生活明朗，万物可爱 🌈',
  '这里是我的数字花园 🌱'
]
// ================================================

// 颜色走主题变量：大部分墨色，少量朱砂
const COLORS = [
  'var(--vp-c-text-2)',
  'var(--vp-c-text-2)',
  'var(--vp-c-text-2)',
  'var(--vp-c-text-3)',
  'var(--vp-c-brand-1)'
]

interface Danmaku {
  id: number
  text: string
  color: string
  top: number
  duration: number
  size: number
  opacity: number
}

const items = ref<Danmaku[]>([])
const pool = [...SENTENCES, ...SENTENCES] // 双份保证多样性
let seq = 0
let timer: ReturnType<typeof setInterval> | null = null

function spawn() {
  const text = pool[Math.floor(Math.random() * pool.length)]
  items.value.push({
    id: seq++,
    text,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    top: 8 + Math.random() * 80, // 百分比高度
    duration: 9 + Math.random() * 8, // 9~17 秒飘过
    size: 13 + Math.random() * 6,
    opacity: 0.55 + Math.random() * 0.4
  })
  // 弹幕飘完后回收，防止 DOM 无限增长
  const id = seq - 1
  setTimeout(() => {
    items.value = items.value.filter((d) => d.id !== id)
  }, 18000)
}

onMounted(() => {
  // 仅首页显示
  if (route.path !== '/') return
  // 初始先撒 6 条，错开时间
  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 1600)
  timer = setInterval(spawn, 2600)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div v-if="route.path === '/'" class="danmaku-layer" aria-hidden="true">
    <span
      v-for="d in items"
      :key="d.id"
      class="danmaku-item"
      :style="{
        top: d.top + '%',
        color: d.color,
        fontSize: d.size + 'px',
        opacity: d.opacity,
        animationDuration: d.duration + 's'
      }"
      >{{ d.text }}</span
    >
  </div>
</template>

<style>
/* 弹幕层覆盖首页 Hero 区域 */
.danmaku-layer {
  position: fixed;
  top: var(--vp-nav-height, 64px);
  left: 0;
  right: 0;
  height: calc(60vh);
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}
.danmaku-item {
  position: absolute;
  left: 100vw;
  white-space: nowrap;
  font-family: var(--ed-serif, Georgia, serif);
  font-style: italic;
  font-weight: 500;
  animation: danmaku-fly linear forwards;
  will-change: transform;
}
@keyframes danmaku-fly {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100vw - 100%));
  }
}
@media (max-width: 640px) {
  .danmaku-layer {
    height: 45vh;
  }
  .danmaku-item {
    font-size: 12px !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .danmaku-layer {
    display: none;
  }
}
</style>
