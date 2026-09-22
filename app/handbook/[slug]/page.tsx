import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/article";
import { getContent, listContent } from "@/lib/content";
export const dynamicParams = false;
export function generateStaticParams(){return listContent("handbook").map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const item=getContent("handbook",slug);return item?{title:item.title,description:item.description,alternates:{canonical:`/handbook/${slug}/`}}:{title:"Guide not found"}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=getContent("handbook",slug);if(!item)notFound();return <Article document={item}/>}
