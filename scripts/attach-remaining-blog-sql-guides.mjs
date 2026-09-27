import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const guides = {
  "ai-assisted-sql-from-prompting-to-proof": ["top_resource_queries.sql", "Top resource-consuming queries", "VIEW SERVER STATE", "Ranks cached queries by CPU, elapsed time, logical reads, writes, and execution count.", "Use Total_CPU, Total_Elapsed, and Total_Logical_Reads to find expensive workload. Divide totals by Execution_Count when comparing frequent small queries with rare large queries. Query_Text and database context identify the statement to validate with an actual plan."],
  "alert-fatigue": ["sql_server_server_health_overview.sql", "SQL Server health overview", "VIEW SERVER STATE and read access to system metadata", "Returns a broad set of health signals that can be used to design alerts around actionable conditions.", "Treat the result sets as candidates, not automatic pages. Select values tied to user impact, define sustained thresholds, assign an owner, and link a runbook. Informational inventory belongs on a dashboard."],
  "assessment-to-tickets": ["sql_server_server_health_overview.sql", "SQL Server health overview", "VIEW SERVER STATE and read access to system metadata", "Collects configuration, workload, storage, backup, and operational evidence suitable for assessment findings.", "Convert rows into tickets only when the server, database, metric, evidence time, business impact, acceptance test, and owner are known. Prioritize critical or repeated conditions instead of turning every informational row into work."],
  "cte-temp-table-breakdown": ["tempdb_configuration.sql", "TempDB configuration diagnostic", "VIEW SERVER STATE", "Reports TempDB files, size, growth, placement, and configuration signals relevant when temporary objects or spills become part of a rewrite.", "Compare file sizes and growth increments. Uneven sizes can undermine proportional fill. Small growth increments can cause repeated pauses. This output describes TempDB capacity; use an actual plan and task-space DMVs to prove that a CTE or temporary-table choice drives the load."],
  "cutover-checklists": ["backup_log_chain.sql", "Backup and log-chain review", "read access to msdb backup history", "Reviews backup history and log-chain evidence needed before a migration or recovery cutover.", "Confirm the latest full backup, differential base where used, and uninterrupted log sequence through the planned recovery point. A recent timestamp does not prove restoreability, so retain media locations and complete a restore rehearsal."],
  "exists-cross-apply-vs-left-join": ["top_resource_queries.sql", "Top resource-consuming queries", "VIEW SERVER STATE", "Finds statements whose aggregate CPU, elapsed time, or reads make them worthwhile rewrite candidates.", "Locate the candidate query by text and database, then calculate per-execution cost from totals and Execution_Count. After changing EXISTS, APPLY, or JOIN syntax, compare exact results, duplicate behavior, reads, CPU, duration, and the actual plan."],
  "in-memory-oltp-sql-server-2025": ["inmemory_compression.sql", "In-Memory OLTP and compression review", "VIEW SERVER STATE and VIEW DATABASE STATE", "Inventories memory-optimized objects and compression-related state so teams can assess feature use and storage choices.", "Read object names, durability, memory allocation, row counts, and compression candidates in database context. High memory use requires workload and capacity review. Compression recommendations must be tested for CPU cost and edition or feature support."],
  "monitoring-before-migration": ["performance_snapshot.sql", "Pre-migration performance snapshot", "VIEW SERVER STATE", "Captures a repeatable point-in-time workload and resource baseline before migration.", "Save every result with the collection time and workload window. Compare waits, active work, CPU, I/O, memory, and throughput across several business cycles. The target should be compared with the same measures after cutover."],
  "postgres-vacuum-debt": ["vacuum_debt_diagnostics.sql", "PostgreSQL vacuum debt diagnostic", "statistics visibility on the target database; pg_monitor may reveal more session details", "Returns live and dead tuple estimates, vacuum and analyze timestamps, modification count, XID age, relation size, a review status, and long-running transactions.", "Prioritize high XID_Age because wraparound risk is time-sensitive. Dead_Tuple_Pct matters more when N_Dead_Tup and Total_Size are also large. An old Xact_Start can hold back cleanup. Statistics are estimates, so confirm with trends and table-specific autovacuum settings."],
  "query-rewrite-basics": ["top_resource_queries.sql", "Top resource-consuming queries", "VIEW SERVER STATE", "Identifies high-resource statements from the plan cache and provides the baseline totals needed to choose a rewrite candidate.", "Use Execution_Count to normalize totals. Compare logical reads, CPU, and elapsed time before and after the rewrite under equivalent parameters. A missing row may mean the plan was evicted, not that the query stopped running."],
  "query-tuning-iif": ["top_resource_queries.sql", "Top resource-consuming queries", "VIEW SERVER STATE", "Surfaces expensive cached statements, including queries where conditional expressions contribute to repeated scalar work or non-searchable predicates.", "Find the query by Query_Text, then inspect its actual execution plan. The output ranks workload cost but does not prove IIF is the cause. Compare the CASE-equivalent rewrite for result types, NULL behavior, estimates, reads, and CPU."],
  "schema-drift-reliability": ["object_dependencies.sql", "Database object dependency inventory", "VIEW DEFINITION on the target database objects", "Returns object and expression dependencies that help define the blast radius of a schema difference.", "Read referencing and referenced object names together. Unresolved or cross-database references need manual verification. Dependency rows do not replace a schema comparison; use them to order review and deployment and to identify consumers requiring regression tests."],
  "sql-server-production-install-checklist": ["server_configuration_audit.sql", "Server configuration audit", "VIEW SERVER STATE and visibility into server configuration", "Reports important instance settings and compares them with operational review guidance.", "Review Current_Value and configured versus running values. Treat status text as a prompt for workload-specific review. Memory, MAXDOP, cost threshold, backup compression, and advanced settings should be tested against the server role rather than copied from a universal template."],
  "stored-procedures-vs-inline-sql": ["stored_procedure_performance_audit.sql", "Stored procedure performance audit", "VIEW SERVER STATE", "Ranks cached stored-procedure workload by executions, CPU, elapsed time, reads, writes, and recency.", "Use Execution_Count and average values to separate frequent inexpensive procedures from rare heavy ones. Last_Execution_Time and cache age affect interpretation. Compare procedure metrics with equivalent inline workload using Query Store or controlled tests."],
  "table-variables-small-data": ["tempdb_configuration.sql", "TempDB configuration diagnostic", "VIEW SERVER STATE", "Shows TempDB file and growth configuration that forms the storage boundary for table variables, temporary tables, spills, and version-store activity.", "Check equal file size and growth, available capacity, and sensible fixed growth. This output does not decide between a table variable and a temp table; combine it with actual cardinality, estimates, spills, and plan behavior."],
};

