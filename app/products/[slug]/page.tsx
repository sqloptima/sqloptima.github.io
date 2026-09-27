import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { absoluteUrl, withBasePath } from "@/lib/paths";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: product.title, description: product.description, alternates: { canonical: `/products/${product.slug}/` }, openGraph: { title: `${product.title} | SQL Optima`, description: product.description, images: [{ url: product.image, alt: `${product.title} ${product.imageKind}` }] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const structuredData = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: product.title, description: product.description, applicationCategory: "DeveloperApplication", operatingSystem: product.requirements?.[0] ?? "See repository requirements", url: absoluteUrl(`/products/${product.slug}/`), image: absoluteUrl(product.image) };
  return <main className="product-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} />
    <section className="product-detail-hero">
      <div className="page-wrap product-detail-grid">
        <div className="product-detail-copy">
          <Link className="product-back" href="/#products">← All products</Link>
          <p className="eyebrow">{product.eyebrow}</p>
          <h1>{product.title}</h1>
          <p className="product-detail-lede">{product.introduction}</p>
          <ul className="product-detail-highlights">{product.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          <div className="product-detail-actions">
            {product.release && <a className="product-download" href={product.release} target="_blank" rel="noreferrer">{product.releaseLabel ?? "View release"} <span aria-hidden>↓</span></a>}
            <a className={product.release ? "product-repository" : "product-download"} href={product.repository} target="_blank" rel="noreferrer">View repository <span aria-hidden>↗</span></a>
          </div>
        </div>
        <figure className={`product-detail-visual product-${product.imageKind}`}><img src={withBasePath(product.image)} alt={`${product.title} ${product.imageKind}`} /><figcaption><strong>{product.imageKind === "screenshot" ? "Product screenshot" : "Illustration"}</strong>{product.imageCaption}</figcaption></figure>
      </div>
    </section>
    <section className="page-wrap product-capabilities" aria-labelledby="capabilities-title">
      <div className="product-section-heading"><p className="eyebrow">What it helps you do</p><h2 id="capabilities-title">A practical path from signal to action</h2></div>
      <div className="product-capability-grid">{product.capabilities.map((capability, index) => <article key={capability.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{capability.title}</h3><p>{capability.description}</p></article>)}</div>
      {product.facts && <section className="product-readme-section" aria-labelledby="facts-title">
        <div className="product-section-heading"><p className="eyebrow">From the repository</p><h2 id="facts-title">Product facts</h2></div>
        <dl className="product-facts">{product.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
      </section>}
      <section className="product-readme-section" aria-labelledby="support-title">
        <div className="product-section-heading"><p className="eyebrow">Verified scope</p><h2 id="support-title">Support and project status</h2></div>
        <dl className="product-facts"><div><dt>Project status</dt><dd>{product.maturity}</dd></div><div><dt>Engine coverage</dt><dd>{product.engineSupport.map(({ engine, level }) => `${engine}: ${level}`).join(" · ")}</dd></div><div><dt>Last reviewed</dt><dd>{product.verifiedAt}</dd></div><div><dt>Evidence</dt><dd><a href={product.repository} target="_blank" rel="noreferrer">Repository documentation ↗</a></dd></div></dl>
      </section>
      {product.trust && <section className="product-readme-section" aria-labelledby="trust-title">
        <div className="product-section-heading"><p className="eyebrow">Project evidence</p><h2 id="trust-title">Trust and maintenance links</h2></div>
        <div className="product-trust-links">{product.trust.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.label}><strong>{item.label}</strong><span>{item.value ?? "Open on GitHub"}</span><b aria-hidden>↗</b></a>)}</div>
      </section>}
      {product.workflow && <section className="product-readme-section" aria-labelledby="workflow-title">
        <div className="product-section-heading"><p className="eyebrow">How it works</p><h2 id="workflow-title">Typical workflow</h2></div>
        <ol className="product-workflow">{product.workflow.map((step) => <li key={step.title}><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      </section>}
      {(product.requirements || product.quickStart) && <section className="product-readme-section product-get-started" aria-labelledby="start-title">
        <div className="product-section-heading"><p className="eyebrow">Run it yourself</p><h2 id="start-title">Requirements and quick start</h2></div>
        <div className="product-start-grid">
          {product.requirements && <div><h3>Requirements</h3><ul>{product.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></div>}
          {product.quickStart && <div><h3>Quick start</h3>{product.quickStart.map((item) => <div className="product-command" key={item.label}><strong>{item.label}</strong><pre><code>{item.command}</code></pre></div>)}</div>}
        </div>
        <p className="product-source-note">Source: <a href={product.sourcePath ? `${product.repository}${product.sourcePath === "README.md" ? "#readme" : ""}` : product.repository} target="_blank" rel="noreferrer">repository {product.sourcePath ?? "README"} ↗</a>. Check the repository for the latest security notes, configuration options, and release status.</p>
      </section>}
      <div className="product-next"><p>Explore another sqloptima product or go straight to the source.</p><div><Link href="/#products">Browse products</Link><a href={product.repository} target="_blank" rel="noreferrer">Open on GitHub ↗</a></div></div>
    </section>
  </main>;
}
