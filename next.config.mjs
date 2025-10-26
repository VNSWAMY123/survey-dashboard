/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export static HTML for Firebase Hosting
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
