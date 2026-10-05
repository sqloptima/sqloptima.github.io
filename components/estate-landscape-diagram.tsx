const zones = [
  {
    id: "edge",
    title: "Edge path",
    subtitle: "Internet, VPN, firewall",
    risk: ["Coverage is uneven", "Some paths skip controls"],
    harden: ["Know every entry path", "Test from outside"],
  },
  {
    id: "apps",
    title: "Applications",
    subtitle: "Business systems",
    risk: ["App role can read", "almost every table"],
    harden: ["Least privilege", "Per-tenant checks"],
  },
  {
    id: "admins",
    title: "Admins / vendors",
    subtitle: "People with power",
    risk: ["Shared logins", "Standing privilege"],
    harden: ["Named accounts", "Time-boxed access"],
  },
  {
    id: "idp",
    title: "Identity",
    subtitle: "Login system",
    risk: ["Password only", "or weak MFA"],
    harden: ["Phish-resistant MFA", "Short-lived sessions"],
  },
  {
    id: "primary",
    title: "Primary database",
    subtitle: "System of record",
    risk: ["Trusted by apps,", "ETL, and backup tools"],
    harden: ["Private listener", "Scoped DB roles"],
  },
  {
    id: "replicas",
    title: "Replicas / HA",
    subtitle: "Standby copies",
    risk: ["Copy bad writes", "as well as good ones"],
    harden: ["Use for uptime", "Not sole recovery"],
  },
  {
    id: "bi",
    title: "Warehouse / BI",
    subtitle: "Analytics copies",
    risk: ["Weaker controls", "on second copies"],
    harden: ["Track every copy", "Same privacy rules"],
  },
  {
    id: "backups",
    title: "Backups",
    subtitle: "Recovery store",
    risk: ["Same admin domain", "as production"],
    harden: ["Separate admins", "Tested restore"],
  },
  {
    id: "keys",
    title: "Keys",
    subtitle: "Crypto custody",
    risk: ["One admin path", "or provider-only KMS"],
    harden: ["Key recovery tested", "Denial tested too"],
  },
] as const;

export function EstateLandscapeDiagram() {
  return (
    <figure className="security-section-visual estate-landscape-figure">
      <div
        className="estate-landscape"
        role="img"
        aria-label="Typical database estate: edge path, apps, admins, identity, primary database, replicas, analytics, backups, and keys"
      >
        <p className="estate-landscape-kicker">Typical database estate</p>
        <p className="estate-landscape-sub">
          Disk encryption is common. Proof of who can copy, decrypt, or delete recovery is less common.
        </p>
        <div className="estate-landscape-grid">
          {zones.map((zone, index) => (
            <article
              key={zone.id}
              className={`estate-zone estate-zone-${zone.id}`}
              style={{ animationDelay: `${index * 70}ms` }}
              tabIndex={0}
            >
              <header className="estate-zone-header">
                <strong className="estate-zone-title">{zone.title}</strong>
                <span className="estate-zone-subtitle">{zone.subtitle}</span>
              </header>
              <p className="estate-zone-risk">
                {zone.risk.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="estate-zone-label">Watch for</p>
              <p className="estate-zone-harden">
                {zone.harden.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </div>
      <figcaption>
        <strong>Common layout.</strong> Hover a box to highlight its text and the matching row in the table below. Encryption on disk does not answer who can export or wipe recovery.
      </figcaption>
    </figure>
  );
}
