import { CollectionPage } from "@/components/collection-page";
export const metadata = { title: "Blog", description: "Database engineering articles and field notes." };
export default function Page(){return <CollectionPage collection="blog" title="Database engineering blog" intro="Concise field notes on query tuning, reliability, migration, backup, and operations."/>}
