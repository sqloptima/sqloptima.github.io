import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_ORIGIN, withBasePath } from "@/lib/paths";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "SQL Optima | Monitor. Compare. Recover.", template: "%s | SQL Optima" },
  description: "Open database reliability tools, practical SQL guides, scripts, and operational playbooks for SQL Server and PostgreSQL.",
  openGraph: { type: "website", siteName: "SQL Optima", title: "SQL Optima", description: "Open database reliability tools and practical operational playbooks." },
  robots: { index: true, follow: true },
};

const nav = [["Products", "/#products"], ["Solutions", "/#solutions"], ["Services", "/#services"], ["Handbook", "/handbook/"], ["Blog", "/blog/"], ["Docs", "/docs/"]] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const themeScript = `(function(){try{if(localStorage.getItem('sqloptima-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`;
  const footerProducts = [["Products", "/#products"], ["Solutions", "/#solutions"], ["Services", "/#services"], ["Handbook", "/handbook/"]] as const;
  const footerResources = [["GitHub", "https://github.com/rsharma155"], ["Knowledge Base", "/knowledgebase/"], ["Blog", "/blog/"], ["Docs", "/docs/"]] as const;
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><a className="skip" href="#main-content">Skip to content</a><header className="site-header"><div className="page-wrap nav"><Link className="brand" href="/"><img src={withBasePath("/images/brand/sqloptima-mark.svg")} alt="" width="40" height="40" /><span>sqloptima</span></Link><nav aria-label="Primary">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><ThemeToggle /><a className="walkthrough" href="https://github.com/rsharma155" target="_blank" rel="noreferrer">View on GitHub</a></div></header><div id="main-content">{children}</div><footer className="heritage-footer"><div className="heritage-art" aria-hidden><img src={withBasePath("/images/footer/heritage-preview.webp")} alt="" /></div><div className="heritage-veil" /><div className="page-wrap footer-content"><div><strong className="footer-name">sqloptima</strong><p>Monitor. Compare. Recover.</p><a href="mailto:hello@sqloptima.net">hello@sqloptima.net</a></div><nav aria-label="Footer products"><b>Product</b>{footerProducts.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav><nav aria-label="Footer resources"><b>Resources</b>{footerResources.map(([label,href])=><a key={href} href={href}>{label}</a>)}</nav></div><p className="page-wrap copyright">© {new Date().getFullYear()} sqloptima. Built in Nepal.</p></footer></body></html>;
}