const root = path.join(process.cwd(), "content", "blog");
const marker = "## Download and run the diagnostic";
for (const [slug, [fileName, title, permission, does, read]] of Object.entries(guides)) {
  const file = path.join(root, `${slug}.mdx`);
  const parsed = matter(fs.readFileSync(file, "utf8"));
  if (parsed.content.includes(marker)) continue;
  const folder = slug === "postgres-vacuum-debt" ? "postgresql-diagnostics" : "sql-server-diagnostics";
  const engine = slug === "postgres-vacuum-debt" ? "PostgreSQL" : "SQL Server";
  const section = `${marker}

<div className="sql-download-panel">

**${title}**

<DownloadLink href="/downloads/${folder}/${fileName}">Download ${fileName}</DownloadLink>

</div>

### Before you run it

- Review every statement and confirm the connection points to the intended ${engine} database server.
- Run through a non-production or read-only diagnostic account first when possible.
- Required access: ${permission}.
- Save the output with the server name, database name, collection time, and workload window so another engineer can reproduce the analysis.

### What it does

${does} The script is diagnostic and does not apply an automatic remediation. Result values still need workload context, a second supporting signal, and a before-and-after comparison.

<details className="sql-output-guide">
<summary>How to read the output values</summary>

${read}

Investigate warning values in business context. Verify the suspected cause with plans, history, operating-system telemetry, application behavior, or a second sample before changing production. After any remediation, rerun the same script and compare the same fields.

</details>
`;
  fs.writeFileSync(file, matter.stringify(`${parsed.content.trim()}\n\n${section}\n`, parsed.data));
}
console.log(`Attached remaining guides to ${Object.keys(guides).length} posts.`);
