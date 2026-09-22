import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export type Collection = "blog" | "handbook" | "docs";
const schema = z.object({
  title: z.string().min(1), description: z.string().min(1), summary: z.string().min(1),
  date: z.union([z.string(), z.date()]).transform((v) => v instanceof Date ? v.toISOString().slice(0, 10) : v),
  published: z.boolean().default(true), category: z.string().optional(), subcategory: z.string().optional(),
});
export type ContentDocument = z.infer<typeof schema> & { slug: string; source: string };
const root = path.join(process.cwd(), "content");

export function listContent(collection: Collection): ContentDocument[] {
  const dir = path.join(root, collection);
  const seen = new Set<string>();
  return fs.readdirSync(dir).filter((name) => name.endsWith(".mdx")).map((name) => {
    const slug = name.replace(/\.mdx$/u, "");
    if (seen.has(slug)) throw new Error(`Duplicate slug: ${collection}/${slug}`);
    seen.add(slug);
    const parsed = matter(fs.readFileSync(path.join(dir, name), "utf8"));
    return { ...schema.parse(parsed.data), slug, source: parsed.content.trim() };
  }).filter((item) => item.published).sort((a, b) => b.date.localeCompare(a.date));
}

export function getContent(collection: Collection, slug: string): ContentDocument | undefined {
  return listContent(collection).find((item) => item.slug === slug);
}
