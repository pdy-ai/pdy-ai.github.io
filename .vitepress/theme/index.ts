import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Giscus from './components/Giscus.vue'
import Danmaku from './components/Danmaku.vue'
import FloatingPlayer from './components/FloatingPlayer.vue'
import ScrollMotion from './components/ScrollMotion.vue'
import PostHeader from './components/PostHeader.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 首页弹幕墙（组件内部判断只在 '/' 显示）+ 全站滚动动效层
      'layout-top': () => [h(Danmaku), h(ScrollMotion)],
      // 悬浮音乐播放器（全站）
      'layout-bottom': () => h(FloatingPlayer),
      // 文章页页头：标题 / 日期 / 标签 / 阅读时长
      'doc-before': () => h(PostHeader),
      // 在文章底部（页脚之前）挂载 Giscus 评论区
      'doc-footer-before': () => h(Giscus)
    })
  }
}
