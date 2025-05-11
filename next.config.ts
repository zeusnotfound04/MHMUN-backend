import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "w05m6ci7vu.ufs.sh",
        pathname: "/**",
      },

    ],
  },
};

export default nextConfig;

