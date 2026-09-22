import { Search } from "@/components/search";
export const metadata = { title: "Search", description: "Search SQL Optima's static educational resources." };
export default function Page(){return <main className="wrap section"><p className="eyebrow">Static search</p><h1>Find a guide</h1><p className="lede">Search runs entirely in your browser. No query is sent to a server.</p><Search/></main>}
