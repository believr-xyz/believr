import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "assets.lenster.xyz",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "metamask.github.io",
        pathname: "**",
      },
      // Lens and IPFS gateways
      {
        protocol: "https",
        hostname: "lens.infura-ipfs.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ipfs.infura.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "gateway.ipfscdn.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**cdn.lens.xyz",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
