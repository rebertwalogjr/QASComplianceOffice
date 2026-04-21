import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [{
      source: "/",
      destination: "/qas",
      permanent: true,
    }
  ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb"
    }
  },
  output: "standalone",
};

export default nextConfig;
