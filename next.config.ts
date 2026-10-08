import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // La VSL vit désormais sur /audit.
  async redirects() {
    return [{ source: "/video", destination: "/audit", permanent: true }];
  },
};

export default nextConfig;
