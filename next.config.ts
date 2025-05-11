import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
       {
        protocol: "https",
        hostname: "mhmun-2025.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "w05m6ci7vu.ufs.sh",
        pathname: "/**",
      },

    ],
  },
};

export default nextConfig;

