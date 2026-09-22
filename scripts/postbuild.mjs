import fs from "node:fs";
import path from "node:path";

const out = path.join(process.cwd(), "out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/u, "");
if (base) {
  for (const file of walk(out).filter((name) => name.endsWith(".html"))) {
    const original = fs.readFileSync(file, "utf8");
    const rewritten = original.replace(/(href|src)=(['"])(\/(?!\/)[^'"]*)/gu, (match, attribute, quote, url) =>
      url === base || url.startsWith(`${base}/`) ? match : `${attribute}=${quote}${base}${url}`,
    );
    if (rewritten !== original) fs.writeFileSync(file, rewritten);
  }
}
if (!fs.existsSync(path.join(out, ".nojekyll"))) fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log(`Static export ready${base ? ` at base path ${base}` : " at the site root"}.`);

function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => { const full = path.join(dir, entry.name); return entry.isDirectory() ? walk(full) : [full]; }); }
