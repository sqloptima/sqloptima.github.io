import Link from "next/link";
import type { Collection } from "@/lib/content";
import { listContent } from "@/lib/content";

export function CollectionPage({ collection, title, intro }: { collection: Collection; title: string; intro: string }) {
  const items = listContent(collection);
  return <main className="wrap section"><p className="eyebrow">Free technical resources</p><h1>{title}</h1><p className="lede">{intro}</p><div className="cards">{items.map((item) => <Link className="card" href={`/${collection}/${item.slug}/`} key={item.slug}><small>{item.category ?? collection} · {item.date}</small><h2>{item.title}</h2><p>{item.summary}</p></Link>)}</div></main>;
}
