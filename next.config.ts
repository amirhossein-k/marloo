import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  env: {
    LIARA_ENDPOINT: process.env.LIARA_ENDPOINT,
    LIARA_ACCESS_KEY_ID: process.env.LIARA_ACCESS_KEY_ID,
    LIARA_SECRET_KEY: process.env.LIARA_SECRET_KEY,
    LIARA_BUCKET_NAME: process.env.LIARA_BUCKET_NAME,
  },
  images: {
    domains: ['c589564.parspack.net', 'c961427.parspack.net', 'uploade.storage.iran.liara.space'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'c589564.parspack.net',
      },
      {
        protocol: "https",
        hostname: "c589564.parspack.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'http',
        hostname: 'c961427.parspack.net',
      },
      {
        protocol: "https",
        hostname: "c961427.parspack.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'dkstatics-public.digikala.com',
        port: '',
        pathname: '/**',
      },
    ]
  },


  /* config options here */
};

export default nextConfig;
