import type { NextConfig } from 'next';

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000');

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [
      {
        hostname: apiUrl.hostname,
        pathname: '/**',
        port: apiUrl.port,
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
