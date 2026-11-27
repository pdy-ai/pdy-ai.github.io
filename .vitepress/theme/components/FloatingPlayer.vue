<script setup lang="ts">
/**
 * 悬浮音乐播放器 —— 全站玻璃拟态风格
 * 歌单配置：把 SONGS 数组里的 url 换成你喜欢的音乐直链即可
 * （支持 mp3 直链，如七牛云/对象存储里的文件）
 */
import { onMounted, onUnmounted, ref } from 'vue'

// ============ 歌单配置（替换成你自己的音乐直链） ============
const SONGS = [
  {
    name: 'Ambient Dream',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    name: 'Night Groove',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    name: 'Sky Walker',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  }
]
// =========================================================

const expanded = ref(false)
const playing = ref(false)
const current = ref(0)
const progress = ref(0)

// Audio 仅存在于浏览器端，SSR 时为 null
let audio: HTMLAudioElement | null = null

onMounted(() => {
  audio = new Audio()
  audio.volume = 0.5
  audio.addEventListener('timeupdate', onTime)
  audio.addEventListener('ended', next)
})

onUnmounted(() => {
  audio?.pause()
})

const song = () => SONGS[current.value]

function toggle() {
  if (!audio) return
  if (playing.value) {
    audio.pause()
  } else {
    if (audio.src !== song().url) audio.src = song().url
    audio.play().catch(() => {})
  }
  playing.value = !playing.value
}

function next() {
  current.value = (current.value + 1) % SONGS.length
  if (!audio) return
  audio.src = song().url
  if (playing.value) audio.play().catch(() => {})
}

function prev() {
  current.value = (current.value - 1 + SONGS.length) % SONGS.length
  if (!audio) return
  audio.src = song().url
  if (playing.value) audio.play().catch(() => {})
}

function seek(e: Event) {
  if (!audio || !audio.duration) return
  const el = e.target as HTMLInputElement
  audio.currentTime = (Number(el.value) / 100) * audio.duration
}

function onTime() {
  if (audio && audio.duration) progress.value = (audio.currentTime / audio.duration) * 100
}
</script>

<template>
  <div class="music-player" :class="{ expanded }">
    <!-- 收起状态：悬浮唱片按钮 -->
    <button class="mp-disc" :title="playing ? '暂停音乐' : '播放音乐'" @click="expanded = !expanded">
      <span class="mp-note" :class="{ spinning: playing }">♪</span>
    </button>

    <!-- 展开状态：控制面板 -->
    <transition name="mp-slide">
      <div v-if="expanded" class="mp-panel">
        <div class="mp-info">
          <div class="mp-name">{{ song().name }}</div>
          <div class="mp-artist">{{ song().artist }}</div>
        </div>
        <div class="mp-progress">
          <input
            type="range"
            min="0"
            max="100"
            :value="progress"
            :style="{
              background: `linear-gradient(to right, var(--vp-c-brand-1) ${progress}%, var(--vp-c-divider) ${progress}%)`
            }"
            @input="seek"
            aria-label="播放进度"
          />
        </div>
        <div class="mp-controls">
          <button @click="prev" title="上一首">⏮</button>
          <button class="mp-play" @click="toggle" :title="playing ? '暂停' : '播放'">
            {{ playing ? '⏸' : '▶' }}
          </button>
          <button @click="next" title="下一首">⏭</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
.music-player {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.mp-disc {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: var(--vp-c-text-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-bg);
  font-size: 20px;
  transition: transform 0.25s var(--ed-ease, ease), background-color 0.25s var(--ed-ease, ease);
}
.mp-disc:hover {
  background: var(--vp-c-brand-1);
  transform: scale(1.06);
}
.mp-note {
  display: inline-block;
}
.mp-note.spinning {
  animation: mp-spin 3s linear infinite;
}
@keyframes mp-spin {
  to {
    transform: rotate(360deg);
  }
}
.mp-panel {
  width: 230px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}
.mp-info {
  margin-bottom: 8px;
}
.mp-name {
  font-weight: 600;
  font-size: 0.92em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mp-artist {
  font-size: 0.78em;
  color: var(--vp-c-text-3);
}
.mp-progress input[type='range'] {
  width: 100%;
  height: 4px;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.mp-progress input[type='range']::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}
.mp-controls {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 10px;
}
.mp-controls button {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}
.mp-controls button:hover {
  color: var(--vp-c-brand-1);
  transform: scale(1.1);
}
.mp-controls .mp-play {
  font-size: 20px;
}
/* 面板滑入动画 */
.mp-slide-enter-active,
.mp-slide-leave-active {
  transition: all 0.25s ease;
}
.mp-slide-enter-from,
.mp-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
@media (max-width: 640px) {
  .music-player {
    right: 14px;
    bottom: 14px;
  }
  .mp-panel {
    width: 200px;
  }
}
</style>
