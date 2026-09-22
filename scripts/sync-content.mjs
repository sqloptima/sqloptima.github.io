import fs from "node:fs";
import path from "node:path";

const sourceRoot = process.env.SQLOPTIMA_SOURCE ? path.resolve(process.env.SQLOPTIMA_SOURCE) : path.resolve(process.cwd(), "..", "sql_optima", "apps", "web");
const check = process.argv.includes("--check");
const excludedBlog = new Set(["dual-engine-ha-lab.mdx", "sqloptima-software-portfolio.mdx", "why-interactive-demos-matter.mdx", "why-no-signup-demo.mdx", "in-memory-oltp-sql-server-2025.mdx"]);
const mappings = [
  ...fs.readdirSync(path.join(sourceRoot,"content","blog")).filter((f)=>f.endsWith(".mdx")&&!excludedBlog.has(f)).map((f)=>[`content/blog/${f}`,`content/blog/${f}`]),
  ...fs.readdirSync(path.join(sourceRoot,"content","handbook")).filter((f)=>f.endsWith(".mdx")).map((f)=>[`content/handbook/${f}`,`content/handbook/${f}`]),
  ["content/docs/sql-server-knowledgebase.mdx","content/docs/sql-server-knowledgebase.mdx"],
];
let changed=0;
for(const [from,to] of mappings){const source=path.join(sourceRoot,from);const target=path.join(process.cwd(),to);const same=fs.existsSync(target)&&fs.readFileSync(source).equals(fs.readFileSync(target));if(!same){changed++;console.log(`${check?"OUTDATED":"UPDATED"} ${to}`);if(!check){fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target)}}}
if(check&&changed)process.exit(1);
console.log(changed?`${changed} file(s) ${check?"need synchronization":"synchronized"}.`:"Approved content is in sync.");
