import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
test("static-only Next configuration is enabled",()=>{const config=fs.readFileSync("next.config.ts","utf8");assert.match(config,/output:\s*["']export["']/u);assert.match(config,/trailingSlash:\s*true/u);assert.match(config,/unoptimized:\s*true/u)});
test("no environment files are tracked by default",()=>{const ignore=fs.readFileSync(".gitignore","utf8");assert.match(ignore,/\.env\*/u)});
