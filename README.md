# 开特云 · company-site

独立的 Astro + 原生 CSS 静态公司官网。中文默认，英文位于 `/en/`；包含首页、解决方案、行业场景、产品进展、关于、联系共十二个静态页面。首页按宣传型官网组织：品牌主张 → 解决方案 → 行业场景 → 科研趋势 → 三块产品支撑 → 联系。没有后端、表单、第三方收集服务、外链字体或图片。所有图形由本仓库 SVG/CSS 绘制。

## 开发和构建

需要 Node.js ≥ 22.12.0 和 npm ≥ 9.6.5，推荐 Node.js 24（`.nvmrc`）。

```sh
npm install
npm run dev
# http://127.0.0.1:4321/company-site/
npm run build
npm run preview -- --port 4322
# http://127.0.0.1:4322/company-site/
```

构建产物位于 `dist/`。亮暗主题使用 CSS 变量；首次访问跟随系统，手动选择保存在浏览器本地。语言切换保留当前页面。

## 占位符清单

所有未知信息统一用 `{{...}}`，不编造内容。

| 字段 | 当前值 | 修改位置 |
| --- | --- | --- |
| `{{公司名}}` | 已由用户确认替换为“开特云” | `src/data/site.ts` → `company.name` |
| `{{团队介绍}}` | 待确认 | `src/data/site.ts` → `company.team` |
| `{{联系邮箱}}` | 待确认；mailto 入口仍是该占位符，尚不能正常发信 | `src/data/site.ts` → `company.email` |

“开特云”在英文页面保留中文品牌名，未自行命名英文品牌。确认英文名后可补充独立的英文名称字段。

## 修改文案与功能状态

`src/data/site.ts` 保存公司信息和双语产品/关于/联系文案；`src/data/marketing.ts` 保存双语品牌主张、解决方案、行业场景与趋势文案。修改对应的中英两份文案后重新构建。页面结构在 `src/views/`；示意图在 `src/components/`；颜色、排版和响应式规则在 `src/styles/global.css`。

每个功能对象的 `status` 只能为 `available`（可用）、`development`（开发中）、`planned`（规划中）。状态徽章同时包含文字与颜色。不要把规划中功能写成已经可用。

- DataViewer：所有功能处于 alpha 开发中。
- Instrument Workbench：PPMS 输运测量自动化仅限实验室内部使用；MBE/RHEED 接入规划中。数字主线图中的 SPM、制备及仿真是目标工作流示意，不代表已提供接入或仿真产品。
- Agent 接口：全部规划中；设计要求是所有 AI 动作经人工批准并留痕。正文中的 Claude/Codex 仅描述计划兼容的助手，不表示合作或背书。

网站没有客户、机构 logo、评价、销量、融资、奖项或虚构性能数字。首页图形标为“概念示意 / 非产品界面”。

## GitHub Pages 部署

当前配置：仓库 `ShaJiuquan/company-site`，目标地址 `https://shajiuquan.github.io/company-site/`。英文为 `https://shajiuquan.github.io/company-site/en/`。

1. 在 GitHub 创建独立的 `company-site` 仓库，推送本目录的代码与 `package-lock.json` 到 `main`。
2. 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
3. `.github/workflows/deploy.yml` 会安装 Node.js 24，运行 `npm ci` 和 `npm run build`，上传并发布 `dist/`。
4. 在 **Actions** 中检查部署成功，再访问目标地址以及 `/en/`，直接刷新产品、关于、联系页面确认正常。

`astro.config.mjs` 的 `site` 为站点源地址，`base` 为仓库路径。部署到其他仓库时同时修改这两项。所有导航和资源路径均包含 `base`。

官方参考：[Astro GitHub Pages 指南](https://docs.astro.build/en/guides/deploy/github/)。

## Gitee Pages 部署状态与准备步骤

截至 2026-09-30，Gitee 官方反馈说明 Pages 功能已下架，无法把“服务 → Gitee Pages → 部署”作为当前可执行的部署流程。本项目没有声称已部署到 Gitee Pages。参考：[Gitee 官方反馈](https://gitee.com/oschina/git-osc/issues/ID1EVM?skip_mobile=true)、[Pages 服务页面](https://gitee.com/openHappy/continew-starter/pages)。

如该服务恢复并在你的账号开放，可按以下准备流程发布静态产物：

1. 创建独立的 Gitee `company-site` 仓库，并以 Gitee 当时提供的实际站点地址确认 `site` 和 `base`。
2. 按实际地址构建，例如：`SITE_URL=https://你的实际站点源地址 SITE_BASE=/company-site npm run build`。根域名部署用 `SITE_BASE=/`。
3. 将 `dist/` 的**内容**提交到专门的 `pages` 分支，保证分支根目录有 `index.html`、`en/`、`_astro/` 与 `.nojekyll`。
4. 仅当服务入口恢复时，在该仓库的 Pages 页面选择这个静态分支及根目录，按当时官方说明部署。后续更新需要重新构建并更新静态分支。
5. 验证中英文、主题切换、子页面刷新与静态资源路径。服务仍不可用时，这些步骤只准备构建产物，不会生成可访问的网站。

源代码托管到 Gitee 与 Pages 网站托管是不同事项。GitHub Pages 是本次实际部署目标。

## 验收与截图

先 `npm run build`、`npm run preview -- --port 4322`，在另一个终端运行：

```sh
npm run verify
npm run audit
```

脚本默认使用 macOS 已安装的 Chrome；其他系统将 `CHROME_PATH` 设置为本机 Chrome 可执行文件。可用 `VERIFY_URL` 指向另一预览地址或已部署的站点。浏览器测试运行在隔离的无头测试进程中，不使用个人浏览器资料。

`verify` 检查十二个页面 × 两个主题 × 320/390/768/1440px，导航、语言保留页面、主题持久化、无 JS 导航、功能状态、静态链接、错误资源与外部页面请求。它生成首页中文/英文 × 亮/暗 × 390px 手机截图，以及桌面截图。

`audit` 使用 Lighthouse 默认手机模拟和节流，检查十二个页面 × 两个主题的性能与可访问性，两项最低要求均为 90。完整报告留在本机 `artifacts/`，可提交的汇总为 `artifacts/lighthouse-summary.json`。分数是网站验收记录，不是产品能力或实验测量性能。

验收交付见 `artifacts/ACCEPTANCE.md`。
