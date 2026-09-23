import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const routeFilePattern = /^(?:page|layout|template|loading|error|global-error|not-found|forbidden|unauthorized|default|route|sitemap|robots|manifest|icon|apple-icon|opengraph-image|twitter-image)\.(?:ts|tsx|js|jsx|mjs)$/u;
const dynamicRuntimePatterns = [
  /export\s+const\s+dynamic\s*=\s*["'`]force-dynamic["'`]/u,
  /export\s+const\s+revalidate\s*=\s*0\b/u,
  /\b(?:cookies|headers|draftMode)\s*\(/u,
  /\b(?:NextRequest|NextResponse)\b/u,
  /["'`]use server["'`]/u,
];

export function isAppRouteFile(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  return normalized.startsWith("app/") && routeFilePattern.test(path.posix.basename(normalized));
}

export function auditRoute(relativePath, source) {
  if (!isAppRouteFile(relativePath)) return [];
  if (/^route\.(?:ts|tsx|js|jsx|mjs)$/u.test(path.basename(relativePath))) return [`${relativePath}: API route handler`];
  if (dynamicRuntimePatterns.some((pattern) => pattern.test(source))) return [`${relativePath}: dynamic server runtime`];
  return [];
}

export function auditStaticBoundary(root) {
  const appRoot = path.join(root, "app");
  if (!fs.existsSync(appRoot)) return [];
  return walk(appRoot)
    .map((file) => path.relative(root, file))
    .filter(isAppRouteFile)
    .flatMap((relativePath) => auditRoute(relativePath, fs.readFileSync(path.join(root, relativePath), "utf8")));
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const failures = auditStaticBoundary(process.cwd());
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log("Static boundary audit passed: App Router entries are static and contain no route handlers.");
}
