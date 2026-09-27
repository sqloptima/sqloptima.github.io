import Link from "next/link";
import { practiceAreas } from "@/lib/practices";
import { withBasePath } from "@/lib/paths";

export const metadata = { title: "Practice Areas", description: "Database engineering, operations, training, consulting, and AI practice areas." };

export default function Page() {
  return <main className="wrap section practice-index">
    <p className="eyebrow">Practice areas</p>
    <h1>Database work across the full lifecycle</h1>
    <p className="lede">Explore focused guidance for development, production operations, security, availability, performance, learning, consulting, and governed AI access.</p>
    <div className="practice-index-grid">{practiceAreas.map((area) => <Link className="practice-index-card" href={`/practice/${area.slug}/`} key={area.slug}>
      <img src={withBasePath(area.image)} alt="" />
      <span><strong>{area.title}</strong><small>{area.summary}</small><b>Explore this practice →</b></span>
    </Link>)}</div>
  </main>;
}
