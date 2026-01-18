import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force the project root to avoid multi-lockfile warning
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "d1iczxrky3cnb2.cloudfront.net", // subsplash CDN
      },
    ],
  },
  // Memory optimizations for development
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['lucide-react'],
  },
  // Reduce memory usage in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
