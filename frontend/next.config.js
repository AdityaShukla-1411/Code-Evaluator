/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for deployment to static hosting platforms like Render
  output: "export",
  
  images: {
    // Static export doesn't support Image Optimization, use unoptimized images
    unoptimized: true,
  },
  
  // Note: rewrites() don't work with static export
  // API calls use NEXT_PUBLIC_API_URL environment variable directly (see src/services/api.ts)
  // The axios baseURL is configured as: process.env.NEXT_PUBLIC_API_URL || "/api"
};
module.exports = nextConfig;
