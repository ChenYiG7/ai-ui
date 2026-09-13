import type { NextConfig } from 'next';

// 全静态导出到 out/,可部署到任意静态托管
const nextConfig: NextConfig = {
  output: 'export',
};

export default nextConfig;
