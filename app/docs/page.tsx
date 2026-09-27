import Link from "next/link";
import { listContent } from "@/lib/content";
import { withBasePath } from "@/lib/paths";

export const metadata = { title: "Technical guides", description: "SQL Server and PostgreSQL articles, handbooks, documentation, labs, scripts, and operational guides." };

const interactiveResources = [
  ["SQL Server knowledge base index", "/knowledgebase/index.html", "Interactive checklists and reference guides."],
  ["2016 to 2022 migration toolkit", "/knowledgebase/sql-2016-2022-post-migration/index.html", "Post-migration diagnostics, Query Store, statistics, compatibility, and baseline scripts."],
  ["Compatibility level 160 fixes", "/knowledgebase/sql-2016-2022-post-migration/Compat160_Targeted_Fixes.html", "Targeted checks and fixes for compatibility-level regressions."],
  ["In-Memory OLTP SQL Server 2025 lab", "/labs/InMemoryOLTP_SQL2025_Lab_Guide.html", "A hands-on lab for memory-optimized data and cleanup."],
] as const;

export default function Page() {
  const documentation = listContent("docs");
  const handbooks = listContent("handbook");
  const articles = listContent("blog");
  return <main className="technical-guides-page"><header className="wrap section compact-page-header"><p className="eyebrow">SQL Server and PostgreSQL</p><h1>Technical guides</h1><p className="lede">Browse {documentation.length + handbooks.length + articles.length + interactiveResources.length} documentation pages, handbooks, field guides, labs, and interactive resources.</p><nav className="guide-jump-links" aria-label="Technical guide collections"><a href="#documentation">Documentation <span>{documentation.length}</span></a><a href="#handbooks">Handbooks <span>{handbooks.length}</span></a><a href="#articles">Field guides <span>{articles.length}</span></a><a href="#interactive">Interactive resources <span>{interactiveResources.length}</span></a></nav></header><div className="wrap guide-collections"><GuideSection id="documentation" title="Product documentation" intro="Setup notes and technical reference for SQL Optima resources." items={documentation.map((item) => ({ title: item.title, summary: item.summary, href: `/docs/${item.slug}/`, meta: item.date }))} /><GuideSection id="handbooks" title="Operational handbooks" intro="Long-form checklists and procedures for work that needs repeatability." items={handbooks.map((item) => ({ title: item.title, summary: item.summary, href: `/handbook/${item.slug}/`, meta: item.date }))} /><GuideSection id="articles" title="Database field guides" intro="Focused investigations for performance, reliability, migration, backup, and operations." items={articles.map((item) => ({ title: item.title, summary: item.summary, href: `/blog/${item.slug}/`, meta: item.date }))} /><GuideSection id="interactive" title="Interactive resources and labs" intro="Static tools, guided labs, and downloadable operational resources." items={interactiveResources.map(([title, href, summary]) => ({ title, summary, href: withBasePath(href), external: true }))} /></div></main>;
}

type GuideItem = { title: string; summary: string; href: string; meta?: string; external?: boolean };
function GuideSection({ id, title, intro, items }: { id: string; title: string; intro: string; items: GuideItem[] }) { return <section className="guide-collection" id={id} aria-labelledby={`${id}-title`}><div className="guide-collection-heading"><div><p className="eyebrow">{items.length} resources</p><h2 id={`${id}-title`}>{title}</h2></div><p>{intro}</p></div><div className="guide-card-grid">{items.map((item) => item.external ? <a className="guide-card" href={item.href} key={item.href}><GuideCard item={item} /></a> : <Link className="guide-card" href={item.href} key={item.href}><GuideCard item={item} /></Link>)}</div></section>; }
function GuideCard({ item }: { item: GuideItem }) { return <><small>{item.meta ?? "Interactive resource"}</small><strong>{item.title}</strong><p>{item.summary}</p><span>Open guide →</span></>; }
