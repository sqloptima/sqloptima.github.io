import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content", "blog");
const outputDir = path.join(process.cwd(), "public", "images", "blog");
fs.mkdirSync(outputDir, { recursive: true });

const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const hash = (value) => [...value].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7);
const palettes = [
  ["#07192d", "#1859d1", "#67d5ff", "#f59e0b"], ["#101827", "#7c3aed", "#c4b5fd", "#22d3ee"],
  ["#062c2b", "#0f766e", "#5eead4", "#fb923c"], ["#26133b", "#be185d", "#f9a8d4", "#38bdf8"],
  ["#172554", "#2563eb", "#93c5fd", "#fbbf24"],
];

function concepts(slug) {
  const words = slug.split("-").filter((word) => !["sql", "server", "for", "vs", "to", "and", "the"].includes(word));
  const labels = words.slice(0, 3).map((word) => word.replace(/^./, (letter) => letter.toUpperCase()));
  while (labels.length < 3) labels.push(["Observe", "Decide", "Verify"][labels.length]);
  return labels;
}

function diagram(kind, labels, colors) {
  const [, primary, light, accent] = colors;
  if (kind === 0) return `<path d="M225 330H515M685 330H975" stroke="${light}" stroke-width="8" stroke-linecap="round"/><path d="m495 310 32 20-32 20M955 310l32 20-32 20" fill="none" stroke="${light}" stroke-width="8"/><g fill="${primary}" stroke="${light}" stroke-width="4"><rect x="90" y="235" width="250" height="190" rx="32"/><rect x="475" y="235" width="250" height="190" rx="32"/><rect x="860" y="235" width="250" height="190" rx="32"/></g>`;
  if (kind === 1) return `<g fill="none" stroke-linecap="round"><path d="M220 440A390 390 0 0 1 980 440" stroke="${primary}" stroke-width="52"/><path d="M220 440A390 390 0 0 1 720 98" stroke="${accent}" stroke-width="52"/><path d="M600 420 845 220" stroke="${light}" stroke-width="14"/><circle cx="600" cy="420" r="38" fill="${primary}" stroke="${light}" stroke-width="8"/></g>`;
  if (kind === 2) return `<g stroke="${light}" stroke-width="5"><ellipse cx="600" cy="165" rx="310" ry="92" fill="${primary}"/><path d="M290 165v150c0 50 139 92 310 92s310-42 310-92V165" fill="${primary}"/><ellipse cx="600" cy="315" rx="310" ry="92" fill="${primary}"/><path d="M290 315v150c0 50 139 92 310 92s310-42 310-92V315" fill="${primary}"/><ellipse cx="600" cy="465" rx="310" ry="92" fill="${primary}"/></g><path d="M825 205h220v250H825" fill="none" stroke="${accent}" stroke-width="14" stroke-linecap="round"/>`;
  if (kind === 3) return `<g fill="${primary}" stroke="${light}" stroke-width="5"><rect x="155" y="125" width="270" height="175" rx="28"/><rect x="775" y="125" width="270" height="175" rx="28"/><rect x="465" y="405" width="270" height="175" rx="28"/></g><path d="M425 213h350M360 300l165 105M840 300 675 405" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round"/><circle cx="600" cy="213" r="24" fill="${accent}"/>`;
  return `<g fill="${primary}" stroke="${light}" stroke-width="5"><rect x="135" y="120" width="390" height="190" rx="28"/><rect x="675" y="390" width="390" height="190" rx="28"/></g><path d="M525 215h145c110 0 90 270 5 270" fill="none" stroke="${accent}" stroke-width="15" stroke-linecap="round"/><path d="m703 455-35 30 35 30" fill="none" stroke="${accent}" stroke-width="12"/><g fill="${light}"><circle cx="235" cy="215" r="24"/><circle cx="305" cy="215" r="24"/><circle cx="375" cy="215" r="24"/><circle cx="775" cy="485" r="24"/><circle cx="845" cy="485" r="24"/><circle cx="915" cy="485" r="24"/></g>`;
}

for (const filename of fs.readdirSync(contentDir).filter((name) => name.endsWith(".mdx"))) {
  const slug = filename.replace(/\.mdx$/u, "");
  if (slug === "ai-assisted-sql-from-prompting-to-proof") continue;
  const parsed = matter(fs.readFileSync(path.join(contentDir, filename), "utf8"));
  const title = String(parsed.data.title);
  const seed = hash(slug);
  const colors = palettes[seed % palettes.length];
  const labels = concepts(slug);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">Technical diagram illustrating ${escape(labels.join(", "))}</desc><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern></defs><rect width="1200" height="675" fill="url(#bg)"/><rect width="1200" height="675" fill="url(#grid)"/>${diagram(seed % 5, labels, colors)}<g fill="#fff" font-family="Segoe UI,Arial,sans-serif" font-weight="700" text-anchor="middle"><text x="215" y="640" font-size="28">${escape(labels[0])}</text><text x="600" y="640" font-size="28">${escape(labels[1])}</text><text x="985" y="640" font-size="28">${escape(labels[2])}</text></g><circle cx="1085" cy="82" r="32" fill="${colors[3]}"/><path d="M1070 82h30M1085 67v30" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>`;
  fs.writeFileSync(path.join(outputDir, `${slug}.svg`), svg);
}

console.log(`Generated blog diagrams in ${outputDir}`);
