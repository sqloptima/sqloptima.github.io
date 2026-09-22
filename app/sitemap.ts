import type { MetadataRoute } from "next";
import { listContent } from "@/lib/content";
import { absoluteUrl } from "@/lib/paths";
export const dynamic = "force-static";
export default function sitemap():MetadataRoute.Sitemap{const fixed=["/","/blog/","/handbook/","/docs/","/knowledgebase/","/practice/","/search/"];const dynamic=(['blog','handbook','docs'] as const).flatMap((collection)=>listContent(collection).map((item)=>`/${collection}/${item.slug}/`));return [...fixed,...dynamic].map((url)=>({url:absoluteUrl(url),changeFrequency:"monthly"}))}
