# AXP · 一次性全部任务总账

> 状态：Stable
> 适用：`Ultra-Guru/axp` @ `main` · v1.0.5
> 说明：**这一份列全整个项目的所有任务**，包含已完成的、进行中的、还没开始的；不再分批补。状态以 2026-11-15 质量门禁批次（v1.0.5）结束后的实测结果为准。
> 图例：✅ 已完成并验证　🟡 部分完成　⬜ 未开始　⚠️ 有风险 / 待实测　🔒 本轮刻意未动

## 状态速查

| 分组 | ✅ | 🟡 | ⬜ | ⚠️ | 🔒 |
|---|---|---|---|---|---|
| A 规范与格式 | 12 | 0 | 0 | 0 | 0 |
| B 工具链与验证 | 11 | 0 | 0 | 0 | 0 |
| C 文档与教程 | 9 | 0 | 0 | 0 | 0 |
| D 交互式文档站点 | 11 | 3 | 2 | 1 | 0 |
| E CI / 构建 / 部署 | 9 | 0 | 1 | 0 | 0 |
| F 真机与生态 | 2 | 3 | 4 | 1 | 0 |
| G 治理与清理 | 5 | 1 | 4 | 0 | 0 |

**P0 已全部清零（E03 本地 + CI 双实测；E04 首次运行即绿；v1.0.5 补齐 E06–E09 质量门禁，并触发 CI 首跑捕获 Prisma 死代码 → G07 随批完成）。当前最高优先级批次：G05/G06 依赖与组件清理。**

---

## A · 规范与格式（全部完成）

| ID | 任务 | 状态 | 验收标准 | 落点 |
|---|---|---|---|---|
| A01 | 确立「同级独立格式」定位，表达力覆盖移出正文 | ✅ | 正文不借用外部格式字段名 | `axp/spec/01-format.md` §0 / `07-expression-map.md` |
| A02 | 包结构与 `axp.json` 顶层字段表 | ✅ | schema + 文档一致 | `01-format.md` §2–3 |
| A03 | 完整 JSON Schema（draft 2020-12，严格模式） | ✅ | Python `jsonschema` 校验自身元语法通过 | `axp/spec/02-manifest.schema.json` |
| A04 | 统一实现引用 `impl` 七形态 + 选择算法 | ✅ | 规范/校验器/站点表述一致 | `03-impl-reference.md` |
| A05 | L0–L5 权限阶梯 + `requests` 词汇表 + `gradient` | ✅ | 越权用例被 `GRADIENT_EXCEEDS_PRIVILEGE` 捕获 | `04-capabilities.md` |
| A06 | 13 个 `axp://` 标准域 + 自定义域注册 | ✅ | 域表与示例一致 | `05-domains.md` / `examples/04-domains` |
| A07 | UI DSL 节点词汇表 + 绑定 + 生命周期 | ✅ | `panel.json` 可解析 | `06-ui-vocab.md` |
| A08 | `hotReload{}` 全字段 + 状态机 + 每次验签 | ✅ | 6 类热加载负面用例全被捕获 | `08-hot-reload.md` |
| A09 | `allowDynamicCode: false` 边界澄清 | ✅ | 合法热加载不被误杀 | `04-capabilities.md` §5 |
| A10 | 分发改 Android 会话安装 + APK v3 | ✅ | `distribution.channel` 枚举无通用仓库措辞 | `01-format.md` §9 |
| A11 | 版本语义 / 兼容 / 弃用流程 | ✅ | `spec-v1.x.y` 发布物定义 | `09-versioning.md` |
| A12 | M1–M7 路线图与 AXP-0…3 一致性等级 | ✅ | 站点与 README 口径一致（见 D14） | `01-format.md` §11–12 |

## B · 工具链与验证（全部完成且实跑通过）

