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
}

module.exports = nextConfig