export type Product = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  introduction: string;
  image: string;
  repository: string;
  release?: string;
  highlights: readonly string[];
  capabilities: readonly { title: string; description: string }[];
};

export const products: readonly Product[] = [
  {
    slug: "sql-monitoring",
    title: "SQL Monitoring",
    eyebrow: "Observe SQL Server and PostgreSQL",
    description: "Health and performance telemetry, rule-based checks, and query triage for SQL Server and PostgreSQL.",
    introduction: "Keep the signals that matter in one place, from server health and wait activity to the queries that need attention first.",
    image: "/images/monitoring/sqlserver-dashboard.png",
    repository: "https://github.com/rsharma155/sql_optima",
    highlights: ["Live health and wait signals", "Rule-based checks", "Actionable query triage"],
    capabilities: [
      { title: "See workload health", description: "Track the operational signals that show whether an instance is healthy or drifting toward an incident." },
      { title: "Find the pressure point", description: "Move from symptoms to waits, resource pressure, and the queries contributing to the problem." },
      { title: "Work across engines", description: "Use a consistent monitoring approach for both SQL Server and PostgreSQL estates." },
    ],
  },
  {
    slug: "schema-compare",
    title: "Schema Compare",
    eyebrow: "Review drift before release",
    description: "Windows GUI and cross-platform CLI to diff procedures, indexes, and tables across environments.",
    introduction: "Compare database objects before deployment so the release contains the schema you intended—not an unnoticed difference between environments.",
    image: "/images/products/sql-optima-schema-compare-hero.png",
    repository: "https://github.com/rsharma155/sqloptima_compare",
    release: "https://github.com/rsharma155/sqloptima_compare/releases/tag/v0.0.1",
    highlights: ["Windows GUI", "Cross-platform CLI", "Procedure, index, and table diffs"],
    capabilities: [
      { title: "Compare environments", description: "Surface object-level differences between source and target databases before a change moves forward." },
      { title: "Choose GUI or CLI", description: "Use the Windows interface for visual review or put the cross-platform command line into repeatable workflows." },
      { title: "Make drift reviewable", description: "Turn hidden schema differences into an explicit checkpoint your team can discuss and resolve." },
    ],
  },
  {
    slug: "migration-toolkit",
    title: "Migration Toolkit",
    eyebrow: "Plan a rehearsed cutover",
    description: "SQL Server to PostgreSQL cutovers with stored-procedure and function conversion.",
    introduction: "Move database code and cutover work into a repeatable process, with conversion support for the routines that usually create migration friction.",
    image: "/images/products/sql-optima-migration-hero.png",
    repository: "https://github.com/rsharma155/sqloptima_migration",
    highlights: ["Procedure conversion", "Function conversion", "Cutover guidance"],
    capabilities: [
      { title: "Convert database routines", description: "Translate SQL Server stored procedures and functions into PostgreSQL-oriented implementations." },
      { title: "Expose migration work", description: "Make conversion gaps and follow-up tasks visible before the production cutover window." },
      { title: "Rehearse the move", description: "Use a structured toolkit to practice and refine the path from source to target." },
    ],
  },
  {
    slug: "assessment-generator",
    title: "Assessment Generator",
    eyebrow: "Turn evidence into a plan",
    description: "Automated SQL Server and PostgreSQL audits that produce HTML and PDF health reports.",
    introduction: "Collect findings consistently and produce a report that helps operators move from estate evidence to prioritized remediation work.",
    image: "/images/products/dba-handbook-hero.png",
    repository: "https://github.com/rsharma155/dba_handbook",
    highlights: ["Quick, Standard, and Deep modes", "Severity-scored findings", "HTML and PDF reports"],
    capabilities: [
      { title: "Choose the assessment depth", description: "Run a focused pass or a deeper audit depending on the time and access available." },
      { title: "Prioritize findings", description: "Use severity to separate urgent risks from longer-term operational improvements." },
      { title: "Share the outcome", description: "Export results in formats that work for technical review and stakeholder follow-through." },
    ],
  },
  {
    slug: "backup-manager",
    title: "Backup Manager",
    eyebrow: "Back up for recovery",
    description: "Windows SQL Server backup platform with a control panel and a web operations console.",
    introduction: "Run SQL Server backup operations around complete recovery chains, clear oversight, and the confidence that the backup can support a real restore.",
    image: "/images/products/sqloptima-backup-pro-hero.png",
    repository: "https://github.com/rsharma155/sqloptima_backup",
    release: "https://github.com/rsharma155/sqloptima_backup/releases/tag/v0.0.1",
    highlights: ["FULL, DIFF, and LOG chains", "Windows control panel", "Web operations console"],
    capabilities: [
      { title: "Manage the backup chain", description: "Coordinate full, differential, and transaction log backups as one recoverable sequence." },
      { title: "Operate from the right surface", description: "Use the Windows control panel for local administration and the web console for operational visibility." },
      { title: "Build restore confidence", description: "Keep recovery readiness—not just successful job completion—as the outcome that matters." },
    ],
  },
  {
    slug: "dba-handbook",
    title: "DBA Handbook",
    eyebrow: "Keep the playbook beside the work",
    description: "Searchable operational guidance for SQL Server, PostgreSQL, and more.",
    introduction: "Use practical checklists, scripts, and explanations while you diagnose, maintain, migrate, and recover production databases.",
    image: "/images/handbook/knowledgebase-hero.png",
    repository: "https://github.com/rsharma155/dba_handbook",
    highlights: ["Production playbooks", "Portable guidance", "Ready-to-run scripts"],
    capabilities: [
      { title: "Follow proven checklists", description: "Use step-by-step operational guidance when consistency matters more than memory." },
      { title: "Start with working scripts", description: "Adapt practical SQL and diagnostics to the environment you are supporting." },
      { title: "Learn in context", description: "Keep the why next to the what so each task also strengthens the team's operating knowledge." },
    ],
  },
  {
    slug: "ha-cluster-lab",
    title: "HA Cluster Lab",
    eyebrow: "Practice failure before production",
    description: "Side-by-side Patroni PostgreSQL and SQL Server clusters with failover traffic generation.",
    introduction: "Rehearse high-availability behavior in a repeatable lab so failover, traffic, and recovery decisions are familiar before an incident.",
    image: "/images/monitoring/postgres-dashboard.png",
    repository: "https://github.com/rsharma155/sqlserver_postgres_ha_cluster",
    highlights: ["Patroni PostgreSQL", "SQL Server cluster", "Repeatable failover traffic"],
    capabilities: [
      { title: "Compare HA approaches", description: "Work with PostgreSQL and SQL Server cluster patterns side by side in one learning environment." },
      { title: "Generate realistic traffic", description: "Keep activity moving while you observe how the platforms respond to failover events." },
      { title: "Repeat the recovery", description: "Run the scenario again until the operational sequence is understood and dependable." },
    ],
  },
] as const;

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
