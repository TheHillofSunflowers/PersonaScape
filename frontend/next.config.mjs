/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: 'https://personascape.onrender.com',
    NEXT_PUBLIC_API_BASE_URL: 'https://personascape.onrender.com',
    NEXT_PUBLIC_IMGBB_API_KEY: '7a4b641ad0ba4e587da1e436917e746a',
    NEXT_PUBLIC_JWT_COOKIE_NAME: 'personascape_token'
  },
  images: {
    domains: ['i.ibb.co', 'image.ibb.co', 'personascape.onrender.com']
  },
  // Disable TypeScript checking
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig; 