/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable https://www.npmjs.com/package/@dqbd/tiktoken
  asyncWebAssembly: true,
  layers: true,
};

module.exports = nextConfig;
