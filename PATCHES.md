# AXP · 分轮改动清单与回滚方法

> 每轮一批，改动可追溯、可回滚。最新轮次在前。

---

# v1.0.7 · 站点数据自推导批次（ROADMAP D14/D15/D16）

> 基线：`Ultra-Guru/axp` @ `103a171`（v1.0.6）
> 性质：站点不再手写仓库统计数字，路线图口径与 README / spec 对齐。`axp/` 内规范 / schema / 校验器 / CLI / 运行时 / 示例**逐字节未改动**（仅 CHANGELOG 追加 1.0.7 段）。

## 1. 改了什么

| # | 文件 | 改动 | 为什么 |
|---|---|---|---|
| 1 | `src/lib/axp-server.ts` | 统计推导重构：`spec/` 文件数 fs 扫描；`validatorTests` / `runtimeAssertions` 构建期真实执行两套零依赖 Node 测试并解析汇总行（`run-tests.mjs --json` 的 `total` / `smoke.mjs` 的 `ALL N`）；`crossCheck` 优先真实执行 python3，无 python 环境退回结构化推导（`2 + 2×示例 + cases + 2 + 2×业务用例`）；文档四组计数按 group 汇总；测试数按进程缓存（dev 刷新不重跑，axp/ 文件改动仍即时反映）；删去从未被消费的 `loadingSteps` / `hostLevels` 死字段 | D15：测试数 / 文档数变化后无需手改。套件执行失败 → 站点构建失败（站点宣称全绿，不能展示挂了套件的数字）；交叉复核的「是否通过」仍由 CI axp-selfcheck 门禁，结构化回退只提供计数 |
| 2 | `src/components/axp/data.ts` | `SELF_CHECKS` / `TOOLCHAIN` 从静态常量改为 `selfChecks(c)` / `toolchain(c)` 函数，数字由服务端注入的 `RepoCounts` 模板化 | D15：同一数字只在一处推导，客户端零硬编码 |
| 3 | `src/components/axp/sections-host.tsx` | `ToolingSection` 接收 `counts` prop；「一键自检」代码块注释数字模板化；`RoadmapSection` 渲染新增的 `note` 实现状态注记 | D14 + D15 |
| 4 | `src/components/axp/data.ts`（ROADMAP） | 条目新增 `note?` 字段：M2「Node 参考运行时已跑通 · Android 真机骨架未编译验证」、M3「规范 / 示例 / 教程就位 · 真机域适配器待补」、M4「gradient 选择算法已实现 · Shizuku L3 通道待接」；区块导语去掉「截至 v1.0.3」版本锚点 | D14：与 README「M2 ✅（Node）/ ⚠️（Android 骨架）」与 spec §12 进度段口径统一 |
| 5 | `src/components/axp/library-section.tsx` | 导语文档计数从 `docs` prop 按组推导；`fetchDoc` 的已加载内容与在途请求移入 `cacheRef` / `inflightRef`，依赖数组从 `[content]` 清空为 `[]` | D15（计数）+ D16：消除每次加载文档后 `fetchDoc → openDoc → 注册 effect` 的无效重建链；顺带修复同文档连点的在途重复请求 |
| 6 | `src/components/axp/axp-site.tsx` | 向 `ToolingSection` 传入 `data.stats` 的计数切片 | 数据流接线 |
| 7 | `package.json` / `axp/CHANGELOG.md` / `README.md` / `ROADMAP-ALL-TASKS.md` / `PATCHES.md` | 版本 1.0.7、变更记录、任务状态同步 | 文档与仓库实际一致 |

## 2. 验证

| 检查 | 结果 |
|---|---|
| `bunx tsc --noEmit` | 零错误 |
| `bun run lint` | 零违规（含 exhaustive-deps error 级） |
| `bun run build`（含类型检查） | 成功；prerender 中真实执行三套测试 |
| `node scripts/site-check.mjs` | standalone 45 项通过 |
| 结构化回退 vs 真实执行 | `2 + 2×4 + 17 + 2 + 2×7 = 43` 与 `43 passed, 0 failed` 交叉核对一致 |
| 页面渲染实测 | 31/31、43/43、30/30、4/4、规范正文 9 篇、M2/M3/M4 注记全部正确渲染 |
| 文档库缓存实测 | FAQ ↔ 01-format 切回复访零新请求；控制台零错误；移动端 Sheet 正常 |

## 3. 怎么回滚

