import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const collections = ["blog", "handbook", "docs"];
const items = [];
for (const collection of collections) {
  const dir = path.join(root, "content", collection);
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".mdx")).sort()) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    if (data.published === false) continue;
    const slug = file.replace(/\.mdx$/u, "");
    const text = content.replace(/```[\s\S]*?```/gu, " ").replace(/<[^>]+>/gu, " ").replace(/[#*`_[\]()]/gu, " ").replace(/\s+/gu, " ").trim().slice(0, 2400);
    items.push({ title: data.title, summary: data.summary, collection, url: `/${collection}/${slug}/`, tags: [data.category, data.subcategory, text].filter(Boolean) });
  }
}
fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.writeFileSync(path.join(root, "public", "search-index.json"), JSON.stringify(items));
console.log(`Generated search index with ${items.length} entries.`);
