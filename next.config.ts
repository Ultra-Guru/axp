import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  /**
   * 站点在运行时通过 path.join(process.cwd(), "axp") 读取规范项目，
   * Next.js 的 output file tracing 无法静态追踪这条拼接出来的路径。
   * 把 axp/ 全量纳入追踪，保证 standalone 部署根自带数据；
   * package.json 的 build 脚本另有 cp -r axp .next/standalone/ 作为双保险。
   * 验证：bun run build && node scripts/site-check.mjs
   */
  outputFileTracingIncludes: {
    "/**": ["./axp/**/*"],
  },

  typescript: {
    // E07 已完成：tsc --noEmit 零错误后开启构建期类型检查
    ignoreBuildErrors: false,
  },
  // E09：严格模式双调用渲染，暴露不纯组件；当前代码库无 hydration 报错
  reactStrictMode: true,
};

export default nextConfig;
