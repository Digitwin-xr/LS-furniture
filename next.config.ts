import type { NextConfig } from "next";

const nextConfig: any = {
  /* Static export for Firebase Hosting */
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
