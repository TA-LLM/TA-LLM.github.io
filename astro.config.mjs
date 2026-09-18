// @ts-check
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // The repository is TA-LLM/TA-LLM.github.io, served from the domain root:
  // no `base` is needed. Switch `site` to https://ta-llm.io with public/CNAME.
  site: "https://ta-llm.github.io",

  // Fonts point at exact WOFF2 files inside pinned npm packages (versions locked
  // by package-lock.json): reproducible offline builds, Latin subset only, and
  // every file served from our own origin. Astro generates metric-matched
  // fallbacks by default. The text sans is still open (Phase 2 16px test).
  fonts: [
    // Display (D6): Gelasio, an OFL face metric-compatible with Georgia in its
    // Regular weight, so it breaks lines exactly as Georgia does; Georgia is
    // therefore the fallback, unadjusted: a size-adjusted Times New Roman (the
    // default optimized fallback) would only exist where Georgia exists too,
    // and would match less well. Used at 400 only, in both themes.
    {
      provider: fontProviders.local(),
      name: "Gelasio",
      cssVariable: "--font-gelasio",
      fallbacks: ["Georgia", "serif"],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            weight: "400 700",
            style: "normal",
            src: ["@fontsource-variable/gelasio/files/gelasio-latin-wght-normal.woff2"],
          },
        ],
      },
    },
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
