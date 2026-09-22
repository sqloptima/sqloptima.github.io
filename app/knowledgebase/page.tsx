import { withBasePath } from "@/lib/paths";
export const metadata = { title: "Knowledge Base", description: "SQL Server checklists, interactive HTML guides, labs, and SQL script libraries." };
const resources=[
  ["SQL Server knowledge base index","/knowledgebase/index.html","Interactive checklists and reference guides."],
  ["2016 to 2022 migration toolkit","/knowledgebase/sql-2016-2022-post-migration/index.html","Post-migration diagnostics, Query Store, statistics, compatibility, and baseline scripts."],
  ["Compatibility level 160 fixes","/knowledgebase/sql-2016-2022-post-migration/Compat160_Targeted_Fixes.html","Targeted checks and fixes for compatibility-level regressions."],
  ["In-Memory OLTP SQL Server 2025 lab","/labs/InMemoryOLTP_SQL2025_Lab_Guide.html","A hands-on lab for memory-optimized data and cleanup."],
] as const;
export default function Page(){return <main className="wrap section"><p className="eyebrow">Downloadable resources</p><h1>Knowledge base</h1><p className="lede">Static HTML guides, labs, and SQL scripts. Always review scripts and test them outside production first.</p><div className="cards">{resources.map(([title,href,summary])=><a className="card" href={withBasePath(href)} key={href}><h2>{title}</h2><p>{summary}</p></a>)}</div></main>}
