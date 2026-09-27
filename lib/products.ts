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
  facts?: readonly { label: string; value: string }[];
  workflow?: readonly { title: string; description: string }[];
  requirements?: readonly string[];
  quickStart?: readonly { label: string; command: string }[];
  sourcePath?: string;
};

export const products: readonly Product[] = [
  {
    slug: "sql-monitoring",
    title: "SQL Monitoring",
    eyebrow: "Observe SQL Server and PostgreSQL",
    description: "Self-hosted SQL tuning and monitoring with deep dashboards, automated diagnostics, and actionable guidance for SQL Server and PostgreSQL.",
    introduction: "SQL Optima combines live engine telemetry with expert rules so DBAs can move from a symptom to the workload, query, configuration, or capacity issue behind it.",
    image: "/images/monitoring/sqlserver-dashboard.png",
    repository: "https://github.com/rsharma155/sql_optima",
    highlights: ["14 PostgreSQL dashboards", "16 SQL Server dashboards", "100% self-hosted"],
    capabilities: [
      { title: "Triage the estate", description: "Use control-center dashboards for sessions, CPU, memory, I/O, waits, locks, storage, backups, and security." },
      { title: "Analyze expensive SQL", description: "Investigate Query Store and pg_stat_statements workloads, regressions, plan instability, and EXPLAIN plans." },
      { title: "Apply DBA guidance", description: "Use built-in rule evaluators, thresholds, forecasting, and remediation guidance to turn telemetry into action." },
    ],
    facts: [{ label: "Platform", value: "Go API and vanilla JavaScript SPA" }, { label: "Metrics store", value: "PostgreSQL 16 with TimescaleDB" }, { label: "Credential protection", value: "HashiCorp Vault Transit" }, { label: "Current release", value: "0.5.0 in the repository documentation" }],
    workflow: [{ title: "Install the local stack", description: "Docker Compose starts the API, TimescaleDB, Vault, and schema bootstrap services." }, { title: "Register an instance", description: "Add SQL Server or PostgreSQL from the setup wizard and validate the monitoring permissions." }, { title: "Investigate and remediate", description: "Start with the engine dashboard, drill into waits or queries, then use the built-in DBA guidance." }],
    requirements: ["Docker Desktop or Docker Engine with Compose V2", "Git or a repository release archive", "Read-oriented monitoring permissions on each target database"],
    quickStart: [{ label: "Windows PowerShell", command: "irm https://raw.githubusercontent.com/rsharma155/sql_optima/main/install.ps1 | iex" }, { label: "macOS or Linux", command: "curl -fsSL https://raw.githubusercontent.com/rsharma155/sql_optima/main/install.sh | bash" }],
    sourcePath: "README.md",
  },
  {
    slug: "schema-compare",
    title: "Schema Compare",
    eyebrow: "Review drift before release",
    description: "SQL Server schema comparison with a Windows GUI, a cross-platform .NET 8 CLI, ordered deployment scripts, and explicit review of risky changes.",
    introduction: "Compare a source-of-truth database with one or many targets, review every object difference, and generate a self-contained deployment script without a PowerShell runtime dependency.",
    image: "/images/products/sql-optima-schema-compare-hero.png",
    repository: "https://github.com/rsharma155/sqloptima_compare",
    release: "https://github.com/rsharma155/sqloptima_compare/releases/tag/v0.0.1",
    highlights: ["Windows GUI and cross-platform CLI", "One source to many targets", "Safe and manual scripts separated"],
    capabilities: [
      { title: "Compare the full schema", description: "Diff schemas, tables, columns, indexes, keys, constraints, triggers, views, procedures, functions, types, sequences, synonyms, and DDL triggers." },
      { title: "Review changes visually", description: "Filter the color-coded object tree and inspect source and target definitions side by side before generating scripts." },
      { title: "Deploy with guardrails", description: "Generate ordered auto scripts and a separate manual-actions list. Apply only after an explicit confirmation and verify the result." },
    ],
    facts: [{ label: "Engine", value: ".NET 8 portable comparison library" }, { label: "Database support", value: "SQL Server today; other provider interfaces reserved" }, { label: "Outputs", value: "HTML report, manifest, auto scripts, and manual scripts" }, { label: "Automation", value: "CLI compare, connection test, and confirmed deploy commands" }],
    workflow: [{ title: "Connect", description: "Choose the source database and one or more target databases, then test both connections." }, { title: "Compare and review", description: "Inspect added, removed, changed, identical, and ignored objects with side-by-side definitions." }, { title: "Generate or apply", description: "Save self-contained scripts, review manual actions, and optionally apply safe scripts with post-deployment verification." }],
    requirements: [".NET 8 Desktop Runtime for the Windows GUI", ".NET 8 Runtime for the CLI on Windows, Linux, or macOS", "SQL authentication on Linux or macOS; Windows authentication is available on Windows"],
    quickStart: [{ label: "Windows GUI", command: "scripts\\Launch-DesktopApp.cmd" }, { label: "Build the CLI", command: "dotnet build SqlOptima.SchemaCompare.Cli -c Release" }],
    sourcePath: "README.md",
  },
  {
    slug: "migration-toolkit",
    title: "Migration Toolkit",
    eyebrow: "Plan a rehearsed cutover",
    description: "A full-stack SQL Server to PostgreSQL migration platform for assessment, AST-based conversion, high-throughput data movement, validation, CDC, and cutover.",
    introduction: "Treat migration as a controlled lifecycle. SQL Optima parses T-SQL into an AST, moves data through a Go engine, validates the result at several levels, and can keep the target synchronized for cutover.",
    image: "/images/products/sql-optima-migration-hero.png",
    repository: "https://github.com/rsharma155/sqloptima_migration",
    highlights: ["AST-based T-SQL conversion", "Go binary-COPY data plane", "L1–L4 validation and CDC"],
    capabilities: [
      { title: "Assess readiness", description: "Classify tables as safe, warning, or blocker, estimate migration effort, and surface schema and code concerns." },
      { title: "Convert and migrate", description: "Translate T-SQL through a multi-pass AST pipeline and move data with adaptive chunks, parallel workers, and PostgreSQL binary COPY." },
      { title: "Validate and synchronize", description: "Compare counts, aggregates, hashes, and samples, then use checkpointed CDC streams for a controlled cutover." },
    ],
    facts: [{ label: "Control plane", value: "FastAPI on Python 3.11" }, { label: "Data plane", value: "Go engine with a crash-safe bbolt queue" }, { label: "Interface", value: "Next.js 15 and React 19" }, { label: "Deployment", value: "Docker images with optional Helm deployment" }],
    workflow: [{ title: "Assess", description: "Connect to SQL Server and produce a readiness report with complexity and timing estimates." }, { title: "Convert", description: "Convert schemas and procedural logic with mappings, validation, and warnings for manual review." }, { title: "Migrate, validate, and sync", description: "Run the bulk move, execute L1–L4 checks, and start CDC when the target must remain current." }],
    requirements: ["Docker Desktop on Windows or macOS, or Docker Engine on Linux", "Public access to the project GHCR images, or an authenticated docker login", "Reachable SQL Server source and PostgreSQL target"],
    quickStart: [{ label: "Windows PowerShell", command: "irm https://raw.githubusercontent.com/rsharma155/sqloptima_migration/main/deploy/install/sql-optima.ps1 | iex" }, { label: "macOS or Linux", command: "curl -fsSL https://raw.githubusercontent.com/rsharma155/sqloptima_migration/main/deploy/install/sql-optima.sh | bash" }],
    sourcePath: "README.md",
  },
  {
    slug: "assessment-generator",
    title: "SQL Server Assessment Collector",
    eyebrow: "Collect current-state evidence",
    description: "PowerShell-based SQL Server assessment with detailed or lightweight collection modes, health scoring, and HTML or Excel reporting.",
    introduction: "Collect repeatable evidence before an architecture, modernization, migration, or remediation engagement. Choose a detailed assessment or a faster limited run and produce a report plus an audit log.",
    image: "/images/products/dba-handbook-hero.png",
    repository: "https://github.com/rsharma155/dba_handbook/tree/main/sql_server_assessment_tool/ps_report_collector",
    highlights: ["Detailed and minimal collectors", "HTML and Excel output", "Health score and prioritized findings"],
    capabilities: [
      { title: "Choose the collection depth", description: "Use the detailed collector for a Phase-1 architectural assessment or the minimal collector for a faster, lighter evidence share." },
      { title: "Cover the production estate", description: "Collect architecture, configuration, schema, storage, indexes, performance, security, HA/DR, capacity, and maintenance evidence." },
      { title: "Share a structured result", description: "Generate an executive HTML report, an Excel workbook with evidence sheets and charts, or both, while always retaining an audit log." },
    ],
    facts: [{ label: "Supported server", value: "SQL Server 2016+ recommended" }, { label: "Runtime", value: "Windows PowerShell 5.1 or PowerShell 7+" }, { label: "Output", value: "HTML, Excel, or both; audit log always generated" }, { label: "Scope", value: "All user databases or a validated database list" }],
    workflow: [{ title: "Select the collector", description: "Choose the detailed script for architectural evidence or the minimal script for a shorter run." }, { title: "Run against the SQL endpoint", description: "Provide a SQL credential and optionally select one or more user databases." }, { title: "Review the evidence", description: "Start with the health score and findings, then inspect the category-based HTML or Excel evidence sections." }],
    requirements: ["Windows PowerShell 5.1 or PowerShell 7+", "dbatools module", "ImportExcel module for Excel or combined output", "SQL access including VIEW SERVER STATE, database access, and msdb backup history for complete results"],
    quickStart: [{ label: "Install modules", command: "Install-Module dbatools -Scope CurrentUser\nInstall-Module ImportExcel -Scope CurrentUser" }, { label: "Run the detailed HTML assessment", command: ".\\Invoke-SqlInitialAssessment.ps1 -ServerIP '192.168.1.100' -Credential $sqlCredential -OpenReport" }],
    sourcePath: "sql_server_assessment_tool/ps_report_collector/README.md",
  },
  {
    slug: "backup-manager",
    title: "Backup Manager",
    eyebrow: "Back up for recovery",
    description: "Self-hosted SQL Server backup and disaster-recovery platform with Windows services, a local control panel, remote web operations, and local or cloud storage.",
    introduction: "Schedule and operate full, differential, and transaction log backups from one backup server, with integrity verification before upload and durable history for local and cloud copies.",
    image: "/images/products/sqloptima-backup-pro-hero.png",
    repository: "https://github.com/rsharma155/sqloptima_backup",
    release: "https://github.com/rsharma155/sqloptima_backup/releases/tag/v0.0.1",
    highlights: ["FULL, DIFF, and LOG chains", "VERIFYONLY before upload", "Local and multi-cloud retention"],
    capabilities: [
      { title: "Protect the backup chain", description: "Run SMO-based full, differential, and log backups with compression, CHECKSUM, optional encryption, and chain prerequisite checks." },
      { title: "Verify before transfer", description: "Run RESTORE VERIFYONLY and calculate SHA-256 before files move to the primary destination or an optional cloud mirror." },
      { title: "Operate securely", description: "Keep machine secrets and service controls in the local desktop app while operators use an HTTPS web console with JWT roles." },
    ],
    facts: [{ label: "Topology", value: "Windows API and Agent services with shared SQLite state" }, { label: "Storage", value: "Local, MinIO, Amazon S3, Azure Blob, and Google Cloud Storage" }, { label: "Roles", value: "Admin, Operator, and Viewer" }, { label: "Scheduling", value: "Quartz daily and weekly plans" }],
    workflow: [{ title: "Configure the backup server", description: "Use the elevated desktop control panel for paths, secrets, service setup, and diagnostics." }, { title: "Create a plan", description: "Register SQL Servers and storage, choose databases and backup type, then define retention and scheduling." }, { title: "Run and verify", description: "The Agent executes the backup, verifies the media set, uploads approved files, and records progress and history." }],
    requirements: ["Windows x64 for the self-hosted backup server", ".NET 8 SDK for development or the published portable package", "Network access from the backup server to SQL Server and selected storage", "An HTTPS management endpoint restricted to an admin LAN or VPN for remote use"],
    quickStart: [{ label: "Run the API during development", command: "dotnet run --project src/SqlBackup.Api/SqlBackup.Api.csproj" }, { label: "Run the Agent", command: "dotnet run --project src/SqlBackup.Agent/SqlBackup.Agent.csproj" }],
    sourcePath: "README.md",
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
    description: "Docker-based PostgreSQL Patroni and SQL Server three-node labs with a web UI for CRUD traffic, failover observation, reports, and scheduled backups.",
    introduction: "Start both database environments from one cross-platform launcher, generate concurrent application traffic, and practice high-availability operations without building a lab by hand.",
    image: "/images/monitoring/postgres-dashboard.png",
    repository: "https://github.com/rsharma155/sqlserver_postgres_ha_cluster",
    highlights: ["PostgreSQL Patroni HA", "SQL Server three-node lab", "Web-based CRUD load generator"],
    capabilities: [
      { title: "Launch both lab environments", description: "Run a three-node Patroni cluster with etcd and HAProxy alongside three SQL Server nodes with replication and log shipping." },
      { title: "Generate concurrent CRUD load", description: "Choose an engine, duration, worker count, and concurrent users, then watch operation logs and success rates in real time." },
      { title: "Exercise backup and failure scenarios", description: "Schedule PostgreSQL WAL archives and SQL Server log backups while observing how traffic behaves through operational changes." },
    ],
    facts: [{ label: "Host requirement", value: "Docker 24+ and Docker Compose V2" }, { label: "Web interface", value: "Flask app at http://localhost:5002" }, { label: "PostgreSQL lab", value: "Three Patroni nodes, etcd, HAProxy, and backup storage" }, { label: "SQL Server lab", value: "Three nodes with replication and log shipping" }],
    workflow: [{ title: "Start the lab", description: "The launcher detects host RAM, lets you choose engines, creates memory overrides, and starts the containers." }, { title: "Configure traffic", description: "Select PostgreSQL or SQL Server and set duration, worker threads, and concurrent users." }, { title: "Review and repeat", description: "Inspect throughput, failure analysis, and downloadable reports, then repeat the scenario during failover or backup activity." }],
    requirements: ["Docker 24 or newer", "Docker Compose V2", "Outbound access for images and the Microsoft package feed on first build", "No host Python or ODBC installation is required"],
    quickStart: [{ label: "Windows PowerShell", command: "irm https://raw.githubusercontent.com/rsharma155/sqlserver_postgres_ha_cluster/main/install.ps1 | iex" }, { label: "macOS or Linux", command: "curl -fsSL https://raw.githubusercontent.com/rsharma155/sqlserver_postgres_ha_cluster/main/install.sh | bash" }],
    sourcePath: "README.md",
  },
] as const;

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
