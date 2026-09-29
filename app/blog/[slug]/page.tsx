import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/article";
import { getContent, listContent } from "@/lib/content";
import fs from "node:fs";
import path from "node:path";
import { getBlogScript } from "@/lib/blog-scripts";
export const dynamicParams = false;
export function generateStaticParams(){return listContent("blog").map(({slug})=>({slug}))}
const rasterBlogImages=new Set(["ai-assisted-sql-from-prompting-to-proof","sql-server-security-ransomware-resilient-backups"]);
const blogImage=(slug:string)=>`/images/blog/${slug}.${rasterBlogImages.has(slug)?"png":"svg"}`;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const item=getContent("blog",slug);return item?{title:item.title,description:item.description,alternates:{canonical:`/blog/${slug}/`},openGraph:{images:[blogImage(slug)]}}:{title:"Article not found"}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=getContent("blog",slug);if(!item)notFound();const script=getBlogScript(slug);const definitions=script?[script,...(script.additional??[])]:[];const sqlScripts=definitions.map((definition)=>{const directory=definition.directory??"sql-server-diagnostics";return{title:definition.title,filename:definition.file,directory,source:fs.readFileSync(path.join(process.cwd(),"public","downloads",directory,definition.file),"utf8")}});return <Article document={item} heroImage={blogImage(slug)} sqlScripts={sqlScripts} blogTitle/>}
