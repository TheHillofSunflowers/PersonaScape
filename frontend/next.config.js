/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: 'https://personascape.onrender.com',
    NEXT_PUBLIC_IMGBB_API_KEY: '7a4b641ad0ba4e587da1e436917e746a',
    NEXT_PUBLIC_JWT_COOKIE_NAME: 'personascape_token'
  },
  async rewrites() {
    return [
      // We're not using rewrites anymore as they can interfere with direct API calls
      // Instead, we'll use direct connections to the backend
    ];
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  },
  images: {
    domains: ['i.ibb.co', 'image.ibb.co']
  }
};

module.exports = nextConfig; 