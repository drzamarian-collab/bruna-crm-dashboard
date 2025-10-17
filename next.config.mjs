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
  // Configuração para evitar erro de manifest
  experimental: {
    serverComponentsExternalPackages: [],
    // Workaround para bug de manifest com route groups
    outputFileTracingRoot: undefined,
  },
};

export default nextConfig;
