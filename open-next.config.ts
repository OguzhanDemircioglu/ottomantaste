import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext config for Cloudflare Workers.
 * Defaults: in-memory cache, no R2/KV bindings.
 * If we add ISR later, attach an incremental cache here.
 */
export default defineCloudflareConfig({});
