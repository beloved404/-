# 智慧物联网教学支持平台

## 项目简介

本项目是一个为“智慧物联网导论”课程设计的教学支持网站。它旨在为学生提供一个方便快捷的途径来访问课程相关的教学资源，包括各章节的教学PPT。网站具有动态的粒子背景效果，并使用 Microsoft Office Online Viewer 进行 PPTX 文件的在线预览。

## 主要功能

* **首页 (index.html)**：
    * 展示课程教材简介。
    * 以卡片形式列出课程的主要章节，用户可以点击进入对应章节的资源目录。
    * 带有动态粒子背景效果。
* **资源目录页 (nav.html)**：
    * 根据首页选择的章节，动态加载该章节下的各个小节。
    * 以手风琴（Accordion）效果展示小节列表，点击小节可展开或折叠其下的资源列表。
    * 提供 PPTX 文件的在线预览功能（通过 Office Online Viewer）。
    * 提供资源文件的下载功能。
    * 同样带有动态粒子背景效果。
* **响应式设计**：网站在不同屏幕尺寸下（桌面、平板、移动设备）应具有良好的显示效果。

## 文件结构

├── assets/               # 存放教学资源文件 (如 .pptx)
│   ├── chapter1-1.pptx
│   └── ...
├── index.html            # 网站首页
├── nav.html              # 课程资源目录与预览页
├── main.js               #主要的 JavaScript 逻辑文件
├── style.css             #主要的 CSS 样式文件
└── README.md             # 本文件
## 技术栈

* HTML5
* CSS3
* 原生 JavaScript (Vanilla JS)
* [Particles.js](https://vincentgarreau.com/particles.js/) (用于动态粒子背景效果)
* Microsoft Office Online Viewer (用于 PPTX 文件预览)

## 设置与运行

1.  **克隆或下载项目**：
    如果您通过 Git 管理项目，请克隆仓库。否则，请确保所有文件（`index.html`, `nav.html`, `main.js`, `style.css` 及 `assets` 文件夹）都位于同一个项目根目录下。

2.  **准备资源文件**：
    * 在项目根目录下创建一个名为 `assets` 的文件夹。
    * 将所有教学 PPTX 文件（或其他资源）放入 `assets` 文件夹中。
    * 确保 `main.js` 文件中的 `fileMap` 对象正确映射了资源名称到 `assets` 文件夹下的实际文件路径。

3.  **本地运行**：
    * 由于浏览器对本地文件直接通过 `file:///` 协议访问 `fetch` API 和某些跨域资源（如 Office Online Viewer）存在限制，推荐使用一个本地 HTTP 服务器来运行此网站。
    * 如果您安装了 Node.js，可以使用 `http-server` 或 `live-server` 等工具：
        * 安装 `live-server` (全局安装一次即可): `npm install -g live-server`
        * 在项目根目录下运行: `live-server`
        * 浏览器会自动打开网站，通常地址是 `http://127.0.0.1:8080` 或类似的端口。
    * 如果您使用 VS Code，可以安装 "Live Server" 扩展，然后右键点击 `index.html` 选择 "Open with Live Server"。

## 配置说明

主要的配置都在 `main.js` 文件中：

* **`chaptersData` 对象**：
    * 定义了课程的章节结构、每章的标题、图标、描述以及各小节的标题和资源列表。
    * 每个资源的 `name` 必须与 `fileMap` 中的键对应。
    * 每个资源的 `type` 属性（例如 `'pptx'`）用于 `openPreview` 函数判断如何处理该资源。

    ```javascript
    const chaptersData = {
      chapter1: {
        title: '第一章 感知物理世界',
        icon: '🌐',
        description: '传感器原理与数据采集',
        sections: {
          '1.1': { title: '1.1 传感器技术原理', resources: [{ name: '第一章1.1教学PPT', type: 'pptx' }] },
          // ...更多章节和小节
        }
      },
      // ...更多章节
    };
    ```

* **`fileMap` 对象**：
    * 将 `chaptersData` 中定义的资源名称映射到 `assets` 文件夹下实际的文件路径。
    * 路径应该是相对于网站根目录的相对路径，且**不**以 `/` 开头（例如：`'assets/chapter1-1.pptx'`）。

    ```javascript
    const fileMap = {
      '第一章1.1教学PPT': 'assets/chapter1-1.pptx',
      // ...更多文件映射
    };
    ```

## 预览功能说明

* 本网站使用 Microsoft Office Online Viewer 来实现在线预览 PPTX 文件。
* **重要**：此预览功能要求被预览的文件能够通过一个**公开可访问的 URL**被 Office Online Viewer 服务获取到。
    * 因此，当您在**本地服务器** (如 `http://127.0.0.1:5500/`) 上运行时，Office Online Viewer **通常无法访问**到您本地的 PPTX 文件，预览框内可能会显示 "File not found" 或类似错误。
    * 当网站部署到**公共 Web 服务器** (如 GitHub Pages) 后，只要 `assets` 文件夹及其内容也随之正确部署并公开可访问，预览功能才能正常工作。`main.js` 中的 URL 构造逻辑 (`const resolvedFileUrl = sitePrefix + filePath;`) 是为这种部署情况设计的。

## 部署

本项目是一个静态网站，可以部署到多种平台：

* **GitHub Pages**：免费，与 GitHub 仓库集成良好。只需将项目文件推送到 GitHub 仓库，并在仓库设置中启用 GitHub Pages 即可。确保 `main.js` 中的 `sitePrefix` 常量（如果使用了硬编码前缀的方式）与您的 GitHub Pages 网址匹配。
* **Netlify, Vercel, Cloudflare Pages**：这些平台也提供优秀的静态网站免费托管服务，通常支持从 Git 仓库自动部署。
* **传统虚拟主机**：可以通过 FTP 或文件管理器将所有文件上传到主机的网站根目录。

## 开发团队

* 肖冠华
* 谢锦文
* 黄劲超
* 王路华
* 朱霞宇
* 张蕊

---

希望这个 README 对您有所帮助！
