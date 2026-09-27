export type BlogScript = { file: string; title: string; directory?: string; additional?: readonly Omit<BlogScript, "additional">[] };

export const blogScripts: Readonly<Record<string, BlogScript>> = {
  "ai-assisted-sql-from-prompting-to-proof": { file: "top_resource_queries.sql", title: "Top resource-consuming queries" },
  "alert-fatigue": { file: "sql_server_server_health_overview.sql", title: "SQL Server health overview" },
  "always-on-hadr-deployment-checklist": { file: "alwayson_ag_monitor.sql", title: "Availability Group health monitor" },
  "autogrowth-silent-outages": { file: "database_files_growth.sql", title: "Database file growth and utilization" },
  "assessment-to-tickets": { file: "sql_server_server_health_overview.sql", title: "SQL Server health overview" },
  "backup-verification": { file: "backup_verification.sql", title: "Backup history and SLA review" },
  "blocking-chains": { file: "blocking_and_deadlocks.sql", title: "Blocking-chain and deadlock diagnostic" },
  "buffer-cache-hit-ratio": { file: "memory_diagnostics.sql", title: "SQL Server memory diagnostic" },
  "compat-160-after-sql-2016-to-2022": { file: "database_compatibility_audit.sql", title: "Database compatibility audit" },
  "cte-temp-table-breakdown": { file: "tempdb_configuration.sql", title: "TempDB configuration diagnostic" },
  "cutover-checklists": { file: "backup_log_chain.sql", title: "Backup and log-chain review" },
  "duplicate-indexes": { file: "duplicate_index_analysis.sql", title: "Duplicate and overlapping index analysis" },
  "exists-cross-apply-vs-left-join": { file: "top_resource_queries.sql", title: "Top resource-consuming queries" },
  "in-memory-oltp-sql-server-2025": { file: "001_create_db_FG_XTP_tables.sql", title: "Part A: create the SQL Server 2025 In-Memory OLTP lab", directory: "in-memory-oltp-sql2025", additional: [{ file: "002_remove_files_FG_XTP.sql", title: "Part B: remove the XTP container and filegroup", directory: "in-memory-oltp-sql2025" }] },
  "index-fragmentation": { file: "physical_stats_and_heaps.sql", title: "Physical index and heap review" },
  "index-maintenance": { file: "physical_stats_and_heaps.sql", title: "Physical index and heap review" },
  "observability-for-dbas": { file: "performance_snapshot.sql", title: "Performance snapshot" },
  "monitoring-before-migration": { file: "performance_snapshot.sql", title: "Pre-migration performance snapshot" },
  "parameter-sniffing-triage": { file: "plan_cache_deep_dive.sql", title: "Plan cache diagnostic" },
  "postgres-vacuum-debt": { file: "vacuum_debt_diagnostics.sql", title: "PostgreSQL vacuum debt diagnostic", directory: "postgresql-diagnostics" },
  "query-rewrite-basics": { file: "top_resource_queries.sql", title: "Top resource-consuming queries" },
  "query-store-forced-plans": { file: "05_forced_plans_monitor.sql", title: "Forced-plan monitor" },
  "query-store-regressed-queries": { file: "regressed_queries.sql", title: "Query Store regression diagnostic" },
  "query-tuning-iif": { file: "top_resource_queries.sql", title: "Top resource-consuming queries" },
  "reading-wait-stats": { file: "top_server_waits.sql", title: "Top server waits" },
  "sql-server-wait-stats-troubleshooting-guide": { file: "top_server_waits.sql", title: "Top server waits" },
  "schema-drift-reliability": { file: "object_dependencies.sql", title: "Database object dependency inventory" },
  "sql-server-production-install-checklist": { file: "server_configuration_audit.sql", title: "Server configuration audit" },
  "stored-procedures-vs-inline-sql": { file: "stored_procedure_performance_audit.sql", title: "Stored procedure performance audit" },
  "table-variables-small-data": { file: "tempdb_configuration.sql", title: "TempDB configuration diagnostic" },
  "used-unused-indexes": { file: "index_usage_efficiency.sql", title: "Index usage and efficiency review" },
};

export function getBlogScript(slug: string): BlogScript | undefined {
  return blogScripts[slug];
}
