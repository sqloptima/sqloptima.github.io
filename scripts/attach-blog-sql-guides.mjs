import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const guides = {
  "always-on-hadr-deployment-checklist": { file: "alwayson_ag_monitor.sql", name: "Availability Group health monitor", permission: "VIEW SERVER STATE and access to the Always On DMVs", does: "Returns replica role and connection health, database synchronization state, log-send and redo queues, transfer rates, suspension state, last commit time, and an estimated RPO indicator.", read: "Start with Sync_Health and Sync_State. A queue that grows across repeated samples matters more than one non-zero value. Compare Log_Send_Queue_KB with Log_Send_Rate_KB_s for transport pressure and Redo_Queue_KB with Redo_Rate_KB_s for secondary redo pressure. Interpret RPO in the context of synchronous or asynchronous commit." },
  "autogrowth-silent-outages": { file: "database_files_growth.sql", name: "Database file growth and utilization", permission: "VIEW SERVER STATE plus visibility into the target databases", does: "Inventories data and log files, allocated and used space, free space, growth settings, and warning status across selected user databases.", read: "Prioritize warning rows with high UsedPct and low FreeSpaceMB. Review PhysicalName to confirm that the hosting volume also has space. Percentage growth and very small fixed increments deserve review because they can create increasingly large pauses or repeated growth events." },
  "backup-verification": { file: "backup_verification.sql", name: "Backup history and SLA review", permission: "read access to msdb backup history and sys.databases", does: "Shows the last full, differential, log, and any backup for every online user database, together with recovery model and a calculated health status.", read: "Investigate CRITICAL and WARNING first. For FULL recovery databases, a missing or stale Last_Log_Backup threatens the recovery point and can prevent log truncation. This script checks history, not media readability; follow it with an isolated restore test." },
  "blocking-chains": { file: "blocking_and_deadlocks.sql", name: "Blocking-chain and deadlock diagnostic", permission: "VIEW SERVER STATE; access to the system_health Extended Events session for deadlock XML", does: "Returns active blockers and waiters, a blocking hierarchy, current SQL text, and recent deadlock graphs from system_health.", read: "Find the row marked HEAD BLOCKER and confirm its transaction owner before taking action. Wait_Time_ms shows impact, while Wait_Type and Wait_Resource show what is blocked. For deadlocks, open Deadlock_XML and identify the victim, competing statements, objects, indexes, and lock modes." },
  "buffer-cache-hit-ratio": { file: "memory_diagnostics.sql", name: "SQL Server memory diagnostic", permission: "VIEW SERVER STATE", does: "Collects operating-system and SQL memory state, buffer behavior, memory grants, clerks, and pressure indicators needed to interpret cache metrics.", read: "Do not judge memory from one ratio. Look for sustained low available memory, pending grants, reduced page life expectancy relative to the workload, and large clerks. Correlate any pressure with query reads and plan behavior before changing max server memory." },
  "compat-160-after-sql-2016-to-2022": { file: "database_compatibility_audit.sql", name: "Database compatibility audit", permission: "VIEW ANY DATABASE or equivalent visibility into sys.databases", does: "Lists compatibility level, expected instance level, collation, AUTO_CLOSE, AUTO_SHRINK, owner, and status for each online user database.", read: "A below-instance compatibility warning is a testing decision, not an instruction to change immediately. Review Auto_Close and Auto_Shrink independently. An orphaned owner is a security and operational issue that should be corrected through an approved owner account." },
  "duplicate-indexes": { file: "duplicate_index_analysis.sql", name: "Duplicate and overlapping index analysis", permission: "VIEW DATABASE STATE on the databases being reviewed", does: "Compares index keys, included columns, filters, constraints, size, and usage to identify exact and near-duplicate candidates.", read: "Separate exact duplicates from merely overlapping indexes. Preserve primary keys, unique constraints, filtered predicates, and indexes used by rare business cycles. Treat generated drop text as a review artifact and validate plans before removing anything." },
  "index-fragmentation": { file: "physical_stats_and_heaps.sql", name: "Physical index and heap review", permission: "VIEW DATABASE STATE", does: "Collects physical statistics, page counts, fragmentation, page density, forwarding behavior, and heap or index conditions that can justify maintenance.", read: "PageCount provides scale. High fragmentation on a tiny index rarely matters. Review AvgPageSpaceUsed or equivalent density indicators with scan behavior. For heaps, forwarding records can signal update-driven movement and may justify a clustered design review." },
  "index-maintenance": { file: "physical_stats_and_heaps.sql", name: "Physical index and heap review", permission: "VIEW DATABASE STATE", does: "Provides the physical evidence needed to decide whether an index needs reorganizing, rebuilding, statistics attention, or no maintenance.", read: "Use page count, density, fragmentation, and workload together. Estimate the log and HA impact before rebuilding large indexes. If poor estimates drive the incident, a statistics action can be more appropriate than a rebuild." },
  "observability-for-dbas": { file: "performance_snapshot.sql", name: "Performance snapshot", permission: "VIEW SERVER STATE", does: "Captures a point-in-time set of workload, waits, sessions, resource, and configuration signals for a repeatable diagnostic baseline.", read: "A snapshot is most valuable when timestamped and compared with a healthy or earlier sample. Match leading waits and resource pressure to active workload. Avoid treating a single quiet or busy moment as the permanent baseline." },
  "parameter-sniffing-triage": { file: "plan_cache_deep_dive.sql", name: "Plan cache diagnostic", permission: "VIEW SERVER STATE", does: "Surfaces high-cost cached plans and plan-cache evidence that can help identify unstable estimates, reuse patterns, and parameter-sensitive workload behavior.", read: "Compare execution count, total and average cost, compiled versus runtime values when available, and estimated versus actual behavior from a reproduced plan. Cache evidence suggests candidates; Query Store is better for historical confirmation." },
  "query-store-forced-plans": { file: "05_forced_plans_monitor.sql", name: "Forced-plan monitor", permission: "VIEW DATABASE STATE with Query Store enabled in the current database", does: "Lists currently forced plans, runtime aggregates, force failures, failure reasons, and Query Store configuration.", read: "Any Force_Failure_Count above zero needs investigation. Compare Avg_Duration_ms and Avg_CPU_ms with alternative plans and confirm that the forced plan still matches the current schema and workload. Record why a plan remains forced." },
  "query-store-regressed-queries": { file: "regressed_queries.sql", name: "Query Store regression diagnostic", permission: "VIEW DATABASE STATE; the optional DBA framework procedure described in the script", does: "Calls the repository regression procedure to compare recent plans with historical baselines and returns regression percentage, plan IDs, text, and forced-plan status.", read: "Start with regressions that have enough executions and high business impact. Compare the recent plan ID with the baseline plan ID, then review duration, CPU, reads, parameter class, and the change window before forcing a plan." },
  "used-unused-indexes": { file: "index_usage_efficiency.sql", name: "Index usage and efficiency review", permission: "VIEW SERVER STATE and VIEW DATABASE STATE", does: "Reports collection-window age, active indexes, read and write activity, size, temperature, and reviewed candidates that may be write-only.", read: "Check the SQL Server start time before interpreting zero reads. Compare Total_Reads with update activity and size. Preserve primary keys and unique constraints, and observe a full business cycle before considering a candidate unused." },
  "reading-wait-stats": { file: "top_server_waits.sql", name: "Top server waits", permission: "VIEW SERVER STATE", does: "Filters common idle waits and returns the top 25 wait types with task count, total, resource and signal wait seconds, average wait, percentage, and a first-line recommendation.", read: "Use PercentOfTotal to find dominant categories, AvgWaitMs to understand per-occurrence severity, and compare SignalWaitSeconds with ResourceWaitSeconds. Because the DMV is cumulative since restart or reset, run delta samples during the problem window for stronger evidence." },
};

