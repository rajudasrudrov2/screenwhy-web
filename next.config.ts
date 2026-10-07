import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
