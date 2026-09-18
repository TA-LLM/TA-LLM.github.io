// @ts-check
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // The repository is TA-LLM/TA-LLM.github.io, served from the domain root:
  // no `base` is needed. Switch `site` to https://ta-llm.io with public/CNAME.
  site: "https://ta-llm.github.io",

  // Fonts point at exact WOFF2 files inside pinned npm packages (versions locked
  // by package-lock.json): reproducible offline builds, Latin subset only, and
  // every file served from our own origin. Astro generates metric-matched
  // fallbacks by default. Display and text faces arrive in Phase 2 (D6 test).
  fonts: [
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      fallbacks: ["ui-monospace", "monospace"],
      options: {
        variants: [
          {
            weight: "100 800",
            style: "normal",
            src: ["@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2"],
          },
        ],
      },
    },
  ],

  devToolbar: { enabled: false },
});
