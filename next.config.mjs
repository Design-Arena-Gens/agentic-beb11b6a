/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["firebase"],
  swcMinify: false,
  experimental: {
    esmExternals: false
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;
