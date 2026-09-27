"use client";

import { useState } from "react";
import { withBasePath } from "@/lib/paths";

export function SqlScriptBox({ title, filename, source, directory = "sql-server-diagnostics" }: { title: string; filename: string; source: string; directory?: string }) {
  const [copied, setCopied] = useState(false);
  const href = withBasePath(`/downloads/${directory}/${filename}`);

  async function copyScript() {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <section className="sql-script-box" aria-labelledby="sql-script-title">
    <div className="sql-script-toolbar">
      <div><span>SQL diagnostic</span><strong id="sql-script-title">{title}</strong><small>{filename}</small></div>
      <div className="sql-script-actions"><button type="button" onClick={copyScript}>{copied ? "Copied" : "Copy script"}</button><a href={href} download>Download .sql</a></div>
    </div>
    <pre tabIndex={0} aria-label={`${title} SQL source`}><code>{source}</code></pre>
    <p>Review the full script and confirm the connected SQL Server instance before execution. The run instructions and output guide appear later in this article.</p>
  </section>;
}
