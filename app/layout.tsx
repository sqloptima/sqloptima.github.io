import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_ORIGIN, withBasePath } from "@/lib/paths";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "SQL Optima | Database engineering knowledge", template: "%s | SQL Optima" },
  description: "Free database engineering notes, guides, SQL scripts, and operational checklists.",
  openGraph: { type: "website", siteName: "SQL Optima", title: "SQL Optima", description: "Database engineering notes, guides, and operational checklists." },
  robots: { index: true, follow: true },
};

const nav = [["Handbook", "/handbook/"], ["Blog", "/blog/"], ["Docs", "/docs/"], ["Knowledge Base", "/knowledgebase/"], ["Practice", "/practice/"], ["Search", "/search/"]] as const;
export default function Layout({ children }: { children: React.ReactNode }) {
  const themeScript = `(function(){try{var t=localStorage.getItem('sqloptima-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`;
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><a className="skip" href="#main-content">Skip to content</a><header><div className="wrap nav"><Link className="brand" href="/"><img src={withBasePath("/images/brand/sqloptima-mark.svg")} alt="" width="34" height="34" />SQL Optima</Link><nav aria-label="Primary">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><ThemeToggle /></div></header><div id="main-content">{children}</div><footer><div className="wrap"><strong>SQL Optima</strong><p>Free database engineering notes, guides, and operational checklists.</p><p><a href="https://github.com/rsharma155" target="_blank" rel="noreferrer">GitHub</a> · Educational content only. Review scripts before production use.</p></div></footer></body></html>;
}
