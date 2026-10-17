import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Private owner-demo preview: never cache, index, or leak its URL as referrer.
  async headers() {
    return [{
      source: "/__ui/screenwhy3/:path*",
      headers: [
        { key: "Cache-Control", value: "private, no-store, max-age=0" },
        { key: "X-Robots-Tag", value: "noindex, nofollow, noimageindex, noarchive" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ],
    }];
  },
  trailingSlash: true,
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
