import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Optimize for Docker
  typescript: {
    // Ignore TypeScript errors during build (optional, remove if you want strict checking)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ignore ESLint errors during build (optional)
    ignoreDuringBuilds: false,
  },
  // Image optimization for Docker
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
