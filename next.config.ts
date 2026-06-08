import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },

  turbopack: {
    root: "C:/Users/305873/Desktop/New folder/my-portfolio",
  },
};

export default nextConfig;