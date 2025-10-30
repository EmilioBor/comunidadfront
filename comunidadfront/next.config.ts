import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // o el tamaño que necesites
    },
  },
};

export default nextConfig;
