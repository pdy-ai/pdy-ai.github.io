---
title: Hello World
date: 2026-11-27
tags:
  - 技术
---

按照传统，任何新事物的开始都应该是一句 Hello World。

<!-- more -->

```python
def hello(name: str) -> str:
    return f"Hello, {name}!"

print(hello("World"))  # Hello, World!
```

```javascript
const greet = (name) => `Hello, ${name}!`;

console.log(greet("博客")); // Hello, 博客!
```

这是本站的第一篇技术文章，用来验证：

- [x] 代码高亮是否正常（Shiki 驱动）
- [x] 复制按钮是否可用（悬停代码块右上角试试）
- [x] 列表、引用、表格渲染是否正常
- [x] 深色 / 浅色模式切换

> Hello, World! —— 1972 年，Bell Labs，Brian Kernighan
