# Form & Field

React + TypeScript 海外商品选购演示应用。英文界面，USD 价格，响应式商品目录、搜索与组合筛选、商品详情、颜色选择、收藏、持久化购物车与演示结算。

## 本地运行

Node.js 22.12+，安装依赖后启动：

```bash
npm install
npm run dev
```

打开终端显示的本地地址，默认 http://localhost:5173。手机与电脑接入同一网络时，可使用启动信息中的 Network 地址。

## 验证

```bash
npm test
npm run build
npm run test:e2e
```

浏览器测试使用已安装的 Google Chrome；自动连接或启动本地开发服务，覆盖 1440、768、390、375px。截图保存在 `artifacts/`，失败记录保存在 `test-results/`。

## GitHub Pages 发布

`.github/workflows/deploy.yml` 在 PR 上运行测试但不发布；推送 `main` 或手动运行 workflow 时，会先执行 `npm run predeploy`，再把 `dist/` 发布到 GitHub Pages。

首次启用时，在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。之后将 workflow 推送到 `main`，在 **Actions** 页面查看运行记录和部署地址。

`npm run deploy` 是旧的手动分支发布方式。启用 Actions 后请使用 Actions 发布，不要将 Pages 来源切回 `gh-pages` 分支。

开发地址仍是 `http://localhost:5173/`。生产构建和 `npm run preview` 使用 `/overseas-mall-2/`；脚本、样式、图片、字体和图标都会包含此项目路径。修改仓库名称时需同步更新 `vite.config.ts` 中的 `GITHUB_PAGES_BASE`。

## 目录

- `src/data/products.ts`：12 件示例商品；金额统一使用整数美分，库存由同一商品的全部颜色共享。
- `src/lib/shop.ts`：组合筛选、排序、购物车 reducer、金额与存储数据校验。
- `src/hooks/useShop.ts`：购物车和收藏的 localStorage 持久化。
- `src/components/`：搜索导航、商品卡片、筛选、详情弹窗与购物袋。
- `public/images/`：本地商品及场景图片。字体由 `@fontsource-variable` 随构建提供，不依赖外部字体服务。
- `docs/features/2026-10-27-storefront/`：设计、任务与验收记录。

## 演示边界

本应用使用虚构商品、价格、评分和库存，只为交互与视觉演示。结算页明确标注预览，不收取支付信息，不产生订单。不包含真实登录、后端库存、税费计算或支付集成。

示例摄影和人物头像来自 Unsplash。正式商用前应换成经品牌授权的商品图片与真实商品资料；颜色选项为演示数据，当前每件商品只有一张图片，不随颜色切换。
