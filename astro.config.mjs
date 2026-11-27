import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static output in dist/. scripts/build.mjs then adds what comes from an
// EUDIPLO checkout (installer, schemas, security.txt).
export default defineConfig({
  site: "https://eudiplo.dev",
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: "night-owl" },
  },
});
