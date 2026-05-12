import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OpenNext bundles MDX content read via fs at build time;
  // route handlers (feedback, telegram-init, search-index) run on the Worker.
};

export default nextConfig;

// Enable Cloudflare bindings (env.ASSETS, Workers AI, R2…) during `next dev`.
// No-op during production build.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
