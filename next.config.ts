import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ✅ Allow builds even if there are TypeScript errors
    ignoreBuildErrors: true, 
  },
};

export default nextConfig;
