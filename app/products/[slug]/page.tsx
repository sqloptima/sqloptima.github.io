import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { withBasePath } from "@/lib/paths";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: product.title, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  return <main className="product-page">
    <section className="product-detail-hero">
      <div className="page-wrap product-detail-grid">
        <div className="product-detail-copy">
          <Link className="product-back" href="/#products">← All products</Link>
          <p className="eyebrow">{product.eyebrow}</p>
          <h1>{product.title}</h1>
          <p className="product-detail-lede">{product.introduction}</p>
          <ul className="product-detail-highlights">{product.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          <div className="product-detail-actions">
            {product.release && <a className="product-download" href={product.release} target="_blank" rel="noreferrer">Download v0.0.1 <span aria-hidden>↓</span></a>}
            <a className={product.release ? "product-repository" : "product-download"} href={product.repository} target="_blank" rel="noreferrer">View repository <span aria-hidden>↗</span></a>
          </div>
        </div>
        <div className="product-detail-visual"><img src={withBasePath(product.image)} alt={`${product.title} interface`} /></div>
      </div>
    </section>
    <section className="page-wrap product-capabilities" aria-labelledby="capabilities-title">
      <div className="product-section-heading"><p className="eyebrow">What it helps you do</p><h2 id="capabilities-title">A practical path from signal to action</h2></div>
      <div className="product-capability-grid">{product.capabilities.map((capability, index) => <article key={capability.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{capability.title}</h3><p>{capability.description}</p></article>)}</div>
      <div className="product-next"><p>Explore another sqloptima product or go straight to the source.</p><div><Link href="/#products">Browse products</Link><a href={product.repository} target="_blank" rel="noreferrer">Open on GitHub ↗</a></div></div>
    </section>
  </main>;
}
