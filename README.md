# SQL Optima Static

A static-only educational edition of SQL Optima for GitHub Pages. It contains database engineering articles, handbooks, SQL scripts, labs, and checklists. It intentionally excludes pricing, lead capture, authentication, portals, uploads, APIs, analytics, and commercial product pages.

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