| ID | 任务 | 状态 | 验收标准 | 落点 |
|---|---|---|---|---|
| B01 | 零依赖离线校验器（schema + 安全规则 + 引用完整性） | ✅ | 无 npm 依赖可跑 | `axp/validator/src/validate.mjs` |
| B02 | 精简 JSON Schema 引擎与标准引擎语义对齐 | ✅ | 43/43 交叉复核 | `axp/validator/test/schema-crosscheck.py` |
| B03 | 31 条行为固化用例（含边界用例） | ✅ | 31/31 | `axp/validator/test/run-tests.mjs` |
| B04 | CLI `new / validate / pack / inspect / install` | ✅ | `pack` 产物含 `axp.json` | `axp/cli/bin/axp.mjs` |
| B05 | Node 参考运行时（AXP-3，9 步装载 / gradient / Surface / UI / 热加载） | ✅ | 30/30 端到端断言 | `axp/runtime/` |
| B06 | Surface 背压时序修复（v1.0.3） | ✅ | 首个真实 delta 不被误吞 | `axp/runtime/src/surfaces.mjs` |
| B07 | dev / strict 双签名策略 | ✅ | strict 拒绝证书不匹配 | `axp/runtime/src/signature.mjs` |
| B08 | TypeScript 类型定义 | ✅ | 与 schema 字段对应 | `axp/sdk/sdk-js/index.d.ts` |
| B09 | 4 个官方示例插件 | ✅ | 4/4 校验全绿 | `axp/examples/01…04` |
| B10 | M3 感知域示例（8 域 / URI 模板 / 多域绑定 / 双触发源） | ✅ | `04-domains` 全绿 | `axp/examples/04-domains` |
| B11 | 错误码表与校验器实现一一对应 | ✅ | 25 个业务码有对应用例 | `axp/validator/README.md` |

## C · 文档与教程（全部完成）

| ID | 任务 | 状态 | 说明 |
|---|---|---|---|
| C01 | 规范正文 9 篇 | ✅ | `axp/spec/01`–`09` |
| C02 | 教程与指南 11 篇 | ✅ | 插件 / UI / 热加载 / 感知域 / 集成 / 运行时 / CLI / 自检表 / FAQ / 模板 / 开仓库 |
| C03 | 宿主集成教程（10 步 Kotlin + 装载流水线 + 热加载接入） | ✅ | `axp/docs/integration-guide.md` |
| C04 | 文档格式模板（教程四节 / 插件 README / spec 变更提案） | ✅ | `axp/docs/doc-templates.md` |
| C05 | 开仓库指南（初始化 / OWNER / CI / tag / Release） | ✅ | `axp/docs/github-setup.md` |
| C06 | 全仓 Markdown 链接审计 | ✅ | 39 文件 / 197 链接 / 0 断链 |
| C07 | 贡献指南 + PR / Issue 模板 | ✅ | `axp/CONTRIBUTING.md` / `axp/.github/` |
| C08 | CHANGELOG v1.0.0 → v1.0.3 | ✅ | 本轮补 v1.0.4 |
| C09 | **审计报告 / 任务总账 / 改动清单** | ✅ | 本轮新增 `AUDIT.md` / 本文件 / `PATCHES.md` |

## D · 交互式文档站点

| ID | 任务 | 状态 | 优先级 | 验收标准 | 落点 |
|---|---|---|---|---|---|
| D01 | Next.js 16 App Router 单页站点骨架 | ✅ | — | `/` 可渲染 | `src/app/` |
| D02 | 服务端数据层直接读 `axp/` 真实文件 | ✅ | — | 站点数据 = 仓库数据 | `src/lib/axp-server.ts` |
| D03 | 16 个内容章节（格式 / Android / 宿主 / 动手） | ✅ | — | 导航与章节 id 对应 | `src/components/axp/sections-*.tsx` |
| D04 | 4 个示例真实 `axp.json` + 文件树 + 一键验证 | ✅ | — | 调用 `/api/validate` 返回全绿 | `examples-section.tsx` |
| D05 | 校验器演练场 + 8 个破坏性预设 | ✅ | — | 每个预设命中对应错误码 | `playground-section.tsx` |
| D06 | 文档库全文渲染 / 搜索 / 相对链接互通 | ✅ | — | `/api/doc` 白名单返回原文 | `library-section.tsx` / `markdown.tsx` |
| D07 | `/api/doc` 白名单 + 路径前缀校验 | ✅ | — | 任意路径返回 404 | `src/app/api/doc/route.ts` |
| D08 | `/api/validate` 临时目录 + 占位文件 + 超时 + 清理 | ✅ | — | 不执行实现体、无残留 | `src/app/api/validate/route.ts` |
| D09 | 暗色主题 / 响应式 / 代码高亮 / 元数据与 SEO | ✅ | — | `layout.tsx` / `globals.css` | — |
| D10 | 静态 import 图与导出符号闭合 | ✅ | — | 128 本地引用 0 缺失 | 全 `src/` |
| D11 | **standalone 产物自带 `axp/` 数据** | ✅ | P0 | `.next/standalone/axp/spec/01-format.md` 存在 | `next.config.ts` + `package.json` |
| D12 | 构建产物自检脚本 | ✅ | P0 | `node scripts/site-check.mjs` 退出码 0 | `scripts/site-check.mjs` |
| D13 | `readDocContent` 前缀校验加固 | ✅ | P1 | 用 `path.sep` 判断 | `src/lib/axp-server.ts` |
| D14 | 路线图口径统一（M2 的 Node ✅ / Android ⚠️） | 🟡 | P1 | 站点 `ROADMAP` 与 README 一致 | `src/components/axp/data.ts` |
| D15 | 站点硬统计改为从 `axp/` 自动推导 | 🟡 | P1 | 测试数 / 文档数变化后无需手改 | `axp-server.ts` / `data.ts` |
| D16 | `library-section` 消除 `fetchDoc` 无效重建 | 🟡 | P2 | 用 ref 缓存已加载内容，去掉 `content` 依赖 | `library-section.tsx` |
| D17 | 文档库支持锚点深链（`#library&doc=…` 已起步） | ⬜ | P2 | 刷新后仍定位到同一文档 | `axp-site.tsx` / `library-section.tsx` |
| D18 | 校验器演练场支持「下载校验报告 / 复制命令」 | ⬜ | P3 | 一键导出 JSON 结果 | `playground-section.tsx` |
| D19 | `next/font/google` 改本地或自托管字体 | ⚠️ | P1 | 断网环境 `next build` 仍成功 | `src/app/layout.tsx` |

