/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for deployment to static hosting platforms like Render
  output: "export",
  
  images: {
    // Static export doesn't support Image Optimization, use unoptimized images
    unoptimized: true,
  },
  
  // Note: rewrites() don't work with static export
  // API calls should use NEXT_PUBLIC_API_URL environment variable directly
};
module.exports = nextConfig;
