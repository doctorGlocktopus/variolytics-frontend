/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => [
    {
      source: '/api/tasks/:path*/',
      destination: 'http://localhost:3000/tasks/:path*'
    },
    {
      source: '/api/users/:path*',
      destination: 'http://localhost:3000/users/:path*'
    }
  ]
}

module.exports = nextConfig
