/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every picture here is a fixed painted plate shipped with the site, and the
  // component asks for them unoptimized, so Next's image pipeline has nothing
  // to do. Saying so keeps Vercel from billing optimisations it never runs.
  images: { unoptimized: true },
};

export default nextConfig;
