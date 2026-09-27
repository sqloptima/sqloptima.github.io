import assert from "node:assert/strict";
import test from "node:test";
import {
  findSharedParagraphs,
  findDocumentIssues,
  removeSharedEditorialParagraphs,
  removeExactDuplicateSections,
} from "../scripts/audit-content-quality.mjs";

const frontMatter = `---
title: Example
description: Example description
summary: Example summary
date: 2026-09-27
published: true
---
`;

test("content audit identifies duplicate H2 headings and sections", () => {
  const section = "## Evidence to collect\n\nKeep the sample.\n\n";
  const issues = findDocumentIssues("content/blog/example.mdx", frontMatter + section + section);
  assert.ok(issues.some((issue) => issue.includes("duplicate H2 'evidence to collect'")));
  assert.ok(issues.some((issue) => issue.includes("exact duplicate section 'Evidence to collect'")));
});

test("exact duplicate repair preserves the first section and unique sections", () => {
  const duplicate = "## Evidence\n\nKeep this paragraph.\n\n";
  const unique = "## Next step\n\nDo the next thing.\n";
  const result = removeExactDuplicateSections(`Opening.\n\n${duplicate}${unique}${duplicate}`);
  assert.equal(result.removed, 1);
  assert.equal(result.body, `Opening.\n\n${duplicate}${unique}`);
});

test("content audit reports missing required metadata", () => {
  const issues = findDocumentIssues("content/blog/example.mdx", "---\ntitle: Example\n---\nBody");
  assert.ok(issues.some((issue) => issue.includes("missing front-matter field 'description'")));
});

test("content audit inventories long prose shared across documents", () => {
  const paragraph = "This deliberately long paragraph represents editorial boilerplate repeated across unrelated articles. It contains enough detail to pass the audit threshold, but its repeated wording makes the collection sound templated. Reviewers should replace it with evidence specific to each article.";
  const shared = findSharedParagraphs([
    { file: "one.mdx", source: `${frontMatter}\n${paragraph}` },
    { file: "two.mdx", source: `${frontMatter}\n${paragraph}` },
  ]);
  assert.equal(shared.length, 1);
  assert.deepEqual(shared[0].files, ["one.mdx", "two.mdx"]);
});

test("shared boilerplate repair removes only exact editorial paragraphs", () => {
  const repeated = "This deliberately long paragraph represents editorial boilerplate repeated across unrelated articles. It contains enough detail to pass the audit threshold, but its repeated wording makes the collection sound templated. Reviewers should replace it with evidence specific to each article.";
  const unique = "A short, topic-specific observation stays in the article.";
  const result = removeSharedEditorialParagraphs(`${frontMatter}\n${unique}\n\n${repeated}\n`, [repeated]);
  assert.equal(result.removed, 1);
  assert.ok(result.body.includes(unique));
  assert.ok(!result.body.includes(repeated));
});
