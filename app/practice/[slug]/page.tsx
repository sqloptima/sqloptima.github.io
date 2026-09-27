import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPracticeArea, practiceAreas } from "@/lib/practices";
import { withBasePath } from "@/lib/paths";

export function generateStaticParams() {
  return practiceAreas.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const area = getPracticeArea((await params).slug);
  if (!area) return {};
  return { title: area.title, description: area.summary, alternates: { canonical: `/practice/${area.slug}/` }, openGraph: { title: `${area.title} | SQL Optima`, description: area.summary, images: [{ url: area.image, alt: `${area.title} database practice` }] } };
}

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const area = getPracticeArea((await params).slug);
  if (!area) notFound();

  return <main className="practice-detail-page">
    <section className="practice-detail-hero">
      <img src={withBasePath(area.image)} alt="" />
      <div className="practice-detail-scrim" />
      <div className="page-wrap practice-detail-copy">
        <Link href="/practice/">← All practice areas</Link>
        <p className="eyebrow">{area.eyebrow}</p>
        <h1>{area.title}</h1>
        <p>{area.introduction}</p>
      </div>
    </section>

    <section className="page-wrap practice-detail-section" aria-labelledby="focus-title">
      <p className="eyebrow">Core focus</p><h2 id="focus-title">What this practice covers</h2>
      <div className="practice-focus-grid">{area.focus.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
    </section>

    <section className="practice-work-band"><div className="page-wrap practice-work-grid">
      <div><p className="eyebrow">Typical work</p><h2>What teams work on</h2><ul>{area.work.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div><p className="eyebrow">Results</p><h2>What good looks like</h2><ul>{area.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </div></section>

    <section className="page-wrap practice-related"><div><p className="eyebrow">Related tools</p><h2>Continue with sqloptima</h2></div><div>{area.relatedProducts.map((product) => <Link href={product.href} key={product.href}>{product.label} →</Link>)}</div></section>
  </main>;
}
