import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ContentDocument } from "@/lib/content";
import { withBasePath } from "@/lib/paths";

// MDX accepts arbitrary public assets; static export deliberately uses native images.
function Image(props: ComponentPropsWithoutRef<"img">) { const src = typeof props.src === "string" ? withBasePath(props.src) : undefined; return <img {...props} alt={props.alt ?? ""} src={src} loading="lazy" />; }
function DownloadLink(props: ComponentPropsWithoutRef<"a">) { const href = typeof props.href === "string" ? withBasePath(props.href) : undefined; return <a {...props} href={href} download />; }
export function Article({ document }: { document: ContentDocument }) {
  return <article className="article"><p className="eyebrow">{document.category ?? "SQL Optima guide"}</p><h1>{document.title}</h1><p className="lede">{document.description}</p><time>{document.date}</time><div className="prose"><MDXRemote source={document.source} components={{ img: Image, DownloadLink }} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} /></div></article>;
}
