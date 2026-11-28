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

/**
 * YAML 会把 `date: 2026-11-27` 解析成 Date，序列化后带上时间与时区，
 * 这里统一裁成 YYYY-MM-DD，列表与归档才不会被 ISO 字符串撑破版面。
 */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const text = String(value ?? '')
  const matched = /^(\d{4})-(\d{2})-(\d{2})/.exec(text)
  return matched ? `${matched[1]}-${matched[2]}-${matched[3]}` : text.slice(0, 10)
}

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw): BlogPost[] {
    return raw
      // 排除文章列表页本身
      .filter((p) => p.url !== '/posts/')
      .map((p) => ({
        title: (p.frontmatter.title as string) || '无标题',
        url: p.url,
        date: toDateString(p.frontmatter.date),
        tags: (p.frontmatter.tags as string[]) || [],
        excerpt: (p.excerpt as string) ?? null
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }
})
