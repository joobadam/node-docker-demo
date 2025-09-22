import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // Silence workspace root warning by pinning the root.
      root: path.resolve(__dirname),
    },
  },
};

export default nextConfig;
