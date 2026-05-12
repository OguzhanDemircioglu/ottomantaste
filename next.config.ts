import type { NextConfig } from "next";

const ONE_YEAR_IMMUTABLE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  // Cut a few KB off the client bundle by letting Next.js per-import-prune
  // lucide-react. Without this every imported icon drags in the whole module
  // tree on dev builds.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  /**
   * Cache-Control headers for static surfaces.
   *
   * Cloudflare's edge will respect these on the response from the Worker,
   * so subsequent hits skip the Worker entirely. Everything served here is
   * either content-hashed (Next.js chunks) or content-stable across deploys
   * (recipe hero photos, icon, generated search index), so `immutable` is
   * safe — a real change ships under a new URL or after a fresh deploy.
   */
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: ONE_YEAR_IMMUTABLE }],
      },
      {
        source: "/recipes/:path*",
        headers: [{ key: "Cache-Control", value: ONE_YEAR_IMMUTABLE }],
      },
      {
        source: "/icon.png",
        headers: [{ key: "Cache-Control", value: ONE_YEAR_IMMUTABLE }],
      },
      {
        source: "/search-index.json",
        headers: [{ key: "Cache-Control", value: ONE_YEAR_IMMUTABLE }],
      },
      {
        // Static svg assets shipped from /public — never change between
        // deploys but their URL isn't hashed, so cap at 1 day to recover
        // quickly if we ever swap them.
        source: "/:file(.*\\.svg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
};

export default nextConfig;

// Enable Cloudflare bindings (env.ASSETS, Workers AI, R2…) during `next dev`.
// No-op during production build.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
