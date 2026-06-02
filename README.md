<div align="center">
  <h1>Cober Web Music</h1>

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/favicon.svg">
    <img width="128" height="128" alt="Cober Music" src="./public/favicon.svg">
  </picture>
</div>

<div align="center">
  <p>基于 React + Vite 的第三方网易云音乐 Web 客户端</p>
  <p><strong>简洁、流畅、响应式</strong></p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite 6">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/Zustand-5-orange?logo=react&logoColor=white" alt="Zustand">
  <img src="https://img.shields.io/badge/Howler.js-2-2C2C2C?logo=javascript&logoColor=white" alt="Howler.js">
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white" alt="GSAP">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License MIT">
</div>

## 🖼️ 界面展示

> 截图待补充

## ✨ 功能与特性

- **双端适配**：桌面端侧边栏 + 底部播放栏布局，移动端底部导航 + 迷你播放器
- **沉浸式播放**：全屏播放页，毛玻璃背景、唱片旋转动画、逐行滚动歌词
- **主题系统**：明暗主题切换、自定义主题色、支持跟随系统
- **登录方式**：扫码登录与手机号登录
- **浏览发现**：歌单、专辑、歌手、排行榜、MV、视频
- **个性化推荐**：每日推荐、最新音乐、相似歌曲
- **音乐搜索**：单曲、歌手、专辑、歌单、MV 多维度搜索
- **播放控制**：播放队列管理、四种播放模式（顺序、循环、随机、单曲循环）
- **收藏系统**：收藏歌单 / 专辑 / 歌手、喜欢歌曲
- **音频功能**：多音质选择（标准、高清、无损）、跨淡入淡出、播放历史
- **键盘快捷键**：完整的键盘操作支持

## 📅 更新计划

- [ ] 桌面歌词
- [ ] 下载歌曲
- [ ] 歌词翻译与罗马音显示
- [ ] 本地音乐播放
- [ ] 音乐网盘

## 🚀 快速开始

在开始之前，请确保你的开发环境已安装 [Node.js](https://nodejs.org/)（>= 18）。

### 1. 部署后端 API

本项目不直接提供后端服务，需要自行部署 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)。

`ash
git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
cd NeteaseCloudMusicApi
node app.js
`

API 服务默认运行在 http://localhost:3000。

### 2. 安装运行

`ash
# 克隆项目
git clone https://github.com/your-username/cober-web-music.git
cd cober-web-music

# 安装依赖
npm install

# 启动开发环境
npm run dev
`

前端开发服务器默认运行在 http://localhost:5173，Vite 已配置代理将 /api 请求转发至后端。

### 3. 构建

`ash
npm run build
npm run preview
`

## ⚙️ 自定义 API 配置

项目默认通过 Vite 代理将 /api 请求转发至 http://localhost:3000。编辑 ite.config.ts 修改 	arget：

`	s
// vite.config.ts
server: {
  proxy: {
    "^/api": {
      target: "http://localhost:3000",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
},
`

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **React 18** | UI 框架 |
| **Vite 6** | 构建工具 |
| **TypeScript 5** | 类型安全 |
| **Tailwind CSS 4** | CSS 样式 |
| **Zustand** | 状态管理 |
| **React Router v6** | 路由 |
| **Howler.js** | 音频播放引擎 |
| **GSAP** | 动画引擎 |
| **Axios** | HTTP 请求 |
| **Lucide React** | 图标库 |
| **NeteaseCloudMusicApi** | 后端数据源 |

## 🎁 致谢

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
- [Howler.js](https://github.com/goldfire/howler.js)
- [GSAP](https://github.com/greensock/GSAP)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)
- [Lucide](https://github.com/lucide-icons/lucide)

## ⚠️ 声明

- 本项目为个人学习用的开源项目，仅供学习交流使用。
- 项目中使用的音乐数据及 API 均来自第三方，版权归属于网易云音乐，**请勿用于任何商业用途**。

## 📄 开源协议

本项目基于 [MIT](./LICENSE) 协议开源。
