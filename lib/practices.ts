export type PracticeArea = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  introduction: string;
  image: string;
  focus: readonly { title: string; description: string }[];
  work: readonly string[];
  outcomes: readonly string[];
  relatedProducts: readonly { label: string; href: string }[];
};

export const practiceAreas: readonly PracticeArea[] = [
  {
    slug: "development", title: "Development", eyebrow: "Build reliable database applications",
    summary: "Database design, SQL, stored procedures, and safe delivery for SQL Server and PostgreSQL.",
    introduction: "Good SQL development starts with the application contract and the access paths the workload will use. The work includes data modeling, query design, programmable objects, testing, source control, and deployment practices that keep changes reviewable.",
    image: "/images/practice/banners/development.png",
    focus: [
      { title: "Schema and data modeling", description: "Design keys, relationships, constraints, data types, and naming around business rules and expected growth." },
      { title: "Queries and database code", description: "Develop readable SQL, stored procedures, functions, views, and transactions with predictable behavior." },
      { title: "Delivery and review", description: "Keep database changes in source control, test migrations, review plans, and promote changes through repeatable pipelines." },
    ],
    work: ["Relational schema and indexing design", "T-SQL and PostgreSQL query development", "Stored procedure, function, and view implementation", "Database unit and integration testing", "Schema comparison and deployment scripting", "Code review for correctness, security, and performance"],
    outcomes: ["A schema that enforces important business rules", "SQL that is understandable and testable", "Repeatable database releases with visible drift", "Clear ownership between application and database logic"],
    relatedProducts: [{ label: "Schema Compare", href: "/products/schema-compare/" }, { label: "Migration Toolkit", href: "/products/migration-toolkit/" }],
  },
  {
    slug: "administration", title: "Administration", eyebrow: "Operate databases with discipline",
    summary: "Repeatable DBA routines for health, backups, jobs, capacity, maintenance, and incident response.",
    introduction: "Database administration keeps production systems available, recoverable, secure, and understandable. Daily checks matter, but mature operations also automate evidence collection, define ownership, document exceptions, and rehearse the work that becomes urgent during an incident.",
    image: "/images/practice/banners/administration.png",
    focus: [
      { title: "Operational health", description: "Monitor services, jobs, storage, waits, blocking, replication, and configuration drift before small issues become incidents." },
      { title: "Backup and recovery", description: "Manage full recovery chains, verify backup media, test restores, and align retention with recovery objectives." },
      { title: "Maintenance and capacity", description: "Control statistics, indexes, integrity checks, file growth, patching, and capacity forecasts through documented routines." },
    ],
    work: ["Daily and weekly SQL Server or PostgreSQL health checks", "Backup scheduling, verification, restore testing, and retention", "SQL Agent, cron, and automation job review", "Storage, TempDB, WAL, and transaction log management", "Patching, upgrades, and configuration baselines", "Runbooks, escalation paths, and production change review"],
    outcomes: ["Fewer surprise incidents", "Backups tied to proven restore procedures", "Visible capacity and maintenance risks", "A repeatable operating model that another DBA can follow"],
    relatedProducts: [{ label: "SQL Monitoring", href: "/products/sql-monitoring/" }, { label: "Backup Manager", href: "/products/backup-manager/" }, { label: "Assessment Collector", href: "/products/assessment-generator/" }],
  },
  {
    slug: "security", title: "Security", eyebrow: "Protect data through layered controls",
    summary: "Least privilege, identity, auditing, encryption, and deliberate protection for sensitive data.",
    introduction: "Database security connects identity, permissions, application access, network boundaries, encryption, auditing, and operational review. The goal is to grant each person and service only what it needs while preserving a clear record of sensitive activity.",
    image: "/images/practice/banners/security.png",
    focus: [
      { title: "Identity and access", description: "Design login, role, service-account, and ownership models that avoid broad standing privileges." },
      { title: "Data protection", description: "Apply encryption, masking, row-level controls, secret management, and secure connection settings where the data requires them." },
      { title: "Audit and assurance", description: "Capture important activity, review privileged access, test controls, and retain evidence for security and compliance reviews." },
    ],
    work: ["Login, user, role, and permission reviews", "Least-privilege service account design", "Encryption in transit and at rest", "Sensitive-data discovery and masking strategy", "SQL audit, event collection, and alerting", "Security configuration and vulnerability assessment"],
    outcomes: ["Reduced privilege and credential exposure", "Clear separation of operational responsibilities", "Auditable access to sensitive data", "Security controls that remain practical for production teams"],
    relatedProducts: [{ label: "Assessment Collector", href: "/products/assessment-generator/" }, { label: "SQL Monitoring", href: "/products/sql-monitoring/" }],
  },
  {
    slug: "availability", title: "High availability and disaster recovery", eyebrow: "Prepare for failure before it happens",
    summary: "Recovery objectives, resilient architectures, tested failover, and proven restore paths.",
    introduction: "High availability reduces interruption inside an environment. Disaster recovery provides a path back when the environment itself is unavailable. Both begin with business recovery objectives and end with rehearsed procedures backed by evidence.",
    image: "/images/practice/banners/availability.png",
    focus: [
      { title: "Architecture and objectives", description: "Translate RTO, RPO, workload behavior, failure domains, and budget into an appropriate topology." },
      { title: "Failover operations", description: "Document detection, decision, failover, client redirection, validation, and failback for SQL Server and PostgreSQL." },
      { title: "Recovery proof", description: "Test restores, replication state, backup chains, application connectivity, and data consistency on a regular schedule." },
    ],
    work: ["SQL Server Availability Groups, FCI, log shipping, and replication", "PostgreSQL streaming replication, Patroni, etcd, and HAProxy", "Backup architecture and off-site retention", "RTO and RPO assessment", "Failover and failback runbooks", "Disaster-recovery exercises and evidence reports"],
    outcomes: ["A topology matched to business recovery targets", "Documented failover authority and procedure", "Measured recovery times instead of assumptions", "Teams that have practiced the recovery path"],
    relatedProducts: [{ label: "HA Cluster Lab", href: "/products/ha-cluster-lab/" }, { label: "Backup Manager", href: "/products/backup-manager/" }],
  },
  {
    slug: "performance", title: "Optimization and performance", eyebrow: "Tune from evidence",
    summary: "Workload analysis, query plans, indexing, waits, and capacity decisions for predictable performance.",
    introduction: "Performance tuning should begin with a measurable problem. Work from workload history, waits, resource pressure, execution plans, and query behavior to identify the limiting component before changing SQL, indexes, configuration, or infrastructure.",
    image: "/images/practice/banners/performance.png",
    focus: [
      { title: "Workload diagnosis", description: "Use waits, latency, throughput, blocking, CPU, memory, storage, and concurrency evidence to define the bottleneck." },
      { title: "Query and plan tuning", description: "Analyze execution plans, estimates, access methods, parameter sensitivity, and regressions before rewriting code." },
      { title: "Sustainable improvements", description: "Balance index benefits against write cost, verify changes under realistic load, and monitor for regression." },
    ],
    work: ["SQL Server Query Store and PostgreSQL pg_stat_statements analysis", "Execution-plan and EXPLAIN review", "Index design, consolidation, and maintenance", "Blocking, deadlock, and concurrency investigation", "Parameter sensitivity and plan stability", "Performance baselines, load testing, and capacity forecasting"],
    outcomes: ["A measured baseline and verified improvement", "Faster queries without unnecessary indexes", "Lower operational risk during tuning", "A monitoring trail that catches future regressions"],
    relatedProducts: [{ label: "SQL Monitoring", href: "/products/sql-monitoring/" }, { label: "Assessment Collector", href: "/products/assessment-generator/" }],
  },
  {
    slug: "training", title: "Training and workshops", eyebrow: "Learn by doing the work",
    summary: "Hands-on SQL Server and PostgreSQL learning built around realistic operations and troubleshooting.",
    introduction: "Useful database training combines explanation with a lab that behaves like the real platform. Workshops can focus on development, administration, performance, migration, security, availability, or safe use of AI with database tools.",
    image: "/images/practice/banners/training.png",
    focus: [
      { title: "Role-based learning", description: "Shape the material for developers, DBAs, platform engineers, support teams, or mixed delivery groups." },
      { title: "Guided labs", description: "Practice diagnosis, change, validation, failure, and recovery using repeatable SQL Server and PostgreSQL environments." },
      { title: "Transfer to production", description: "Connect every lab to checklists, scripts, measurements, and decisions participants can use after the session." },
    ],
    work: ["SQL development and query tuning workshops", "Production DBA fundamentals and operational runbooks", "Backup, restore, HA, and disaster-recovery labs", "SQL Server to PostgreSQL migration workshops", "Security and least-privilege exercises", "GitHub Copilot, Data API Builder, and SQL MCP sessions"],
    outcomes: ["Practical skills demonstrated in a lab", "Shared terminology and operating practices", "Reusable scripts and checklists", "A training path matched to the team’s current platform"],
    relatedProducts: [{ label: "HA Cluster Lab", href: "/products/ha-cluster-lab/" }, { label: "DBA Handbook", href: "/products/dba-handbook/" }],
  },
  {
    slug: "consulting", title: "Consulting", eyebrow: "Independent help for difficult database work",
    summary: "Architecture, performance, migrations, reliability, and operational guidance shaped to your environment.",
    introduction: "Database consulting is most useful when it leaves the team with a clearer system and a clearer way to operate it. Engagements begin with evidence, identify the decisions that matter, and produce practical recommendations, implementation support, or knowledge transfer.",
    image: "/images/practice/banners/consulting.png",
    focus: [
      { title: "Assessment and architecture", description: "Review the current platform, workload, risks, dependencies, and target state before recommending change." },
      { title: "Delivery support", description: "Work alongside the team on tuning, migrations, HA/DR, security, upgrades, and production readiness." },
      { title: "Operational maturity", description: "Improve monitoring, runbooks, ownership, change control, recovery testing, and escalation practices." },
    ],
    work: ["Database architecture and production health reviews", "Performance troubleshooting and remediation", "SQL Server and PostgreSQL migrations", "HA/DR design and recovery testing", "Security and access reviews", "DBA support, mentoring, and incident assistance"],
    outcomes: ["A prioritized and evidence-backed action plan", "Reduced risk around major platform changes", "Implementation decisions documented for operators", "Skills and artifacts that remain with the internal team"],
    relatedProducts: [{ label: "Assessment Collector", href: "/products/assessment-generator/" }, { label: "Migration Toolkit", href: "/products/migration-toolkit/" }],
  },
  {
    slug: "ai-sql-mcp", title: "AI and SQL MCP", eyebrow: "Connect AI to governed data operations",
    summary: "Repository-aware SQL assistance and narrow, auditable database access through MCP and configured APIs.",
    introduction: "AI can accelerate SQL development and help users work with data, but it needs context, review, and a controlled execution boundary. Keep development assistance inside a reviewable workflow and expose named database operations instead of unrestricted credentials or raw SQL access.",
    image: "/images/practice/banners/ai.png",
    focus: [
      { title: "AI-assisted development", description: "Ground prompts in schema and repository rules, inspect proposed changes, and validate output against development data." },
      { title: "Governed tool access", description: "Expose approved tables, views, procedures, and actions through Data API Builder or narrowly scoped MCP tools." },
      { title: "Security and evaluation", description: "Protect secrets, separate permissions, log tool use, test denied operations, and measure correctness before deployment." },
    ],
    work: ["Copilot repository instructions and SQL review skills", "Prompt patterns for SQL generation, review, and troubleshooting", "Data API Builder REST, GraphQL, and MCP configuration", "Entity roles, field restrictions, and row policies", "Tool descriptions and database operation design", "Evaluation of SQL correctness, safety, and performance"],
    outcomes: ["More consistent AI-assisted SQL changes", "No raw production credentials in prompts or clients", "A narrow and auditable data-access contract", "Human review and database evidence retained in the workflow"],
    relatedProducts: [{ label: "SQL Monitoring", href: "/products/sql-monitoring/" }, { label: "DBA Handbook", href: "/products/dba-handbook/" }],
  },
] as const;

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return practiceAreas.find((area) => area.slug === slug);
}
