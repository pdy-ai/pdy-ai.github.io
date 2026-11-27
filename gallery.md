---
layout: page
title: 相册
---

<script setup>
const photos = [
  { src: '/photos/photo-1.svg', title: '光影之间', desc: '占位图 · 替换为真实照片' },
  { src: '/photos/photo-2.svg', title: '暮色', desc: '占位图 · 替换为真实照片' },
  { src: '/photos/photo-3.svg', title: '海与天', desc: '占位图 · 替换为真实照片' },
  { src: '/photos/photo-4.svg', title: '日落', desc: '占位图 · 替换为真实照片' },
  { src: '/photos/photo-5.svg', title: '绿野', desc: '占位图 · 替换为真实照片' }

]
</script>

# 🖼️ 图片墙

用镜头记录生活。点击可放大查看。

<div class="photo-grid">
  <a
    v-for="p in photos"
    :key="p.src"
    class="photo-card"
    :href="p.src"
    target="_blank"
    rel="noopener"
  >
    <img :src="p.src" :alt="p.title" loading="lazy" />
    <div class="photo-caption">
      <div class="photo-title">{{ p.title }}</div>
      <div class="photo-desc">{{ p.desc }}</div>
    </div>
  </a>
</div>

## 📤 如何替换成真实照片

1. 把照片放到项目 `public/photos/` 目录，比如 `trip.jpg`
2. 编辑本页源文件 `gallery.md`，把 `photos` 数组里的 `src` 改成 `/photos/trip.jpg`，`title` / `desc` 改成照片说明
3. 提交推送后自动上线
