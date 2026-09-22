import fs from "node:fs";
import path from "node:path";

const out = path.join(process.cwd(), "out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/u, "");
const missing = new Set();
for (const file of walk(out).filter((name) => name.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gu)) {
    const raw = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#|javascript:)/iu.test(raw)) continue;
    let pathname = raw.split(/[?#]/u, 1)[0];
    if (!pathname) continue;
    try { pathname = decodeURIComponent(pathname); } catch { missing.add(`${path.relative(out,file)} -> invalid URL ${raw}`); continue; }
    if (base && pathname.startsWith(`${base}/`)) pathname = pathname.slice(base.length);
    let target = pathname.startsWith("/") ? path.join(out, pathname.slice(1)) : path.resolve(path.dirname(file), pathname);
    const candidates = [target, path.join(target, "index.html")];
    if (!path.extname(target)) candidates.push(`${target}.html`);
    if (!candidates.some((candidate) => fs.existsSync(candidate))) missing.add(`${path.relative(out,file)} -> ${raw}`);
  }
}
if (missing.size) { console.error([...missing].join("\n")); process.exit(1); }
console.log("Generated internal links and assets resolve.");
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry)=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)])}
