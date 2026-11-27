---
layout: page
title: 相册
---

<script setup>
const photos = [


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
