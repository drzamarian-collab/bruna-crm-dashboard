/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignorar erros de ESLint durante build de produção
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar erros de TypeScript durante build de produção
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
