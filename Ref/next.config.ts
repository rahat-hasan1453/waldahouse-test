import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (Blocks Release).
  output: "standalone",
};

export default nextConfig;