| 想撤掉 | 做法 |
|---|---|
| 1（统计推导） | `git checkout 103a171 -- src/lib/axp-server.ts` |
| 2–3（数据函数化） | `git checkout 103a171 -- src/components/axp/data.ts src/components/axp/sections-host.tsx` |
| 4（路线图注记） | 同上，data.ts 一并回退 |
| 5（文档库） | `git checkout 103a171 -- src/components/axp/library-section.tsx` |
| 6（接线） | `git checkout 103a171 -- src/components/axp/axp-site.tsx` |
| 7（文档） | 按 diff 回退对应段落 |

---

# v1.0.6 · 依赖与模板清理批次（ROADMAP G05/G06/G08）

> 基线：`Ultra-Guru/axp` @ `1676785`（v1.0.5）
> 性质：只删不写。`axp/` 内规范 / schema / 校验器 / CLI / 运行时 / 示例**逐字节未改动**（仅 CHANGELOG 追加 1.0.6 段）。

## 1. 改了什么

| # | 文件 | 改动 | 为什么 |
|---|---|---|---|
| 1 | `src/components/ui/`（36 个文件） | 删除不可达组件：alert · alert-dialog · aspect-ratio · avatar · breadcrumb · calendar · carousel · chart · checkbox · command · context-menu · dialog · drawer · dropdown-menu · form · hover-card · input-otp · menubar · navigation-menu · pagination · popover · progress · radio-group · resizable · scroll-area · select · separator · sidebar · skeleton · slider · sonner · table · tabs · textarea · toggle · toggle-group | G06：可达性闭包分析（根 = `ui/` 目录外被引用的组件，再沿组件间互相引用传递）。保留 12 个：accordion / badge / button / card / collapsible / input / label / sheet / switch / toast / toaster / tooltip |
| 2 | `package.json` | 移除 47 个未用依赖（`dependencies` 66 → 19）；`version` → 1.0.6 | G05/G08：先删组件再做第二轮依赖推导——19 个审计余量（`@dnd-kit/*`、`@mdxeditor/editor`、`framer-motion`、`next-auth`、`next-intl`、`sharp`、`zod`、`zustand` 等）+ 28 个级联孤儿（`recharts`、`embla-carousel-react`、`cmdk`、`vaul`、`sonner`、`react-hook-form`、19 个 `@radix-ui/react-*` 等）。只删组件不清孤儿依赖会让 lockfile 继续携带死重量 |
| 3 | `bun.lock` | 重生成（Removed: 47） | 依赖变更必须同步 lock；`--frozen-lockfile` 复核通过 |
| 4 | `axp/CHANGELOG.md` / `README.md` / `ROADMAP-ALL-TASKS.md` / `PATCHES.md` | 版本 1.0.6、变更记录、任务状态同步 | 文档与仓库实际一致 |
| 5 | `tailwind.config.ts` | 整删（Tailwind v3 模板残留） | v1.0.6 首推（2400a46）后 **CI run #6 `web-build` 即败**：`tsc` 报 `Cannot find module 'tailwindcss-animate'`——该文件 import 已删依赖，但本地 node_modules 有残留掩蔽了错误（`bun install` 的 Removed 未清干净）。深挖后确认为死配置：站点用 Tailwind 4（globals.css 的 `@import "tailwindcss"` / `@plugin`），v4 不自动加载 JS 配置且 globals.css 无 `@config` 指令，`components.json` 的 tailwind.config 字段为空。修复随批附干净重装流程：`rm -rf node_modules && bun install --frozen-lockfile`，本地从此与 CI 同口径。**门禁有效性第二次实证**（第一次是 v1.0.5 的 Prisma） |

> 特殊说明：`react-dom` 移出直接依赖后，经 `next` 的 `peerDependencies`（`^18.2.0 || ^19`）自动安装，node_modules 实测 19.2.3 在位，构建与 dev 均正常。`@radix-ui/react-dialog` 因被保留的 `sheet.tsx` 引用而保留。

## 2. 验证

| 检查 | 结果 |
|---|---|
| `bunx tsc --noEmit` | 零错误（tailwind.config.ts 删除后，在 `rm -rf node_modules` 干净重装的对齐环境下复验） |
| `bun run lint` | 零违规（含 exhaustive-deps error 级） |
| `bun run build`（含类型检查） | 成功，12.4s（首验）；tailwind.config.ts 修复后干净环境复验通过 |
| `node scripts/site-check.mjs` | standalone 45 项通过 |
| `bun install --frozen-lockfile` | 通过（543 installs / 603 packages → 删 tailwind.config 后 534 packages 干净重装） |
| dev server + `/api/validate` 端到端 | 200；结构化校验结果正常（API → 临时目录 → 子进程 → axp 校验器全链路） |

