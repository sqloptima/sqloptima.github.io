import { withBasePath } from "@/lib/paths";

export const metadata = {
  title: "About Ravi Sharma",
  description: "SQL Server and PostgreSQL specialist with more than 18 years of experience in database architecture and operations.",
  alternates: { canonical: "/about/" },
  openGraph: { title: "About Ravi Sharma | SQL Optima", description: "SQL Server and PostgreSQL specialist focused on database architecture, reliability, performance, and operations.", images: [{ url: "/images/about/ravi-sharma-sqloptima-v2.png", alt: "Ravi Sharma, SQL Optima maintainer" }] },
};

export default function AboutPage() {
  return <main className="about-page">
    <section className="about-hero">
      <div className="page-wrap about-hero-grid">
        <div className="about-hero-copy">
          <p className="eyebrow">About Me</p>
          <h1>Ravi Sharma</h1>
          <p>For over 18 years, I&apos;ve specialized in making data platforms reliable.</p>
        </div>
        <figure className="about-portrait">
          <img
            src={withBasePath("/images/about/ravi-sharma-sqloptima-v2.png")}
            alt="Ravi Sharma at his desk with the SQLOptima database engineering blog on screen"
          />
        </figure>
      </div>
    </section>

    <section className="page-wrap about-content">
      <article>
        <h2>Engineering reliable data platforms</h2>
        <p>As a PostgreSQL and SQL Server specialist, my passion lies in tackling the toughest challenges—from architectural design and day-to-day administration to ensuring rock-solid high availability (HA) and executing massive, zero-downtime migrations.</p>
        <p>My career has been built around complex financial and booking platforms, where data correctness isn&apos;t optional; it&apos;s non-negotiable. I understand the unique pressures of these environments: maintaining perfect uptime, ensuring predictable performance, and managing change with absolute care.</p>
        <p>On this blog, I share what I&apos;ve learned in the trenches—practical advice on optimizing SQL queries, mastering database operations, and finding secure, efficient ways to integrate modern tools like AI while keeping your data governed and trustworthy.</p>
      </article>

      <aside className="about-contact">
        <h2>Get in touch</h2>
        <p>Questions, consulting enquiries, and conversations about SQL Server, PostgreSQL, performance, or migrations are welcome.</p>
        <a href="mailto:ravisharma155@gmail.com">ravisharma155@gmail.com</a>
        <a href="mailto:xsrave@gmail.com">xsrave@gmail.com</a>
      </aside>
    </section>
  </main>;
}
