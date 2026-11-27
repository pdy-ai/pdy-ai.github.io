<script setup lang="ts">
/**
 * Giscus 评论组件（基于 GitHub Discussions）
 *
 * 上线后按以下步骤获取配置，然后填入下方 4 个常量：
 * 1. 仓库设为 Public 并开启 Discussions（Settings -> Features -> Discussions）
 * 2. 安装 https://github.com/apps/giscus 到该仓库
 * 3. 访问 https://giscus.app/zh-CN ，填入仓库，选择 Discussions 分类
 * 4. 把页面生成的 repo / repoId / category / categoryId 填到下面
 */
import { onMounted, ref, watch } from 'vue'
import { useRoute, useData } from 'vitepress'

// ================== GISCUS 配置（待填写） ==================
const GISCUS_REPO = ''              // 例: 'pdy-ai/blog'
const GISCUS_REPO_ID = ''           // 例: 'R_kgDOxxxxxxx'
const GISCUS_CATEGORY = 'Announcements'
const GISCUS_CATEGORY_ID = ''       // 例: 'DIC_kwDOxxxxxxx'
// ==========================================================

const route = useRoute()
const { isDark } = useData()
const container = ref<HTMLDivElement | null>(null)
const configured = GISCUS_REPO && GISCUS_REPO_ID && GISCUS_CATEGORY_ID

function mountGiscus() {
  if (!container.value) return
  container.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  const params: Record<string, string> = {
    'data-repo': GISCUS_REPO,
    'data-repo-id': GISCUS_REPO_ID,
    'data-category': GISCUS_CATEGORY,
    'data-category-id': GISCUS_CATEGORY_ID,
    'data-mapping': 'pathname',
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': isDark.value ? 'dark' : 'light',
    'data-lang': 'zh-CN',
    'data-loading': 'lazy'
  }
  Object.entries(params).forEach(([k, v]) => script.setAttribute(k, v))
  container.value.appendChild(script)
}

onMounted(() => {
  if (configured) mountGiscus()
})

watch(isDark, () => {
  if (configured) mountGiscus()
})

watch(
  () => route.path,
  () => {
    if (configured) mountGiscus()
  }
)
</script>

<template>
  <div class="comments-wrapper">
    <div v-if="configured" ref="container"></div>
    <div v-else class="comments-placeholder">
      💬 评论区（Giscus）待配置<br />
      建好 GitHub 仓库并开启 Discussions 后，按 Giscus.vue 文件内注释填写 4 个配置项即可启用
    </div>
  </div>
</template>
