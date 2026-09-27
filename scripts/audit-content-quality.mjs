import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const DEFAULT_COLLECTIONS = ["blog", "handbook", "docs"];
const REQUIRED_FIELDS = ["title", "description", "summary", "date", "published"];

function normalize(value) {
  return value.replace(/\r\n/gu, "\n").replace(/[ \t]+/gu, " ").trim();
}

function splitH2Sections(body) {
  const matches = [...body.matchAll(/^##\s+(.+)$/gmu)];
  if (matches.length === 0) return { preamble: body, sections: [] };

  return {
    preamble: body.slice(0, matches[0].index),
    sections: matches.map((match, index) => {
      const end = matches[index + 1]?.index ?? body.length;
      return {
        heading: match[1].trim(),
        source: body.slice(match.index, end),
      };
    }),
  };
}

export function removeExactDuplicateSections(body) {
  const { preamble, sections } = splitH2Sections(body);
  const seen = new Set();
  let removed = 0;
  const unique = sections.filter((section) => {
    const signature = normalize(section.source);
    if (seen.has(signature)) {
      removed += 1;
      return false;
    }
    seen.add(signature);
    return true;
  });

  return { body: preamble + unique.map((section) => section.source).join(""), removed };
}

export function findDocumentIssues(file, source) {
  const issues = [];
  let parsed;
  try {
    parsed = matter(source);
  } catch (error) {
    return [`${file}: invalid front matter (${error.message})`];
  }

  for (const field of REQUIRED_FIELDS) {
    if (parsed.data[field] === undefined || parsed.data[field] === "") {
      issues.push(`${file}: missing front-matter field '${field}'`);
    }
  }

  const { sections } = splitH2Sections(parsed.content);
  const headings = new Map();
  for (const section of sections) {
    const key = normalize(section.heading).toLowerCase();
    headings.set(key, (headings.get(key) ?? 0) + 1);
  }
  for (const [heading, count] of headings) {
    if (count > 1) issues.push(`${file}: duplicate H2 '${heading}' (${count} occurrences)`);
  }

  const sectionSignatures = new Map();
  for (const section of sections) {
    const key = normalize(section.source);
    sectionSignatures.set(key, (sectionSignatures.get(key) ?? 0) + 1);
  }
  for (const [signature, count] of sectionSignatures) {
    if (count > 1) {
      const heading = signature.match(/^##\s+(.+)$/mu)?.[1] ?? "unknown";
      issues.push(`${file}: exact duplicate section '${heading}' (${count} occurrences)`);
    }
  }

  const localReferences = [...parsed.content.matchAll(/(?:href|src)=["'](\/[^"'#?]+)["']/gu)];
  for (const match of localReferences) {
    const target = path.join(process.cwd(), "public", match[1].replace(/^\//u, ""));
    if (!fs.existsSync(target)) issues.push(`${file}: missing public asset '${match[1]}'`);
  }

  return issues;
}

export function extractEditorialParagraphs(source) {
  const parsed = matter(source);
  const withoutCode = parsed.content.replace(/```[\s\S]*?```/gu, "");
  return withoutCode
    .split(/\n\s*\n/gu)
    .map(normalize)
    .filter((paragraph) => paragraph.length >= 180)
    .filter((paragraph) => !/^(?:#|[-*+] |\d+\. |<|\|)/u.test(paragraph))
    .filter((paragraph) => (paragraph.match(/[.!?](?:\s|$)/gu)?.length ?? 0) >= 2);
}

export function findSharedParagraphs(documents) {
  const occurrences = new Map();
  for (const document of documents) {
    for (const paragraph of new Set(extractEditorialParagraphs(document.source))) {
      const files = occurrences.get(paragraph) ?? [];
      files.push(document.file);
      occurrences.set(paragraph, files);
    }
  }

  return [...occurrences.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([paragraph, files]) => ({ paragraph, files }))
    .sort((a, b) => b.files.length - a.files.length || a.paragraph.localeCompare(b.paragraph));
}

export function removeSharedEditorialParagraphs(source, sharedParagraphs) {
  const parsed = matter(source);
  let content = parsed.content;
  let removed = 0;
  for (const paragraph of sharedParagraphs) {
    const escaped = paragraph.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&").replace(/\s+/gu, "\\s+");
    const pattern = new RegExp(`(?:^|\\n\\s*\\n)${escaped}(?=\\n\\s*(?:\\n|$)|$)`, "gu");
    content = content.replace(pattern, (match) => {
      removed += 1;
      return match.startsWith("\n") ? "\n\n" : "";
    });
  }
  return { body: content.replace(/\n{3,}/gu, "\n\n"), removed };
}

function contentFiles(collections = DEFAULT_COLLECTIONS) {
  return collections.flatMap((collection) => {
    const directory = path.join(process.cwd(), "content", collection);
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory)
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => path.join(directory, name));
  });
}

export function auditContent({ fixExactDuplicates = false, fixSharedBoilerplate = false } = {}) {
  const files = contentFiles();
  const issues = [];
  const documents = [];
  let removed = 0;

  let sharedBeforeFix = [];
  if (fixSharedBoilerplate) {
    const originalDocuments = files.map((absoluteFile) => ({
      file: path.relative(process.cwd(), absoluteFile).replaceAll("\\", "/"),
      source: fs.readFileSync(absoluteFile, "utf8"),
    }));
    sharedBeforeFix = findSharedParagraphs(originalDocuments);
  }

  for (const absoluteFile of files) {
    const relativeFile = path.relative(process.cwd(), absoluteFile).replaceAll("\\", "/");
    let source = fs.readFileSync(absoluteFile, "utf8");

    if (fixExactDuplicates) {
      const parsed = matter(source);
      const result = removeExactDuplicateSections(parsed.content);
      if (result.removed > 0) {
        const frontMatterEnd = source.indexOf("---", 3) + 3;
        const separator = source.slice(frontMatterEnd, source.indexOf(parsed.content, frontMatterEnd));
        source = source.slice(0, frontMatterEnd) + separator + result.body;
        fs.writeFileSync(absoluteFile, source, "utf8");
        removed += result.removed;
      }
    }

    if (fixSharedBoilerplate && sharedBeforeFix.length > 0) {
      const result = removeSharedEditorialParagraphs(source, sharedBeforeFix.map(({ paragraph }) => paragraph));
      if (result.removed > 0) {
        const parsed = matter(source);
        const frontMatterEnd = source.indexOf("---", 3) + 3;
        const separator = source.slice(frontMatterEnd, source.indexOf(parsed.content, frontMatterEnd));
        source = source.slice(0, frontMatterEnd) + separator + result.body;
        fs.writeFileSync(absoluteFile, source, "utf8");
        removed += result.removed;
      }
    }

    issues.push(...findDocumentIssues(relativeFile, source));
    documents.push({ file: relativeFile, source });
  }

  return { files: files.length, issues, removed, sharedParagraphs: findSharedParagraphs(documents) };
}

function run() {
  const fixExactDuplicates = process.argv.includes("--fix-exact-duplicates");
  const fixSharedBoilerplate = process.argv.includes("--fix-shared-boilerplate");
  const result = auditContent({ fixExactDuplicates, fixSharedBoilerplate });
  if (result.removed > 0) console.log(`Removed ${result.removed} exact duplicate section or shared paragraph occurrence(s).`);
  for (const duplicate of result.sharedParagraphs) {
    const excerpt = duplicate.paragraph.slice(0, 90) + (duplicate.paragraph.length > 90 ? "…" : "");
    console.warn(`Editorial warning: paragraph shared by ${duplicate.files.length} files: ${excerpt}`);
    console.warn(`  ${duplicate.files.join(", ")}`);
  }
  if (result.sharedParagraphs.length > 0) {
    result.issues.push(`Shared editorial prose remains in ${result.sharedParagraphs.length} paragraph group(s).`);
  }
  if (result.issues.length > 0) {
    console.error(result.issues.join("\n"));
    console.error(`Content audit failed with ${result.issues.length} issue(s) across ${result.files} files.`);
    process.exitCode = 1;
    return;
  }
  console.log(`Content audit passed for ${result.files} files with ${result.sharedParagraphs.length} editorial warning(s).`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) run();
