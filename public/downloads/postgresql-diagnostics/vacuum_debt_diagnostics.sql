/* PostgreSQL vacuum debt diagnostics. Read-only. */
SELECT
    current_database() AS database_name,
    schemaname,
    relname AS table_name,
    n_live_tup,
    n_dead_tup,
    round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_tuple_pct,
    last_vacuum,
    last_autovacuum,
    vacuum_count,
    autovacuum_count,
    last_analyze,
    last_autoanalyze,
    n_mod_since_analyze,
    age(c.relfrozenxid) AS xid_age,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
    CASE
        WHEN age(c.relfrozenxid) > 1000000000 THEN 'CRITICAL: transaction ID age'
        WHEN n_dead_tup > 1000000 AND 100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0) >= 20 THEN 'HIGH: large dead-tuple backlog'
        WHEN n_dead_tup > 100000 AND 100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0) >= 10 THEN 'REVIEW: vacuum may not keep pace'
        ELSE 'Observe in workload context'
    END AS review_status
FROM pg_stat_user_tables AS s
JOIN pg_class AS c ON c.relname = s.relname
JOIN pg_namespace AS n ON n.oid = c.relnamespace AND n.nspname = s.schemaname
ORDER BY age(c.relfrozenxid) DESC, n_dead_tup DESC;

-- Long transactions can hold back vacuum cleanup.
SELECT
    pid, usename, datname, state, xact_start,
    now() - xact_start AS transaction_age,
    wait_event_type, wait_event,
    left(query, 300) AS query_text
FROM pg_stat_activity
WHERE xact_start IS NOT NULL AND pid <> pg_backend_pid()
ORDER BY xact_start;
