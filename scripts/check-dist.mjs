/**
 * Post-build gate on dist/:
 * - no dev fixture may ever reach a build (marker: "FIXTURE");
 * - while unlaunched, every page carries noindex and robots.txt disallows all;
 * - once launched, no visible TODO marker may remain.
 * Exits non-zero on any failure, so the deploy never happens.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const config = readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");
const launchedMatch = config.match(/export const LAUNCHED\s*=\s*(true|false)/);
if (!launchedMatch) throw new Error("LAUNCHED flag not found in src/config/site.ts");
const LAUNCHED = launchedMatch[1] === "true";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(DIST);
const textFiles = files.filter((f) => /\.(html|js|css|txt|xml|json|svg)$/.test(f));
const pages = files.filter((f) => f.endsWith(".html"));
const problems = [];

for (const file of textFiles) {
  if (readFileSync(file, "utf8").includes("FIXTURE")) problems.push(`fixture content in ${file}`);
}

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  if (!LAUNCHED && !/<meta name="robots" content="noindex/.test(html)) problems.push(`missing noindex in ${page}`);
  if (LAUNCHED && html.includes('class="todo"')) problems.push(`TODO marker left in launched page ${page}`);
}

const robots = readFileSync(join(DIST, "robots.txt"), "utf8");
if (!LAUNCHED && !/Disallow:\s*\/\s*$/m.test(robots)) problems.push("robots.txt does not disallow crawling");

console.log(`checked ${pages.length} pages, ${textFiles.length} text files (LAUNCHED=${LAUNCHED})`);
if (problems.length > 0) {
  for (const p of problems) console.error(`  FAIL ${p}`);
  process.exit(1);
}
console.log("dist check passed.");
