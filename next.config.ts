import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: false },
      { source: "/about.html", destination: "/about", permanent: false },
      { source: "/services.html", destination: "/services", permanent: false },
      { source: "/contact.html", destination: "/contact", permanent: false },
      { source: "/testimonials.html", destination: "/testimonials", permanent: false },
      { source: "/truepeakinsights.html", destination: "/truepeakinsights", permanent: false },
      { source: "/caculators.html", destination: "/caculators", permanent: false },
      { source: "/Library/:slug.html", destination: "/Library/:slug", permanent: false },
    ];
  },
};

export default nextConfig;
