import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['swagger-ui-react'],
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "img.icons8.com",
      "icpc.global",
      "img.freepik.com",
      "media.licdn.com"
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'swagger-ui-react': require.resolve('swagger-ui-react'),
    };
    return config;
  },
};

export default nextConfig;