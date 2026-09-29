# 开特云官网验收

验收日期：2026-09-30。独立目录：`/Users/jiuquansha/dev/company-site`，独立仓库：`ShaJiuquan/company-site`。公司名由用户确认。当前设计按用户补充要求，以宣传、整体解决方案、行业与趋势为主，产品细节放在独立页面。

## 本地验收结果

| 要求 | 当前证据 |
| --- | --- |
| Astro + 原生 CSS / 纯静态 | `astro.config.mjs` 的 `output: static`；12 个静态页面输出到 `dist/` |
| 独立工程 | 本目录单独初始化 Git；未编辑 dataviewer、simviewer、PPMS |
| 安装、构建零错误 | Node.js 24.19.0，npm 11.20.0；`npm install && npm run build` 退出 0 |
| 开发预览 | `npm run dev -- --port 4321` 正常启动；首页请求 HTTP 200 |
| 中英双语 | 两种语言各含首页、解决方案、行业、产品、关于、联系；语言切换保留当前页面 |
| 亮/暗色 | CSS 变量主题；系统偏好、手动切换、跨页面与刷新记忆均检查 |
| 手机与桌面宽度 | 12 页面 × 2 主题 × 320/390/768/1440px 均无水平溢出 |
| 页面运行与资源 | 无页面脚本错误、失败资源或外部页面请求；内部导航链接全部 HTTP 200 |
| 无 JS 可访问 | 首页内容与产品链接在关闭 JS 时仍可使用 |
| 可追溯工作流图 | 原创 SVG，生长 → 制备 → 测量 → 分析 → 仿真，样品 ID 串联；标为目标工作流示意 |
| 三块产品与真实状态 | 首页三张产品卡；产品页含“问题 / 工作方式 / 当前状态”；状态文字与徽章同时呈现 |
| 诚实边界 | 无客户 logo、评价、融资、奖项、下载量或虚构性能数据；规划功能使用计划/将来语态 |
| 联系与隐私 | mailto 入口；没有表单、收集服务、外链图片、外链字体、iframe 或统计脚本 |
| Lighthouse | 12 页面 × 2 主题，默认手机模拟节流；性能最低 100、可访问性最低 100 |
| 文档 | README 含 {{...}} 清单、双语文案修改方法、GitHub Pages 配置及 Gitee Pages 现状与准备步骤 |

机器验收记录：[verification.json](verification.json)、[lighthouse-summary.json](lighthouse-summary.json)。完整 Lighthouse JSON/HTML 保留在本地 `artifacts/`，不提交到仓库。

## 手机截图（390 × 844 视口，全页）

- [中文 · 亮色](zh-light-mobile.png)
- [中文 · 暗色](zh-dark-mobile.png)
- [英文 · 亮色](en-light-mobile.png)
- [英文 · 暗色](en-dark-mobile.png)

同目录还包含四张手机首屏、四张桌面全页与四张桌面首屏截图。

## 待确认或未做到的事项

1. `{{团队介绍}}` 尚未提供，关于页保留占位段落。
2. `{{联系邮箱}}` 尚未提供，mailto 保留占位符，并在页面明确提示；当前无法正常发信。
3. 英文品牌名尚未指定，英文页面继续使用“开特云”。
4. 未配置自定义域名；本次使用 GitHub Pages 地址。
5. Gitee Pages 现已下架，无法进行该服务的实际部署；README 中的相关准备流程明确以服务恢复为条件。
6. 网站描述的是当前产品状态与建设方向，未制作虚构客户案例或宣称整个数字主线已交付。

## 趋势主题的编辑依据

AI for Science、仪器自动化与材料数据溯源用于组织官网叙事，未把其他机构成果作为开特云能力或背书。供内容维护者参考的公开原始资料：

- [材料数据互操作性、可重用性与溯源的研究方向](https://www.nist.gov/mml/mmsd/data-and-ai-driven-materials-science-group/data-and-protocols)
- [材料实验室模块化与数字基础设施](https://www.nist.gov/programs-projects/development-standards-support-modular-and-autonomous-laboratory-ecosystem)
- [2026 年关于人工参与的 AI 仪器操作研究](https://www.nature.com/articles/s41524-026-02005-0)

这些名称与链接仅出现在交付文档中，不出现在网站的客户、合作或品牌背书位置。
