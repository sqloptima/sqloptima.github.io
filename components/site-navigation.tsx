"use client";

import Link from "next/link";

const links = [
  ["Products", "/#products"],
  ["Knowledge", "/#knowledge"],
  ["Professional help", "/#professional-help"],
  ["Blog", "/blog/"],
  ["About", "/about/"],
] as const;

export function SiteNavigation() {
  return <>
    <nav className="desktop-navigation" aria-label="Primary">
      {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
    </nav>
    <details className="mobile-navigation">
      <summary aria-label="Open navigation">Menu</summary>
      <nav aria-label="Mobile primary">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        <Link href="/handbook/">Handbook</Link>
        <Link href="/docs/">Technical guides</Link>
        <a href="https://github.com/rsharma155" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </details>
  </>;
}
