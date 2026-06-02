/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 部署时 SQLite 需要禁用 serverless 优化
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

module.exports = nextConfig;
