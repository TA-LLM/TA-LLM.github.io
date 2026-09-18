/**
 * Contrast gate for the design tokens (synthesis §6.7).
 *
 * Parses src/styles/tokens.css, resolves each semantic role in both themes and
 * checks every declared foreground/background pair against WCAG 2.2:
 *   text ≥ 4.5:1 · non-text (focus, state indicators, graphics, outlines) ≥ 3:1
 *   hairlines ≥ 1.5:1 (decorative, but must stay visible — synthesis §2).
 * Exits non-zero on any failure, so the build fails.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

/** Collects `--name: value;` declarations from the first block matching `selector`. */
function declarations(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`selector not found: ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  let end = open;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    if (css[i] === "}") depth -= 1;
    if (depth === 0) {
      end = i;
      break;
    }
  }
  const body = css.slice(open + 1, end).replace(/\/\*[\s\S]*?\*\//g, "");
  const map = new Map();
  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) map.set(match[1], match[2].trim());
  return map;
}

const dark = declarations(":root {");
const light = new Map([...dark, ...declarations(':root[data-theme="light"]')]);

function resolve(scope, value, seen = new Set()) {
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  if (!ref) return value;
  if (seen.has(ref[1])) throw new Error(`circular token ${ref[1]}`);
  seen.add(ref[1]);
  const next = scope.get(ref[1]);
  if (next === undefined) throw new Error(`undefined token ${ref[1]}`);
  return resolve(scope, next, seen);
}

function hex(scope, name) {
  const value = resolve(scope, scope.get(name) ?? `var(${name})`);
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`${name} is not a plain hex colour: ${value}`);
  return value;
}

function luminance(h) {
  const channels = [1, 3, 5].map((i) => Number.parseInt(h.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT = 4.5;
const NON_TEXT = 3;
const HAIRLINE = 1.5;

/** [foreground, background, minimum, what] — checked in both themes. */
const pairs = [
  ["--text", "--surface", TEXT, "body text"],
  ["--text", "--surface-raised", TEXT, "text on raised panels"],
  ["--text-muted", "--surface", TEXT, "muted text"],
  ["--text-muted", "--surface-raised", TEXT, "muted text on raised panels"],
  ["--accent-text", "--surface", TEXT, "accent as text"],
  ["--on-accent", "--accent", TEXT, "text on the accent fill"],
  ["--theme-rlaif-ink", "--surface", TEXT, "theme 01 as text"],
  ["--theme-cl-ink", "--surface", TEXT, "theme 02 as text"],
  ["--theme-topology-ink", "--surface", TEXT, "theme 03 as text"],
  ["--theme-agentic-ink", "--surface", TEXT, "theme 04 as text"],
  ["--focus", "--surface", NON_TEXT, "focus ring"],
  ["--thread-fill", "--surface", NON_TEXT, "D10 project thread"],
  ["--thread-fill", "--thread-track", NON_TEXT, "thread fill against its track"],
  ["--rule-strong", "--surface", NON_TEXT, "control outline"],
  ["--rule-strong", "--surface-raised", NON_TEXT, "control outline on raised panels"],
  ["--rule", "--surface", HAIRLINE, "hairline"],
];

let failures = 0;
for (const [themeName, scope] of [["ink", dark], ["light", light]]) {
  console.log(`\n${themeName} theme`);
  for (const [fg, bg, min, what] of pairs) {
    const r = ratio(hex(scope, fg), hex(scope, bg));
    const ok = r >= min;
    if (!ok) failures += 1;
    console.log(`  ${ok ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(5)}:1 ≥ ${min}  ${what} (${fg} on ${bg})`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} contrast pair(s) below the minimum.`);
  process.exit(1);
}
console.log("\nAll contrast pairs pass.");
