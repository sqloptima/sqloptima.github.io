const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
export const BASE_PATH = rawBasePath ? `/${rawBasePath.replace(/^\/+|\/+$/gu, "")}` : "";
export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://rsharma155.github.io/sqloptima-static").replace(/\/$/u, "");

export function withBasePath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${BASE_PATH}${path}`;
}

export function absoluteUrl(pathname: string): string {
  return `${SITE_ORIGIN}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
