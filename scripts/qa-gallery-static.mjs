/** Structural checks only. Browser rendering/actions require the separate QA plan. */
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFile(path.join(root, file), "utf8");
const catalog = await read("src/data/catalog.ts");
const registry = await read("src/mocks/registry.ts");
const slugs = [...catalog.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const registered = [...registry.matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1]);
assert.equal(slugs.length, 22, "Catalog must contain all 22 mocks");
assert.equal(new Set(slugs).size, slugs.length, "Catalog slugs must be unique");
assert.deepEqual([...registered].sort(), [...slugs].sort(), "Registry must exactly match catalog");

const app = await read("src/App.tsx");
assert.match(app, /path="\/"/, "Portal route must exist");
assert.match(app, /path="\/mocks\/:slug"/, "Detail route must exist");
assert.match(app, /path="\*"/, "Unknown routes need a fallback");
const basename = await read("src/basename.ts");
assert.match(basename, /BASE_URL|mock-gallery/, "Router must account for published base path");

const forbiddenNetwork = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/;
for (const name of await readdir(path.join(root, "src/mocks"))) {
  if (!/\.tsx?$/.test(name)) continue;
  const source = await read(`src/mocks/${name}`);
  assert.doesNotMatch(source, forbiddenNetwork, `Mock ${name} must remain memory-only`);
  assert.doesNotMatch(source, /<form\b[^>]*\baction=/, `Mock ${name} must not submit externally`);
}
const toast = await read("src/components/Toast.tsx");
assert.match(toast, /aria-live="polite"/, "Feedback must be announced politely");
assert.match(toast, /role="status"/, "Toasts must expose status semantics");
const css = await read("src/index.css");
assert.match(css, /:focus-visible/, "Global keyboard focus treatment must exist");
const galleryCss = await read("src/gallery.css");
const phoneRules = [...galleryCss.matchAll(/@media\s*\(max-width:\s*640px\)\s*\{([\s\S]*?)\n\}/g)].map(match => match[1]).join("\n");
assert.match(phoneRules, /\.doc-digital-sheet\s+\.paper-table\s+\.input\s*\{\s*font-size:\s*16px\s*;/,
  "Phone digital-paper inputs must match domain-selector specificity and remain 16px");
const main = await read("src/main.tsx");
assert(main.indexOf('import "./index.css"') < main.indexOf('import App from "./App.tsx"') &&
  main.indexOf('import "./gallery.css"') > main.indexOf('import App from "./App.tsx"'),
  "Style dependency order must be base, App/domain, then gallery overrides");
console.log("PASS: phone digital-paper 16px input override source regression (not computed CSS)");
console.log(`PASS: portal + ${slugs.length} unique registered mock routes`);
console.log("PASS: mock source has no direct network APIs or external form actions");
console.log("PASS: base-path, live-status, and keyboard-focus structural checks");
console.log("NOT RUN: responsive layout, rendered labels, keyboard interaction, actions, and browser console checks");
