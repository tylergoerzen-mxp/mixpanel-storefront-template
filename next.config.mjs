import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the file-tracing root to this project so a lockfile in a parent
  // directory doesn't confuse Next's monorepo inference on build/deploy.
  outputFileTracingRoot: __dirname,
  // The storefront ships with a local product catalog so it runs with zero
  // configuration. Remote product images (when sourced from Supabase) are
  // allowed here; the bundled catalog uses inline SVG placeholders.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
