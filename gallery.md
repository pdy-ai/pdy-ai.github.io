---
layout: page
title: 相册
---

<script setup>
const photos = [
  { src: '/photos/_20260921004215_31_5-mwzrx5mc.jpg', title: '光遇启动', desc: '' }
]
</script>

# 图片墙

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

