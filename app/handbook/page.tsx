import { CollectionPage } from "@/components/collection-page";
export const metadata = { title: "Handbook", description: "Production database handbooks and checklists." };
export default function Page(){return <CollectionPage collection="handbook" title="Database handbooks" intro="Long-form operational checklists, tutorials, and practical guidelines for production database work." bannerImage="/images/handbook/database-handbooks-banner.png"/>}
