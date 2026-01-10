import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
