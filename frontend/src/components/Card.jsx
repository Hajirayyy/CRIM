const Card = ({ title, value, sub, accent = false, delay = 0 }) => (
  <div
    className="card animate-fade-up"
    style={{
      animationDelay: `${delay}ms`,
      background: accent
        ? "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(99,102,241,0.08))"
        : "var(--bg-card)",
      borderColor: accent ? "rgba(56,189,248,0.3)" : "var(--border-subtle)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {accent && (
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80,
        background: "radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%)",
        borderRadius: "50%",
      }} />
    )}
    <p style={{
      fontSize: "0.7rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--text-muted)",
      marginBottom: "10px",
    }}>{title}</p>
    <p style={{
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.03em",
      color: accent ? "var(--accent)" : "var(--text)",
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: 1,
      marginBottom: sub ? "6px" : 0,
    }}>{value}</p>
    {sub && <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{sub}</p>}
  </div>
);

export default Card;