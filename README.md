# 开特云 · company-site

独立的 Astro + 原生 CSS 静态公司官网。中文默认，英文位于 `/en/`；三个页面 × 两种语言：首页、产品、关于。没有后端、表单、Cookie、第三方追踪、外链字体或外链图片。

## 设计方向（v3）

参照同类公司官网（Lila Sciences、Radical AI、Periodic Labs、Benchling、TetraScience）：一句大标题、真实的科学与产品画面、每屏极少的字。首页叙事：

1. **首屏**：“每一块样品，都有完整的来路。”＋一张“样品记录卡”——同一个样品编号下的 RHEED 生长振荡、STM 形貌、PPMS 磁阻。
2. **问题**：一块样品走过六台仪器，数据散落在六个地方（`fig2_final_FINAL(2).pdf`）。
3. **做法**：同样六个文件，按时间串在样品编号上，并给出图 2 的溯源链。
4. **全链路**：生长（MBE · RHEED）→ 转移（转岛机）→ 测量（PPMS）→ 分析（DataViewer）→ 仿真，每一环写明现状。
5. **产品**：DataViewer 开发版真实界面截图（样品档案 / 数据立方 / 工作流 / 溯源，可切换）。
6. **仪器端**：PPMS 测控软件真实截图（mock 仪器）；MBE / RHEED 为下一步。
7. **设备**：转岛机三维设计渲染（Blender / Cycles）。
8. 为谁而建 → AI（MCP 概念示意）→ 我们 → 招募首批合作实验室。

产品页：DataViewer / PPMS 测控 / 转岛机（整机 + 细节渲染）/ 仿真（有限元示意）/ AI 接口 / 路线图。

完整 brief 见 `BRIEF.md`。

## 开发和构建

需要 Node.js ≥ 22.12.0（推荐 24，见 `.nvmrc`）。

```sh
npm install
npm run dev        # http://127.0.0.1:4321/company-site/
npm run build
npm run preview -- --port 4322
```

## 文件地图

| 位置 | 内容 |
| --- | --- |
| `src/data/copy.ts` | 全部中英文案（改文案只改这里） |
| `src/data/site.ts` | 公司名、邮箱、团队占位符；路由与链接工具 |
| `src/views/` | 三个页面：`Home` / `Products` / `About` |
| `src/components/` | 样品记录卡、产品截图切换、测量序列卡、CTA、Logo、图标 |
| `src/lib/curves.ts` | 构建期计算的曲线：RHEED 振荡、STM 台阶剖面、HLN 弱反局域化磁阻 |
| `scripts/gen-science.mjs` | 生成 `src/assets/science/` 的 RHEED 衍射图、STM 形貌图与有限元温度场示意（真实求解电势与焦耳热；固定随机种子，可复现） |
| `scripts/gen-og.mjs` | 生成链接分享卡片 `public/og.png` |
| `src/assets/product/` | DataViewer 与 PPMS 开发版界面截图（演示数据 / mock 仪器） |
| `src/assets/hardware/` | 转岛机渲染：由 `zhuandao_design_v6_preview.blend` 用 Cycles 重新布光渲染，透明背景 |
| `src/styles/global.css` | 设计系统：颜色 token、排版、各区块样式、亮/暗主题 |

## 占位符清单

| 字段 | 当前值 | 修改位置 |
| --- | --- | --- |
| `{{联系邮箱}}` | 待确认；所有“预约交流 / 写信给我们”按钮都指向它 | `src/data/site.ts` → `company.email` |
| `{{团队介绍}}` | 待确认；关于页“团队”卡片 | `src/data/site.ts` → `company.team` |

英文页面保留中文品牌名“开特云”，未自行命名英文品牌。

## 诚实规则（写进了验收脚本）

- 现在时只用于今天真在运行的能力：DataViewer 早期版本（CSV 导入、样品档案、N 维浏览、工作流、溯源）与 PPMS 测控。其余在句子里写成“下一步 / 正在开发 / 设计中”，不再贴满状态徽章。
- 首屏样品记录卡标注“示意数据”；产品截图标注“开发版界面 · 演示数据”；AI 对话标注“概念示意 · 开发中”；转岛机标注“三维设计渲染”；仿真图标注“示意”。`npm run verify` 会断言这些标注存在。
- 转岛机：只写新一代控制软件已在全 mock 环境跑通、实机验收尚待完成；不声称设备已商用。
- 不写客户、合作 logo、评价、下载量、融资、奖项或性能数字。Claude / Codex 仅描述计划兼容的助手，不表示合作或背书。

## 验收

先 `npm run build` 并启动 `npm run preview -- --port 4322`，另开终端：

```sh
npm run verify
npm run audit
```

`verify`：6 个页面 × 2 个主题 × 320/390/768/1440px——无横向溢出、单个 h1、图片带 alt 与尺寸、内部链接与锚点有效、无外部请求、诚实标注存在、产品截图切换、主题持久化、语言切换保留页面、手机菜单、无 JavaScript 可浏览；并生成 `artifacts/` 下的中英 × 亮暗 × 手机/桌面截图。

`audit`：Lighthouse 默认手机模拟，12 个组合的性能与无障碍，最低要求 90。汇总见 `artifacts/lighthouse-summary.json`，验收记录见 `artifacts/ACCEPTANCE.md`。脚本默认使用 macOS 的 Chrome，其他系统设置 `CHROME_PATH`；`VERIFY_URL` 可指向其他预览地址或线上站点。

## 部署（GitHub Pages）

推送到 `main` 后由 `.github/workflows/deploy.yml` 自动构建并发布到 `https://shajiuquan.github.io/company-site/`。`astro.config.mjs` 的 `site` / `base` 决定站点地址与仓库路径，换仓库时同时修改。Gitee Pages 目前已下架，需要时参考 Gitee 当时的官方说明，把 `dist/` 内容发布到静态分支。
