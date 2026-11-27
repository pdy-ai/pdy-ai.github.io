# 彭代颜的博客

基于 VitePress 的个人博客 · 现代科技风 · 部署于 GitHub Pages

## 本地开发

```bash
npm install     # 安装依赖
npm run dev     # 本地开发，http://localhost:5173
npm run build   # 构建生产版本
npm run preview # 预览构建结果
```

## 目录结构

```
├── index.md                  # 首页（Hero + 最新文章）
├── posts/                    # 文章目录（写新文章放这里）
│   └── index.md              # 文章列表页
├── tags.md                   # 标签页
├── archives.md               # 归档页
├── about.md                  # 关于我
├── links.md                  # 友链
├── posts.data.ts             # 文章数据加载器
└── .vitepress/
    ├── config.mts            # 站点配置（导航/搜索/页脚）
    └── theme/
        ├── custom.css        # 现代科技风样式
        └── components/
            └── Giscus.vue    # 评论组件
```

## 写新文章

在 `posts/` 下新建 `.md` 文件，头部格式：

```md
---
title: 文章标题
date: 2026-12-01
tags:
  - 技术
---

文章开头这段会作为列表页摘要。

<!-- more -->

正文内容...
```

保存后本地 `npm run dev` 可实时预览。

## 上线步骤（首次部署）

1. 在 GitHub（账号 `pdy-ai`）创建公开仓库，建议名字 `blog` 或 `pdy-ai.github.io`
2. 开启仓库 Discussions（Settings → Features → Discussions，Giscus 评论需要）
3. 推送代码：

```bash
git init
git add .
git commit -m "init: 博客初始化"
git branch -M main
git remote add origin https://github.com/pdy-ai/<仓库名>.git
git push -u origin main
```

4. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
5. 等 Actions 跑完，访问 `https://pdy-ai.github.io/<仓库名>/`

## 绑定自定义域名 pengdaiyan.top

1. **腾讯云 DNS 解析**（控制台 → 我的域名 → 解析记录）添加：

   | 类型 | 主机记录 | 记录值 |
   | --- | --- | --- |
   | CNAME | www | pdy-ai.github.io |
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |

2. GitHub 仓库 Settings → Pages → Custom domain 填 `pengdaiyan.top`，等待 DNS 校验
3. 勾选 **Enforce HTTPS**

## 启用 Giscus 评论

1. 访问 https://giscus.app/zh-CN ，填入仓库名，选择 Discussions 分类
2. 把生成的 `repo` / `repoId` / `category` / `categoryId` 填入
   `.vitepress/theme/components/Giscus.vue` 顶部 4 个常量
