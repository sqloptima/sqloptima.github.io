# SQL Optima Static

A static-only educational edition of SQL Optima for GitHub Pages. It contains database engineering articles, handbooks, SQL scripts, labs, and checklists. It intentionally excludes pricing, lead capture, authentication, portals, uploads, APIs, analytics, and commercial product pages.

## Featured security guide

The site includes a foundational guide to [SQL Server security and ransomware-resilient backups](content/blog/sql-server-security-ransomware-resilient-backups.mdx). It covers protection for data at rest, in transit, and in use; identity and least privilege; auditing and detection; and isolated, verified recovery.

The article includes:

- a security-coverage matrix and ransomware-readiness checklist;
- original identity, network, encryption, audit, and recovery diagrams under `public/images/blog/security/`;
- accessible hover and keyboard-focus explanations for security acronyms; and
- a clear description of where SQL Optima Backup Manager contributes to recovery without presenting backup as a complete breach-prevention control.

The homepage practice icons also use a lightweight hover animation with a reduced-motion fallback.

## Local development

```powershell
pnpm install
pnpm dev
```

## Verify and export

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm audit:static
pnpm audit:content
$env:NEXT_PUBLIC_BASE_PATH=""
$env:NEXT_PUBLIC_SITE_URL="https://sqloptima.github.io"
pnpm build
```

The static site is written to `out/`. The GitHub Actions workflow builds and deploys that directory; generated output is not committed.

## GitHub Pages setup

In repository **Settings → Pages**, select **GitHub Actions** as the source. With this repository name, the default URL is:

`https://sqloptima.github.io/`

GitHub reserves `OWNER.github.io` root sites for a repository named exactly `OWNER.github.io`. Therefore `https://sqloptima.github.io/` requires ownership of the `sqloptima` GitHub account and a repository named `sqloptima.github.io`, or an independently owned custom domain.

## Content boundary

`scripts/sync-content.mjs` uses an explicit allowlist. Point `SQLOPTIMA_SOURCE` at the production web app directory when synchronizing. The static-boundary audit rejects server runtimes and excluded commercial routes.

All SQL scripts must be reviewed and tested in a non-production environment before use.
