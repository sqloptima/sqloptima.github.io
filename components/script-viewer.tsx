"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/paths";

export function ScriptViewer({ title, href, language }: { title: string; href: string; language: "sql" | "powershell" }) {
  const assetUrl = withBasePath(href);
  const [source, setSource] = useState("Loading script…");
  const [status, setStatus] = useState("Copy");
  useEffect(() => {
    let active = true;
    fetch(assetUrl).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    }).then((text) => { if (active) setSource(text); }).catch(() => {
      if (active) setSource("The script preview could not be loaded. Use Download to retrieve the file.");
    });
    return () => { active = false; };
  }, [assetUrl]);
  async function copySource() {
    try {
      await navigator.clipboard.writeText(source);
      setStatus("Copied");
      window.setTimeout(() => setStatus("Copy"), 1800);
    } catch { setStatus("Select text to copy"); }
  }
  return <section className="script-viewer" aria-label={`${title} source`}>
    <header><div><strong>{title}</strong><span>{language === "sql" ? "T-SQL" : "PowerShell"}</span></div><div><button type="button" onClick={copySource}>{status}</button><a href={assetUrl} download>Download</a></div></header>
    <pre tabIndex={0}><code>{source}</code></pre>
  </section>;
}
