import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ContentDocument } from "@/lib/content";
import { withBasePath } from "@/lib/paths";
import { SqlScriptBox } from "@/components/sql-script-box";

// MDX accepts arbitrary public assets; static export deliberately uses native images.
function Image(props: ComponentPropsWithoutRef<"img">) { const src = typeof props.src === "string" ? withBasePath(props.src) : undefined; return <img {...props} alt={props.alt ?? ""} src={src} loading="lazy" />; }
function DownloadLink(props: ComponentPropsWithoutRef<"a">) { const href = typeof props.href === "string" ? withBasePath(props.href) : undefined; return <a {...props} href={href} download />; }
function Acronym({ title, children }: { title: string; children: ReactNode }) { return <abbr className="acronym-tooltip" title={title} data-tooltip={title} tabIndex={0}>{children}</abbr>; }
export function Article({ document, heroImage, sqlScripts, singleLineTitle = false, blogTitle = false }: { document: ContentDocument; heroImage?: string; sqlScripts?: readonly { title: string; filename: string; source: string; directory?: string }[]; singleLineTitle?: boolean; blogTitle?: boolean }) {
  const titleSize = singleLineTitle ? `clamp(.62rem, 3.2vw, ${Math.min(3.2, 80 / document.title.length)}rem)` : undefined;
  return <article className={`article article-${document.slug}${singleLineTitle ? " handbook-article" : ""}${blogTitle ? " blog-article" : ""}`}><p className="eyebrow">{document.category ?? "SQL Optima guide"}</p><h1 style={{ fontSize: titleSize }}>{document.title}</h1><p className="lede">{document.description}</p><time>{document.date}</time>{sqlScripts?.map((script) => <SqlScriptBox key={`${script.directory}/${script.filename}`} {...script} />)}{heroImage && <figure className="article-hero"><img src={withBasePath(heroImage)} alt={`Diagram for ${document.title}`} /><figcaption>{document.title}</figcaption></figure>}<div className="prose"><MDXRemote source={document.source} components={{ img: Image, DownloadLink, Acronym }} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} /></div></article>;
}
