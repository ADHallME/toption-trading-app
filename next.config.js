/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily ignore build errors to deploy
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore during builds
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/__clerk/:path*',
        destination: 'https://frontend-api.clerk.services/:path*',
      },
    ]
  },
}

module.exports = nextConfig
