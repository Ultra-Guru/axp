import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  /**
   * 本地开发预览跨源放行（可选，不入库）：
   * 在 .env（已被 .gitignore 忽略）里定义 AXP_DEV_ORIGIN=https://<预览域名> ，
   * 即可放行该域名对 /_next/* 静态资源的跨源请求；不定义则无任何额外放行。
   */
  ...(process.env.AXP_DEV_ORIGIN ? { allowedDevOrigins: [process.env.AXP_DEV_ORIGIN] } : {}),

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
