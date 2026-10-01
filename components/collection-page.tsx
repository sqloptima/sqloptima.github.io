import Link from "next/link";
import type { Collection } from "@/lib/content";
import { listContent } from "@/lib/content";
import { withBasePath } from "@/lib/paths";

function blogImage(slug: string) {
  const imageExtensions: Record<string, "gif" | "png"> = {
    "ai-assisted-sql-from-prompting-to-proof": "png",
    "sql-server-security-ransomware-resilient-backups": "png",
    "always-encrypted-sql-server-practical-guide": "gif",
  };
  return `/images/blog/${slug}.${imageExtensions[slug] ?? "svg"}`;
}

export function CollectionPage({ collection, title, intro, bannerImage }: { collection: Collection; title: string; intro: string; bannerImage?: string }) {
  const items = listContent(collection);
  return <main className={`collection-page collection-${collection}`}>{bannerImage ? <header className="collection-banner"><img src={withBasePath(bannerImage)} alt="Open database handbook with operational checklists, technical manuals, and database diagrams" /><div className="collection-banner-scrim" /><div className="wrap collection-banner-copy"><p className="eyebrow">Free technical resources</p><h1>{title}</h1><p>{intro}</p></div></header> : <header className="wrap section collection-heading"><p className="eyebrow">Free technical resources</p><h1>{title}</h1><p className="lede">{intro}</p></header>}<section className="wrap collection-list" aria-label={`${title} collection`}><div className={`cards ${collection === "blog" ? "blog-cards" : ""}`}>{items.map((item) => <Link className="card" href={`/${collection}/${item.slug}/`} key={item.slug}>{collection === "blog" && <img className="blog-card-image" src={withBasePath(blogImage(item.slug))} alt="" loading="lazy" />}<span className="collection-card-copy"><small>{item.category ?? collection} · {item.date}</small><h2>{item.title}</h2><p>{item.summary}</p></span></Link>)}</div></section></main>;
}
