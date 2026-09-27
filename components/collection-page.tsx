import Link from "next/link";
import type { Collection } from "@/lib/content";
import { listContent } from "@/lib/content";
import { withBasePath } from "@/lib/paths";

function blogImage(slug: string) {
  return `/images/blog/${slug}.${slug === "ai-assisted-sql-from-prompting-to-proof" ? "png" : "svg"}`;
}

export function CollectionPage({ collection, title, intro }: { collection: Collection; title: string; intro: string }) {
  const items = listContent(collection);
  return <main className="wrap section"><p className="eyebrow">Free technical resources</p><h1>{title}</h1><p className="lede">{intro}</p><div className={`cards ${collection === "blog" ? "blog-cards" : ""}`}>{items.map((item) => <Link className="card" href={`/${collection}/${item.slug}/`} key={item.slug}>{collection === "blog" && <img className="blog-card-image" src={withBasePath(blogImage(item.slug))} alt="" loading="lazy" />}<span className="collection-card-copy"><small>{item.category ?? collection} · {item.date}</small><h2>{item.title}</h2><p>{item.summary}</p></span></Link>)}</div></main>;
}
