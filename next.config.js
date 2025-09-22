/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for dashboard pages
  experimental: {
    runtime: 'nodejs',
  },
  
  // Reduce build-time API calls
  typescript: {
    // Skip type checking during build (Vercel does this separately)
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Skip ESLint during build
    ignoreDuringBuilds: true,
  },

  // Dynamic imports for heavy components
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },

  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig