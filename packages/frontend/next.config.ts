import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactStrictMode: true,
  async rewrites() {
    return [];
  },
};

export default nextConfig;
