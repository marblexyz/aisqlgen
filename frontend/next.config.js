/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable https://www.npmjs.com/package/@dqbd/tiktoken
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

module.exports = nextConfig;