## 3. 怎么回滚

| 想撤掉 | 做法 |
|---|---|
| 1（组件） | `git checkout 1676785 -- src/components/ui/` |
| 2–3（依赖与 lock） | `git checkout 1676785 -- package.json bun.lock && bun install` |
| 4（文档） | 按 diff 回退对应段落 |
| 5（tailwind 配置） | `git checkout 2400a46^ -- tailwind.config.ts && bun add tailwindcss-animate`（注意：恢复后需接受 Tailwind v3 死配置回归） |

---

# v1.0.5 · 质量门禁批次（ROADMAP E06–E09）

> 基线：`Ultra-Guru/axp` @ `e4e7de0`（v1.0.4）
> 性质：把 lint 与 build 从「能过」变成「能挡问题」。`axp/` 内规范 / schema / 校验器 / CLI / 运行时 / 示例**逐字节未改动**（仅 CHANGELOG 追加 1.0.5 段）。

## 1. 改了什么

| # | 文件 | 改动 | 为什么 |
|---|---|---|---|
| 1 | `next.config.ts` | `ignoreBuildErrors: false`；`reactStrictMode: true` | E07/E09：构建期真实类型检查 + 开发期双调用渲染 |
| 2 | `eslint.config.mjs` | 恢复 `@typescript-eslint/no-unused-vars`、`react-hooks/exhaustive-deps`（均 error）；JS/MJS 作用域 `no-undef` + 基础 `no-unused-vars`（error，手工 Node globals）；`axp/` 与沙盒目录移出 lint 范围 | E08：三类规则真实生效；不新增依赖避免 bun.lock 重生成（G05–G08 批次统一处理） |
| 3 | `src/components/axp/playground-section.tsx` | `ocr` 加空值守卫 | tsc TS18048，破坏性预设的真实类型缺陷 |
| 4 | `src/hooks/use-toast.ts` | `actionTypes` const 改纯 type 声明，删除重复的 `typeof` 别名 | 消除「仅作类型使用」告警与运行时对象 |
| 5 | 4 个组件文件 | 删除未使用导入（`SheetTrigger` / `Card` / `CardContent` / `ReactNode` / `Tooltip` 三件套） | lint 新规则捕获 |
| 6 | `.github/workflows/ci.yml` | `docs-links` 从仅扫 `axp/` 扩展到全仓（跳过 `node_modules` / `.git` 等） | E06：根目录 README / AUDIT / PATCHES / ROADMAP 入检 |
| 7 | `tsconfig.json` | exclude 追加 `skills` / `upload` / `mini-services` / `db` | 沙盒目录不入类型检查口径，本地与 CI 一致 |
| 8 | `package.json` / `axp/CHANGELOG.md` / `README.md` / `ROADMAP-ALL-TASKS.md` / `PATCHES.md` | 版本 1.0.5、变更记录、任务状态同步 | 文档与仓库实际一致 |
| 9 | `next.config.ts` | `allowedDevOrigins` 改为可选 `AXP_DEV_ORIGIN` 环境变量钩子 | 本地/沙盒预览域名永不入仓（.env 已 gitignore）；CI 与其他开发者零感知 |
| 10 | `prisma/schema.prisma` + `src/lib/db.ts` + `package.json`（4 个 db:* 脚本与 2 个 prisma 依赖） | 整删 Prisma 模板（G07） | E07 开启类型检查后 CI 首跑即败：干净环境（bun 默认不跑 postinstall）无生成 client，`PrismaClient` 导出缺失；本地被历史 node_modules 掩蔽。仓库内零真实消费者 |
| 11 | `bun.lock` | 移除 prisma 子树并重生成；workspace name `nextjs_tailwind_shadcn_ts` → `axp`（G04） | 依赖变更必须同步 lock；顺带修正模板残留名 |

> 说明：#10/#11 发生在 dec713c 之后，是对「CI 首跑捕获 Prisma 类型错误」的修复；两项与 E06–E09 同属 v1.0.5 质量门禁批次。

## 2. 验证

| 检查 | 结果 |
|---|---|
| `bunx tsc --noEmit` | 零错误（Prisma 删除前后各跑一次） |
| `bun run lint` | 零违规（含 exhaustive-deps error 级） |
| `bun run build`（含类型检查） | 成功，13.0s |
| `node scripts/site-check.mjs` | standalone 45 项通过 |
| `bun install --frozen-lockfile` | 通过（830 installs / 898 packages，Prisma 移除后） |
| 全仓链接检查（CI 同款脚本） | 42 md / 203 链接 / 0 断链 |
| StrictMode 浏览器实测 | 无 hydration 报错；移动端 Sheet / 演练场 / 文档库正常 |
| `AXP_DEV_ORIGIN` 钩子实测 | 带 env 求值 config → `allowedDevOrigins=[<预览域名>]`；不带 → 字段省略；未配置域名的跨源请求有警告、已配置域名无警告 |

