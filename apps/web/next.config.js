/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@trutalk/shared'],
  images: {
    domains: ['supabase.co'],
  },
};

module.exports = nextConfig;
