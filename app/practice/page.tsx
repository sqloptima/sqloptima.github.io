export const metadata = { title: "Practice Guides", description: "Database engineering practice areas and learning paths." };
const areas=[
  ["availability","Availability","Define recovery objectives, rehearse failover, and prove restore paths."],
  ["performance","Performance","Start from waits, latency, plans, and evidence before changing the system."],
  ["administration","Administration","Build repeatable routines for backups, capacity, jobs, maintenance, and health checks."],
  ["development","Development","Design schemas and SQL around the application contract and actual access paths."],
  ["security","Security","Use least privilege, auditable access, and deliberate protection for sensitive data."],
  ["ai-and-data","AI and data","Connect AI workflows to governed database access with narrow permissions and review."],
] as const;
export default function Page(){return <main className="wrap section"><p className="eyebrow">Learning paths</p><h1>Database practice guides</h1><p className="lede">Educational starting points that connect core disciplines to the deeper handbook and blog material.</p><div className="cards">{areas.map(([id,title,summary])=><section className="card" id={id} key={id}><h2>{title}</h2><p>{summary}</p></section>)}</div></main>}
