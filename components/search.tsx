"use client";
import { useEffect, useMemo, useState } from "react";
import { withBasePath } from "@/lib/paths";

type Item = { title: string; summary: string; collection: string; url: string; tags: string[] };
export function Search() {
  const [query, setQuery] = useState(""); const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { fetch(withBasePath("/search-index.json")).then((r) => r.json()).then(setItems).catch(() => setItems([])); }, []);
  const results = useMemo(() => { const terms = query.toLowerCase().trim().split(/\s+/u).filter(Boolean); if (!terms.length) return [];
    return items.filter((item) => terms.every((term) => `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase().includes(term))).slice(0, 30); }, [items, query]);
  return <div className="search"><label htmlFor="search">Search articles and guides</label><input id="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try: Query Store" />
    {query && <p className="muted">{results.length} result{results.length === 1 ? "" : "s"}</p>}
    <div className="cards">{results.map((item) => <a className="card" key={item.url} href={withBasePath(item.url)}><small>{item.collection}</small><h2>{item.title}</h2><p>{item.summary}</p></a>)}</div></div>;
}
