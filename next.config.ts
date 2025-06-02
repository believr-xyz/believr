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
        hostname: "gateway.ipfscdn.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**cdn.lens.xyz",
        pathname: "**",
      },
      // Additional IPFS and Arweave gateways
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "gateway.ipfs.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ipfs.nftstorage.link",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
        pathname: "**",
      },
      // Lens Protocol specific domains
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**lens.xyz",
        pathname: "**",
      },
      // Allow any domain for development
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