## 3. 怎么回滚

| 想撤掉 | 做法 |
|---|---|
| 1 | `ignoreBuildErrors` 改回 `true`、`reactStrictMode` 改回 `false` |
| 2 | 把 `eslint.config.mjs` 恢复为 v1.0.4 版本（`git checkout e4e7de0 -- eslint.config.mjs`） |
| 3–5 | `git checkout e4e7de0 -- src/` |
| 6 | `git checkout e4e7de0 -- .github/workflows/ci.yml` |
| 7 | `git checkout e4e7de0 -- tsconfig.json` |
| 8 | 文档按 diff 回退对应段落 |
| 9 | 删除 `next.config.ts` 中 `AXP_DEV_ORIGIN` 展开行 |
| 10–11 | `git checkout dec713c -- prisma/ src/lib/db.ts package.json bun.lock && bun install`（dec713c 为 Prisma 删除前的提交） |

---

# v1.0.4 · 审计与 standalone 修复批次

> 状态：Stable
> 基线：`Ultra-Guru/axp` @ `2baeba7`（v1.0.3）
> 本轮性质：**审计 + 低风险工程化修复**。`axp/` 内的规范正文、JSON Schema、校验器、CLI、参考运行时、示例插件**逐字节未改动**（仅 CHANGELOG 追加 1.0.4 段）。

## 1. 改了什么

| # | 文件 | 改动 | 为什么 |
|---|---|---|---|
| 1 | `next.config.ts` | 新增 `outputFileTracingIncludes: { "/**": ["./axp/**/*"] }`；移除 `allowedDevOrigins` 生成环境残留；补注释 | Next.js output file tracing 无法静态追踪 `path.join(process.cwd(), "axp")` 拼接出的运行时路径，standalone 产物默认不含 `axp/` |
| 2 | `package.json` | `build` 脚本末尾追加 `cp -r axp .next/standalone/`；`version` → `1.0.4` | 双保险：把整套规范数据复制进 standalone 部署根，容器化部署时 `/api/doc` 与 `/api/validate` 才能工作 |
| 3 | `.github/workflows/ci.yml` | 新增 `web-build` job：`bun install --frozen-lockfile` → `bun run build` → `node scripts/site-check.mjs` | 此前 CI 从未构建过站点；配合 `ignoreBuildErrors: true` 与近乎全关的 ESLint 规则，质量门禁形同虚设 |
| 4 | `scripts/site-check.mjs` | 新增零依赖产物自检（`--prebuild` / 默认两种模式） | 让「standalone 是否自带 axp/」变成可自动断言的事实，而不是靠人记 |
| 5 | `LICENSE` | 新增顶层 MIT 许可证 | 此前只有 `axp/LICENSE`，GitHub 不识别仓库许可证 |
| 6 | `src/lib/axp-server.ts` | `readDocContent` 前缀校验改为 `abs === AXP_ROOT \|\| abs.startsWith(AXP_ROOT + path.sep)` | 避免 `axp-evil/…` 这类同前缀路径绕过字符串前缀判断（白名单已挡，属纵深防御） |
| 7 | `AUDIT.md` | 新增完成度审计报告 | 逐项给出证据、评分与 P0/P1/P2 问题 |
| 8 | `ROADMAP-ALL-TASKS.md` | 新增一次性全部任务总账 | 全项目任务一次列全，含状态 / 优先级 / 验收标准 / 落点 |
| 9 | `PATCHES.md` | 本文件 | 改动可追溯、可回滚 |
| 10 | `README.md` | 快速开始补 `--prebuild` 与 build 验证；结构树补 `scripts/` / `LICENSE` / 三份新文档；变更记录补 v1.0.4；参考实现状态补审计说明 | 文档与仓库实际一致 |
| 11 | `axp/CHANGELOG.md` | 追加 `[1.0.4]` 段 | 记录站点侧修复，注明规范语义不变 |

## 2. 刻意没改什么（重要）

