import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { auditRoute, isAppRouteFile } from "../scripts/audit-static-boundary.mjs";
test("static-only Next configuration is enabled",()=>{const config=fs.readFileSync("next.config.ts","utf8");assert.match(config,/output:\s*["']export["']/u);assert.match(config,/trailingSlash:\s*true/u);assert.match(config,/unoptimized:\s*true/u)});
test("no environment files are tracked by default",()=>{const ignore=fs.readFileSync(".gitignore","utf8");assert.match(ignore,/\.env\*/u)});
test("only App Router entry files are classified as routes",()=>{
  assert.equal(isAppRouteFile("app/page.tsx"),true);
  assert.equal(isAppRouteFile("app/sitemap.ts"),true);
  assert.equal(isAppRouteFile("app/products/[slug]/page.tsx"),true);
  assert.equal(isAppRouteFile("components/home-carousel.tsx"),false);
  assert.equal(isAppRouteFile("lib/products.ts"),false);
});
test("static pages and metadata routes may link to product URLs",()=>{
  assert.deepEqual(auditRoute("app/page.tsx",'export default function Page(){ return <a href="/products/example/">Example</a> }'),[]);
  assert.deepEqual(auditRoute("app/sitemap.ts",'export const dynamic = "force-static"; export default function sitemap(){ return [{url:"/products/example/"}] }'),[]);
});
test("reusable components are outside the route audit",()=>{
  assert.deepEqual(auditRoute("components/home-carousel.tsx",'"use client"; window.setInterval(() => {}, 1000);'),[]);
});
test("route handlers and explicitly dynamic routes are rejected",()=>{
  assert.deepEqual(auditRoute("app/api/report/route.ts","export function GET() {}"),["app/api/report/route.ts: API route handler"]);
  assert.deepEqual(auditRoute("app/report/page.tsx",'export const dynamic = "force-dynamic";'),["app/report/page.tsx: dynamic server runtime"]);
  assert.deepEqual(auditRoute("app/report/page.tsx","export const revalidate = 0;"),["app/report/page.tsx: dynamic server runtime"]);
});
