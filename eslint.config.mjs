import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 质量门禁（E08）：恢复能挡真实问题的规则。
 * - `@typescript-eslint/no-unused-vars`：TS/TSX 全仓生效（axp/ 除外，见 ignores）
 * - `no-undef` / 基础 `no-unused-vars`：仅 JS/MJS（TS 文件的未定义引用由 tsc --noEmit 把关，
 *   基础规则在 TS 文件上存在已知误报，交给 typescript-eslint 关闭）
 * - `react-hooks/exhaustive-deps`：error，依赖缺失必须在提交前显式处理
 *
 * 手工声明 Node 全局（console / process 等），避免为 `globals` 包新增依赖、
 * 触发 bun.lock 重生成（依赖清理统一在 G05–G08 批次处理）。
 */
const manualNodeGlobals = {
  console: "readonly",
  process: "readonly",
  Buffer: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  TextEncoder: "readonly",
  TextDecoder: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  setImmediate: "readonly",
  clearImmediate: "readonly",
  queueMicrotask: "readonly",
  structuredClone: "readonly",
  fetch: "readonly",
  AbortController: "readonly",
};

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-unused-disable-directive": "off",

    // React rules
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/purity": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "off",

    // Next.js rules
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",

    // General JavaScript rules
    "prefer-const": "off",
    "no-console": "off",
    "no-debugger": "off",
    "no-empty": "off",
    "no-irregular-whitespace": "off",
    "no-case-declarations": "off",
    "no-fallthrough": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-redeclare": "off",
    "no-unreachable": "off",
    "no-useless-escape": "off",
  },
}, {
  // JS / MJS：基础规则 + Node 全局（见顶部注释）
  files: ["**/*.{js,mjs,cjs}"],
  languageOptions: {
    globals: manualNodeGlobals,
  },
  rules: {
    "no-undef": "error",
    "no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],
  },
}, {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // axp/ 是自带 31/43/30 测试门禁的独立规范项目，保持字节级稳定，不进站点 lint 范围
    "axp/**",
    // 以下为本沙盒环境目录（不在仓库内，CI 不存在；本地忽略避免污染 lint 结果）
    "examples/**",
    "skills/**",
    "upload/**",
    "mini-services/**",
    "db/**",
  ],
}];

export default eslintConfig;