| 项 | 原因 |
|---|---|
| `package.json` 的 `dependencies` / `bun.lock` | 21 个依赖从未被引用、Prisma 是模板残留，但**任何依赖变更都必须同步重生成 `bun.lock`**，否则 CI 的 `bun install --frozen-lockfile` 会失败。本环境无 Bun，贸然删除等于把仓库弄红。见 `ROADMAP-ALL-TASKS.md` 的 G05–G08。 |
| `typescript.ignoreBuildErrors: true` → `false` | 在没跑过一次真实 `tsc` / `next build` 前改它，可能直接让构建失败。正确顺序：先 build → 修类型错误 → 再置 `false`（任务 E07）。 |
| `eslint.config.mjs` 的规则开关 | 同上，恢复规则前需先修完代码；见任务 E08。 |
| `src/components/ui/` 的 32 个未使用组件 | 删除前需确认 `components.json` / `globals.css` / 动态引用，属于独立清理批次（G06）。 |
| `library-section.tsx` 的 hooks 依赖 | `fetchDoc` 依赖整个 `content` 对象导致无效重建，但涉及 React 运行时行为，未实测不引入改动（D16）。 |
| `axp/` 内的一切 | 全仓最健康的部分，与 v1.0.2 基准逐文件比对仅 2 处有意的 v1.0.3 改动，保持不动。 |

## 3. 未验证项（必须知道）

**本轮没有跑成一次真实的 `next build`。** 本环境不具备 Bun 与完整前端依赖安装条件。因此：

- `web-build` job 是**新增的门禁**，其首次运行结果尚未观测
- `outputFileTracingIncludes` 在 Next.js 16 的顶层配置写法需由首次 build 确认（Next 15.3+ 已从 `experimental` 毕业为顶层配置）
- `layout.tsx` 的 `next/font/google` 在构建时需要访问 `fonts.googleapis.com`；离线环境可能失败（任务 D19）

在有 Bun / 联网的机器上执行以下命令，即可把未知数清零：

```bash
bun install --frozen-lockfile
bun run build
node scripts/site-check.mjs
```

## 4. 怎么应用

本 zip 解压后**已经是修复后的完整仓库**，直接提交即可：

```bash
cd <解压目录>
node scripts/site-check.mjs --prebuild       # 零依赖，应先全绿
node axp/validator/test/run-tests.mjs        # 31/31
python3 axp/validator/test/schema-crosscheck.py   # 43/43
node axp/runtime/test/smoke.mjs             # 30/30

git add -A
git commit -m "chore(site): standalone axp data, build gate, audit & task ledger"
git push origin main
```

> 我没有向你的 GitHub 仓库写入任何内容；push 需要在你自己的账号下完成。

## 5. 怎么回滚

按改动编号单独回滚，互不影响：

| 想撤掉 | 做法 |
|---|---|
| 3（build job） | 删除 `.github/workflows/ci.yml` 中 `web-build:` 整个 job；其余两 job 不变 |
| 2（cp axp） | 把 `package.json` 的 `build` 末尾 ` && cp -r axp .next/standalone/` 去掉；`version` 改回 `1.0.3` |
| 1（file tracing） | 删除 `next.config.ts` 的 `outputFileTracingIncludes` 块；`allowedDevOrigins` 按需恢复 |
| 4 / 5 / 7 / 8 / 9 | 直接删除 `scripts/site-check.mjs` / `LICENSE` / `AUDIT.md` / `ROADMAP-ALL-TASKS.md` / `PATCHES.md`；注意 CI 的 `web-build` job 引用了 `site-check.mjs`，需同时撤掉 3 |
| 6（前缀校验） | 把 `src/lib/axp-server.ts` 的 `readDocContent` 判断改回 `if (!abs.startsWith(AXP_ROOT)) return null;` |
| 10 / 11（文档） | `README.md` / `axp/CHANGELOG.md` 按 diff 回退对应段落 |

完整基线可直接从 GitHub 取回：

```bash
git fetch origin 2baeba72ba150d02854527ab7c2f0a6da32560da
git checkout 2baeba72 -- .
```

## 6. 验证本轮改动是否生效

| 检查 | 期望 |
|---|---|
| `node scripts/site-check.mjs --prebuild` | `PREBUILD CHECK PASSED` |
| `grep -n "outputFileTracingIncludes" next.config.ts` | 有输出 |
| `grep -n "cp -r axp" package.json` | 有输出 |
| `grep -n "web-build" .github/workflows/ci.yml` | 有输出 |
| `git diff --stat axp/` | 只有 `axp/CHANGELOG.md` 一处变化 |
| `bun run build && node scripts/site-check.mjs` | `STANDALONE CHECK PASSED`（待 E03 实测） |