## E · CI / 构建 / 部署

| ID | 任务 | 状态 | 优先级 | 验收标准 | 落点 |
|---|---|---|---|---|---|
| E01 | `axp-selfcheck` job（schema / 4 示例 / 31 / 43 / 30 / pack） | ✅ | — | 当前 CI 已通过 | `.github/workflows/ci.yml` |
| E02 | `docs-links` job（`axp/` 内部断链检查） | ✅ | — | 39 文件 0 断链 | 同上 |
| E03 | **一次真实 `bun run build` 实测** | ✅ | **P0** | v1.0.4 本地实测成功；CI `web-build` 首次运行即绿（run #3） | 本地 / CI |
| E04 | `web-build` job（build + 产物自检） | ✅ | P0 | v1.0.4 新增，随 E03 一起验证 | `.github/workflows/ci.yml` |
| E05 | `web-lint` job | ✅ | — | `bun install --frozen-lockfile` + lint 通过 | 同上 |
| E06 | `docs-links` 扩展到全仓（含顶层 README / AUDIT / 任务总账） | ✅ | P1 | 42 个 md / 203 本地链接 / 0 断链（含根目录 4 份） | 同上 |
| E07 | `typescript.ignoreBuildErrors` 置 `false` | ✅ | P1 | v1.0.5：tsc 零错误后开启；**CI 首跑即捕获本地被掩蔽的 Prisma 类型错误（门禁有效性实证），随 G07 修复后全套复验通过** | `next.config.ts` |
| E08 | ESLint 至少恢复 `no-undef` / `no-unused-vars` / `react-hooks/exhaustive-deps` | ✅ | P2 | v1.0.5：三类规则 error 级生效，lint 零违规；`axp/` 移出站点 lint 范围 | `eslint.config.mjs` |
| E09 | `reactStrictMode` 置 `true` | ✅ | P2 | v1.0.5：StrictMode 双调用实测无 hydration 报错 | `next.config.ts` |
| E10 | 部署文档（Vercel / standalone 容器 / 环境变量 / 缓存） | ⬜ | P1 | 按文档可复现一次部署 | 新增 `docs/deployment.md` |

## F · 真机与生态（路线图 M3 / M4 / M6 / M7）

| ID | 任务 | 状态 | 优先级 | 验收标准 | 落点 |
|---|---|---|---|---|---|
| F01 | M2 `runtime/` 参考宿主跑通 | ✅ | — | 30/30 | `axp/runtime/` |
| F02 | M2.5 热加载状态机 / 回滚 / 每次验签 | ✅ | — | 断言全绿 | `axp/runtime/src/hotreload.mjs` |
| F03 | M3 感知域规范 + 示例 + 教程 | ✅ | — | `04-domains` 全绿 | `axp/spec/05` / `examples/04` |
| F04 | **M3 真机 `HostBridge.surface()` 13 域适配器** | 🟡 | P1 | 真机上屏幕树 / 通知 / 传感器 / 剪贴板 / 网络能刷新面板 | `reference-host/android/` |
| F05 | M4 Shizuku L3 通道 + 审计 UI | 🟡 | P1 | 同一 tool 在 L2/L3 自动切实现 | `reference-host/android/` |
| F06 | `reference-host/android/` 在 Android Studio 编译 + 单元测试 | ⚠️ | P1 | `:host:testDebugUnitTest` 通过 | 同上 |
| F07 | M6 真实 APK v3 证书链 / `strict` 签名 / 会话安装 | ⬜ | P1 | 换证书的热替换被拒 | `axp/runtime/src/signature.mjs` + 宿主 |
| F08 | 示例插件 `publisher` 换成真实指纹 | ⬜ | P2 | 无 64 个 `0` 的占位值 | `axp/examples/*/axp.json` |
| F09 | T2–T7 实现体在真机执行（dex / so / wasm / bin / proc / url） | ⬜ | P2 | 至少 T2 dex + T5 bin 跑通 | 宿主 |
| F10 | M7 宿主合规认证 + 第三方示例库 | ⬜ | P3 | ≥2 个第三方宿主达 AXP-2 | 生态 |

