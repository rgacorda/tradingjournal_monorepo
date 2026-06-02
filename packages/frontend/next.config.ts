import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  reactStrictMode: true,
  async rewrites() {
    return [];
  },
};

export default nextConfig;
