import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Giscus from './components/Giscus.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 在文章底部（页脚之前）挂载 Giscus 评论区
      'doc-footer-before': () => h(Giscus)
    })
  }
}