## G · 治理与清理

| ID | 任务 | 状态 | 优先级 | 验收标准 | 落点 |
|---|---|---|---|---|---|
| G01 | 顶层 `LICENSE`（MIT） | ✅ | P1 | GitHub 识别许可证 | `LICENSE` |
| G02 | 移除 `allowedDevOrigins` 生成环境残留 | ✅ | P2 | 配置中无第三方域名 | `next.config.ts` |
| G03 | 完整审计报告 + 任务总账 + 改动清单 | ✅ | — | 三份文档互相链接可达 | `AUDIT.md` / 本文件 / `PATCHES.md` |
| G04 | `bun.lock` workspace name 改为 `axp` | ✅ | P2 | v1.0.5 随 Prisma 移除重生成 lock 时同步修正 | `bun.lock` |
| G05 | **清理剩余未使用依赖并重生成 `bun.lock`**（原 21 个，Prisma 2 个已随 G07 移除，余 19 个） | ⬜ | P1 | 删除后 `bun install --frozen-lockfile` 仍通过 | `package.json` + `bun.lock` |
| G06 | 删除 32 个未使用 shadcn 组件 | ⬜ | P2 | 站点渲染不变、lint 通过 | `src/components/ui/` |
| G07 | 删除 Prisma 模板（`schema.prisma` + `src/lib/db.ts` + db 脚本） | ✅ | P1 | v1.0.5：E07 开启类型检查后 CI 首跑即暴露干净环境下构建失败，随批整删 | `prisma/` / `src/lib/db.ts` / `package.json` |
| G08 | 依赖清理后重新生成并复核 lockfile | 🟡 | P1 | Prisma 批次已重生成并通过 frozen 校验（v1.0.5）；G05 清理后需再次重生成 | `bun.lock` |
| G09 | `axp/` 作为独立仓库拆出的可复现流程 | ⬜ | P3 | 按 `github-setup.md` 拆出后自检全绿 | `axp/docs/github-setup.md` |
| G10 | 发 `spec-v1.0.0` tag 与 Release 产物 | ⬜ | P2 | `axp-spec-<version>.zip` 可下载 | GitHub Releases |

> 🔒 图例的历史备注（v1.0.4 审计时成立）：当时构建机无 Bun，改 `package.json` 依赖无法同步重生成 `bun.lock`，贸然修改会让 CI 的 `--frozen-lockfile` 变红。**v1.0.5 起该约束解除（Bun 可用），G05–G08 已解锁，仍须作为一批完成：删依赖 → 重生成 lock → 本地全套自检 → CI 绿。**

---

## 建议执行顺序（一次排完，不用再问）

1. ~~**E03 / E04**：在有 Bun 的机器跑 `bun install --frozen-lockfile && bun run build && node scripts/site-check.mjs`，把构建日志贴回来；若首次失败，按日志修类型/字体，再动 `ignoreBuildErrors`~~ ✅ v1.0.4 完成
2. ~~**E06 / E07 / E08 / E09**：把质量门禁补齐，让 lint 与 build 真正能挡问题~~ ✅ v1.0.5 完成
3. **G05 / G06 → G08**：一批清理模板残留（余 19 个未用依赖 + 32 个未用组件），`bun install` 重生成 lock，确认 CI 仍绿（Prisma 批次已验证过该流程）
4. **D14 / D15 / D16**：消除站点硬编码与无效渲染，让数据从 `axp/` 自动推导
5. **F04 / F05 / F06**：真机适配器与 Android 骨架编译，这是从「格式规范」走向「能用的 Android 生态」的关键一跳
6. **F07 / F08 / E10 / G10**：签名信任链、部署文档、Release 产物，然后对外发布

对应路线图：M1 ✅ → M2 ✅ / ⚠️ → M2.5 ✅ → M3 🟡 → M4 🟡 → M5 ✅ → M6 ⬜ → M7 ⬜。
