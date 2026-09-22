import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignored = new Set(["node_modules", ".next", "out", ".git", "public"]);
const files = walk(root).filter((file) => /\.(?:ts|tsx|js|mjs|mdx|json)$/u.test(file) && !file.endsWith("audit-static-boundary.mjs"));
const forbidden = [
  ["authentication runtime", /next-auth|\bauth\s*\(|\bcookies\s*\(/iu],
  ["server request runtime", /\bNextRequest\b|\bNextResponse\b|use server/iu],
  ["API or excluded route", /["'`](?:\/api\/|\/portal(?:\/|["'`])|\/pricing(?:\/|["'`])|\/trial(?:\/|["'`])|\/contact(?:\/|["'`])|\/products(?:\/|["'`])|\/services(?:\/|["'`])|\/solutions(?:\/|["'`]))/iu],
  ["server service", /meilisearch|resend|cloudflare|opennext/iu],
];
const failures=[];
for(const file of files){const text=fs.readFileSync(file,"utf8");for(const [label,pattern] of forbidden){if(pattern.test(text))failures.push(`${path.relative(root,file)}: ${label}`)}}
if(failures.length){console.error(failures.join("\n"));process.exit(1)}
console.log(`Static boundary audit passed (${files.length} source files).`);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry)=>ignored.has(entry.name)?[]:entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)])}
