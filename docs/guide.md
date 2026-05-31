# 使用说明

本页告诉你如何维护和扩展这个网站，不需要任何编程基础。

---

## 发布一篇日志（带头像、时间、分类）

日志和普通笔记不同，会显示作者头像、发布时间和所属分类，像博客一样。

### 新建日志文件

在 `docs/blog/posts/` 文件夹里创建一个 `.md` 文件，文件名建议用日期开头，比如 `2026-06-01-my-post.md`。

文件顶部必须有这段配置：

```yaml
---
date: 2026-06-01           ← 发布日期
authors:
  - groot                  ← 作者（对应 .authors.yml 里的 key）
categories:
  - 生活                   ← 分类，可以多个
description: 这篇文章讲了什么  ← 摘要（显示在列表页）
---

# 文章标题

正文内容...

<!-- more -->   ← 这行之前的内容显示在列表摘要，这行之后不显示

更多正文...
```

### 修改作者头像和信息

打开 `docs/blog/.authors.yml`，修改 avatar 那行，换成你自己的头像地址：

```yaml
authors:
  groot:
    name: Groot
    description: 笔记作者
    avatar: https://你的头像图片地址
    url: https://github.com/Groots-nju
```

GitHub 头像地址格式：`https://github.com/你的用户名.png`

---

## 添加一篇新笔记

### 第一步：创建 `.md` 文件

在 `docs/` 文件夹下新建一个文本文件，后缀改成 `.md`。

文件可以放在子文件夹里，比如：

```
docs/
├── note1/
│   ├── index.md      ← 分类首页
│   └── page1.md      ← 具体文章
├── note2.md
└── guide.md
```

### 第二步：在 `mkdocs.yml` 里注册

打开根目录的 `mkdocs.yml`，找到 `nav:` 部分，按格式添加你的文件路径：

```yaml
nav:
  - 首页: index.md
  - 我的分类:
    - 概览: my-category/index.md
    - 第一篇: my-category/article1.md
  - 单独一页: standalone.md
```

---

## 插入图片

### 方式一：使用网络图片（最简单）

在 Markdown 里直接写：

```markdown
![图片描述](https://网址/图片.jpg)
```

推荐免费图片网站：[Unsplash](https://unsplash.com)，找到图片后右键复制图片地址，粘贴到上面的括号里。

### 方式二：使用本地图片（推荐）

1. 把图片文件放到 `docs/images/` 文件夹里（没有就新建一个）
2. 在 Markdown 里引用：

```markdown
![图片描述](../images/my-photo.jpg)
```

如果文章在子文件夹（比如 `note1/page1.md`），要用 `../images/` 往上一级找。如果文章在 `docs/` 根目录，直接用 `images/` 就行。

### 图片建议

- 宽度建议 **1200px 以上**，效果最好
- 格式用 `.jpg` 或 `.webp`（文件更小）
- 图片文件名不要用中文，用英文或数字

---

## 修改首页大图

打开 `docs/index.md`，修改顶部的配置：

```yaml
---
template: home.html
title: 我的笔记          ← 大标题
description: 这里写副标题  ← 副标题
hero_button: 开始阅读     ← 左边按钮文字
hero_button_link: note1/  ← 左边按钮跳转
hero_button2: 关于本站    ← 右边按钮文字
hero_button2_link: note2/ ← 右边按钮跳转
---
```

想换背景图片，打开 `docs/stylesheets/extra.css`，找到这一行：

```css
background-image: url('https://...');
```

把括号里的网址换成你想要的图片地址即可。

---

## 修改网站名称和导航

打开 `mkdocs.yml`，修改顶部几行：

```yaml
site_name: 我的笔记        ← 网站名称（显示在左上角）
site_description: 简短描述
site_author: 你的名字
```

---

## 发布到 GitHub Pages

每次修改完文件后，在终端运行：

```bash
cd ~/Desktop/network-exp-docs-main
mkdocs gh-deploy
```

稍等片刻，你的网站就会自动更新。

---

## Markdown 常用语法速查

```markdown
# 一级标题
## 二级标题

**粗体**  _斜体_

- 无序列表项
- 另一项

1. 有序列表
2. 另一项

[链接文字](https://网址)

![图片描述](图片地址)

`行内代码`

> 引用文字

---   水平分割线
```

### 特殊提示框

```markdown
!!! tip "小提示"
    绿色的提示框

!!! note "备注"
    蓝色的备注框

!!! warning "注意"
    橙色的警告框

!!! quote "引用"
    引用框
```
