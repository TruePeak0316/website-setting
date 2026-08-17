import type { NextConfig } from "next";
import { loadPublishedContent } from "./lib/cms/load-published-content";

loadPublishedContent();

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