const root = path.join(process.cwd(), "content", "blog");
const marker = "## Download and run the diagnostic";

for (const [slug, guide] of Object.entries(guides)) {
  const file = path.join(root, `${slug}.mdx`);
  const parsed = matter(fs.readFileSync(file, "utf8"));
  const current = parsed.content.trim();
  if (current.includes(marker)) continue;
  const section = `${marker}

<div className="sql-download-panel">

**${guide.name}**

<DownloadLink href="/downloads/sql-server-diagnostics/${guide.file}">Download ${guide.file}</DownloadLink>

</div>

### Before you run it

- Run the script first on a non-production or read-only connection when possible.
- Review the complete SQL file before execution and confirm that the connected instance is the intended target.
- Required access: ${guide.permission}.
- Open SQL Server Management Studio or Azure Data Studio, connect to the instance, open the downloaded file, and select **Execute**. Do not run diagnostic scripts through an application login.
- Save the result grid with the server name, collection time, and incident window. DMV output changes over time and often resets after a SQL Server restart.

### What the script does

${guide.does} The download is intended for diagnosis and does not apply an automatic remediation. Read every statement anyway, especially when adapting the script for automation or a different SQL Server version.

<details className="sql-output-guide">
<summary>How to read the output</summary>

${guide.read}

Do not make a production change from one row alone. Correlate the result with workload timing, Query Store or execution plans, Windows and storage evidence, application telemetry, and recent deployments. Capture a second sample after remediation to prove that the intended metric changed without creating a regression elsewhere.

</details>
`;
  fs.writeFileSync(file, matter.stringify(`${current}\n\n${section}\n`, parsed.data));
}

console.log(`Attached SQL guides to ${Object.keys(guides).length} blog posts.`);
