# v1.0.4 · 本轮改动清单与回滚方法

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
