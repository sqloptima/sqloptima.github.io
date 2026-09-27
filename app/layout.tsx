import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteNavigation } from "@/components/site-navigation";
import { SITE_ORIGIN, withBasePath } from "@/lib/paths";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "SQL Optima | Monitor. Compare. Recover.", template: "%s | SQL Optima" },
  description: "Database reliability tools, practical SQL guides, scripts, and operational playbooks for SQL Server and PostgreSQL.",
  openGraph: { type: "website", siteName: "SQL Optima", title: "SQL Optima", description: "Database reliability tools and practical operational playbooks." },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const themeScript = `(function(){try{if(localStorage.getItem('sqloptima-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`;
  const footerProducts = [["All products", "/#products"], ["SQL Monitoring", "/products/sql-monitoring/"], ["Schema Compare", "/products/schema-compare/"], ["Migration Toolkit", "/products/migration-toolkit/"]] as const;
  const footerResources = [["GitHub", "https://github.com/rsharma155"], ["Knowledge Base", "/knowledgebase/"], ["Blog", "/blog/"], ["Technical Guides", "/docs/"], ["About Ravi", "/about/"]] as const;
  const footerProject = [["About Ravi", "/about/"], ["Project status", "/#products"], ["Professional help", "/#professional-help"], ["Contact", "mailto:ravisharma155@gmail.com"]] as const;
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><a className="skip" href="#main-content">Skip to content</a><header className="site-header"><div className="page-wrap nav"><Link className="brand" href="/"><img src={withBasePath("/images/brand/sqloptima-mark.svg")} alt="" width="40" height="40" /><span>sqloptima</span></Link><SiteNavigation /><ThemeToggle /><a className="walkthrough" href="https://github.com/rsharma155" target="_blank" rel="noreferrer">View on GitHub</a></div></header><div id="main-content">{children}</div><footer className="heritage-footer"><div className="heritage-art" aria-hidden><img src={withBasePath("/images/footer/heritage-preview.webp")} alt="" /></div><div className="heritage-veil" /><div className="page-wrap footer-content"><div><strong className="footer-name">sqloptima</strong><p>Independent database tools and operational guides for SQL Server and PostgreSQL.</p><a href="mailto:ravisharma155@gmail.com">ravisharma155@gmail.com</a></div><nav aria-label="Footer products"><b>Products</b>{footerProducts.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav><nav aria-label="Footer resources"><b>Knowledge</b>{footerResources.slice(1,4).map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav><nav aria-label="Footer project"><b>Project</b>{footerProject.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav></div><p className="page-wrap copyright">© {new Date().getFullYear()} sqloptima. Built in Nepal. <a href="https://github.com/rsharma155" target="_blank" rel="noreferrer">GitHub ↗</a></p></footer></body></html>;
}
