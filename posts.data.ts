import { createContentLoader } from 'vitepress'

export interface BlogPost {
  title: string
  url: string
  date: string
  tags: string[]
  excerpt: string | null
}

declare const data: BlogPost[]
export { data }

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw): BlogPost[] {
    return raw
      // 排除文章列表页本身
      .filter((p) => p.url !== '/posts/')
      .map((p) => ({
        title: (p.frontmatter.title as string) || '无标题',
        url: p.url,
        date: (p.frontmatter.date as string) || '',
        tags: (p.frontmatter.tags as string[]) || [],
        excerpt: (p.excerpt as string) ?? null
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }
})
