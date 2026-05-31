# 使用说明

本页告诉你如何维护和扩展这个网站，不需要任何编程基础。

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
