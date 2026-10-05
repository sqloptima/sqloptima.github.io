const doors = [
  {
    id: "front",
    title: "Front door",
    subtitle: "Listener / VPN",
    risk: ["Public or poorly", "firewalled ports"],
    harden: ["Private only", "No internet DB"],
  },
  {
    id: "badge",
    title: "Staff badge",
    subtitle: "Identity",
    risk: ["Stolen password,", "missing MFA"],
    harden: ["Named admins", "Phish-resistant MFA"],
  },
  {
    id: "dock",
    title: "Loading dock",
    subtitle: "Exports / ETL",
    risk: ["BCP, dumps,", "analytics sync"],
    harden: ["Dual-control", "Copy register"],
  },
  {
    id: "keys",
    title: "Master keys",
    subtitle: "Privilege",
    risk: ["DBA, cloud IAM,", "KMS, backup console"],
    harden: ["Separate planes", "HSM / key custody"],
  },
  {
    id: "alley",
    title: "Side alley",
    subtitle: "Supply chain",
    risk: ["Vendor support,", "CI/CD identity"],
    harden: ["Time-boxed PAM", "Recorded sessions"],
  },
] as const;

export function VaultDoorsDiagram() {
  return (
    <figure className="security-section-visual vault-doors-figure">
      <div
        className="vault-doors"
        role="img"
        aria-label="Five doors into a database vault: front door, staff badge, loading dock, master keys, and side alley"
      >
        <p className="vault-doors-kicker">The database is a vault with many doors</p>
        <p className="vault-doors-sub">Disk encryption locks the floor safe — not the person with a badge</p>
        <div className="vault-doors-grid">
          {doors.map((door, index) => (
            <article
              key={door.id}
              className={`vault-door vault-door-${door.id}`}
              style={{ animationDelay: `${index * 90}ms` }}
              tabIndex={0}
            >
              <header className="vault-door-header">
                <strong className="vault-door-title">{door.title}</strong>
                <span className="vault-door-subtitle">{door.subtitle}</span>
              </header>
              <p className="vault-door-risk">
                {door.risk.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="vault-door-label">Harden</p>
              <p className="vault-door-harden">
                {door.harden.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </div>
      <figcaption>
        <strong>Many doors, one vault.</strong> Disk encryption locks the safe. It does not stop someone who already has a badge and walks out with a printout. Hover a door to highlight its text.
      </figcaption>
    </figure>
  );
}
