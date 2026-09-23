import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { listContent } from "@/lib/content";
import { absoluteUrl } from "@/lib/paths";
export const dynamic = "force-static";
export default function sitemap():MetadataRoute.Sitemap{const fixed=["/","/blog/","/handbook/","/docs/","/knowledgebase/","/practice/","/search/"];const dynamic=(['blog','handbook','docs'] as const).flatMap((collection)=>listContent(collection).map((item)=>`/${collection}/${item.slug}/`));const productPages=products.map((product)=>`/products/${product.slug}/`);return [...fixed,...productPages,...dynamic].map((url)=>({url:absoluteUrl(url),changeFrequency:"monthly"}))}
