import type { NextConfig } from "next";

// Le dashboard est une app à part, rangée dans le repo du site : on fixe sa racine
// pour que Next ne remonte pas jusqu'au site (qui a son propre package-lock.json).
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
