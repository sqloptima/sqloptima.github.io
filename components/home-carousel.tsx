"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/paths";

const slides = [
  { eyebrow: "sqloptima", title: "Monitor. Compare. Recover.", lede: "Database reliability software for SQL Server and PostgreSQL — monitoring, schema compare, migration, backup, and assessment.", highlights: ["See the workload clearly", "Ship the schema you meant", "Recover on a plan you rehearsed"], image: "/images/home/hero-banner-v2.png", href: "#products", cta: "Explore products" },
  { eyebrow: "Product", title: "SQL Monitoring", lede: "Health and performance telemetry for SQL Server and PostgreSQL.", highlights: ["Live health and wait signals", "Rule-based checks", "Actionable query triage"], image: "/images/monitoring/sqlserver-dashboard.png", href: "https://github.com/rsharma155/sql_optima", cta: "Explore SQL Monitoring" },
  { eyebrow: "Product", title: "Schema Compare", lede: "Diff procedures, indexes, and tables across environments.", highlights: ["Windows GUI", "Cross-platform CLI", "Review drift before release"], image: "/images/products/sql-optima-schema-compare-hero.png", href: "https://github.com/rsharma155/sqloptima_compare", cta: "Explore Schema Compare" },
  { eyebrow: "Product", title: "Migration Toolkit", lede: "Move from SQL Server to PostgreSQL on a plan you rehearsed.", highlights: ["Procedure conversion", "Function conversion", "Cutover guidance"], image: "/images/products/sql-optima-migration-hero.png", href: "https://github.com/rsharma155/sqloptima_migration", cta: "Explore Migration Toolkit" },
  { eyebrow: "Product", title: "Assessment Generator", lede: "Turn SQL Server and PostgreSQL evidence into clear health reports.", highlights: ["Quick, Standard, and Deep", "Severity-scored findings", "HTML and PDF reports"], image: "/images/products/dba-handbook-hero.png", href: "https://github.com/rsharma155/dba_handbook", cta: "Explore Assessment Generator" },
  { eyebrow: "Product", title: "Backup Manager", lede: "Open-source SQL Server backup operations for Windows.", highlights: ["FULL / DIFF / LOG chains", "Restore confidence", "Web operations console"], image: "/images/products/sqloptima-backup-pro-hero.png", href: "https://github.com/rsharma155/sqloptima_backup", cta: "Explore Backup Manager" },
  { eyebrow: "Product", title: "DBA Handbook", lede: "Checklists, scripts, and reports for live SQL Server and PostgreSQL.", highlights: ["Production playbooks", "Portable guidance", "Ready-to-run scripts"], image: "/images/handbook/knowledgebase-hero.png", href: "https://github.com/rsharma155/dba_handbook", cta: "Explore DBA Handbook" },
  { eyebrow: "Product", title: "HA Cluster Lab", lede: "Practice failover with PostgreSQL and SQL Server side by side.", highlights: ["Patroni PostgreSQL", "SQL Server cluster", "Repeatable failover traffic"], image: "/images/monitoring/postgres-dashboard.png", href: "https://github.com/rsharma155/sqlserver_postgres_ha_cluster", cta: "Explore HA Cluster Lab" },
] as const;

const quotes = [
  "Watch SQL Server and PostgreSQL health, catch the slow query, and triage it before the incident grows.",
  "Compare procedures, indexes, and tables across environments so a release ships the schema you meant.",
  "Move from SQL Server to PostgreSQL with procedures and functions converted, then cut over on a plan you rehearsed.",
  "Assess the estate, back up what you can restore, and practice failover before the night you need it.",
  "Keep the handbook open beside the work: free tools for the daily jobs, and a workshop when you want someone in it with you.",
] as const;

export function HomeCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);
  const slide = slides[index];
  return <section className="source-hero" aria-roledescription="carousel" aria-label="sqloptima products" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <img key={slide.image} className="carousel-image" src={withBasePath(slide.image)} alt="" />
    <div className="source-hero-scrim" />
    <div className="source-hero-copy"><span className="source-pill">{slide.eyebrow}</span><h1 id="home-title">{slide.title}</h1><p>{slide.lede}</p><ul>{slide.highlights.map((item)=><li key={item}>{item}</li>)}</ul><a href={slide.href}>{slide.cta} <span aria-hidden>→</span></a></div>
    <div className="carousel-controls"><div className="carousel-dots">{slides.map((item, slideIndex)=><button key={item.title} type="button" className={slideIndex === index ? "active" : ""} onClick={()=>setIndex(slideIndex)} aria-label={`Go to ${item.title}`} aria-current={slideIndex === index ? "true" : undefined} />)}<span>{String(index+1).padStart(2,"0")} / {String(slides.length).padStart(2,"0")}</span></div><div><button type="button" onClick={()=>setIndex((index-1+slides.length)%slides.length)} aria-label="Previous slide">‹</button><button type="button" onClick={()=>setPaused(!paused)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>{paused ? "▶" : "Ⅱ"}</button><button type="button" onClick={()=>setIndex((index+1)%slides.length)} aria-label="Next slide">›</button></div></div>
  </section>;
}

export function RotatingQuote() {
  const [index, setIndex] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setIndex((value)=>(value+1)%quotes.length), 4000); return () => window.clearInterval(timer); }, []);
  return <blockquote className="rotating-quote" aria-live="polite"><span className="quote-index">{String(index+1).padStart(2,"0")} <i>/ {String(quotes.length).padStart(2,"0")}</i></span><q key={quotes[index]}>{quotes[index]}</q><span className="quote-meter" key={index} /></blockquote>;
}
