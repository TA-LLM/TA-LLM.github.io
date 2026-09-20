// @ts-check
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // The repository is TA-LLM/TA-LLM.github.io, served from the domain root:
  // no `base` is needed. Switch `site` to https://ta-llm.io with public/CNAME.
  site: "https://ta-llm.github.io",

  // Fonts point at exact WOFF2 files inside pinned npm packages (versions locked
  // by package-lock.json): reproducible offline builds, Latin subset only, and
  // every file served from our own origin. Astro generates metric-matched
  // fallbacks by default.
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
    // Text sans (decided 2026-09-20 from the five OFL candidates): IBM Plex
    // Sans. It sits between the serif and the mono without stonewalling
    // either, its x-height (0.74 of the cap) keeps 14px notes legible, and
    // its lowercase `l` carries a tail — the only candidate where l, I and 1
    // stay apart, which matters on a site full of codes (FIS-01152, CUP,
    // dates). Weights 400 and 500 only: the medium is for emphasis inside
    // running text, nothing else.
    {
      provider: fontProviders.local(),
      name: "IBM Plex Sans",
      cssVariable: "--font-ibm-plex-sans",
      fallbacks: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      options: {
        variants: [
          {
            weight: "400 500",
            style: "normal",
            src: ["@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2"],
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
