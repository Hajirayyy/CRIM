import { useEffect } from "react";

const getRiskStyle = (level) => {
  if (level === "High")   return { color: "var(--high)",   bg: "var(--high-bg)" };
  if (level === "Medium") return { color: "var(--medium)", bg: "var(--medium-bg)" };
  return { color: "var(--low)", bg: "var(--low-bg)" };
};

const CustomerModal = ({ customer, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!customer) return null;

  const risk = getRiskStyle(customer.riskLevel);
  const pct = (customer.churnProbability * 100).toFixed(1);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          width: "100%",
          maxWidth: "460px",
          animation: "fadeUp 0.25s ease",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "4px" }}>
              Customer Details
            </p>
            <h2 style={{ fontSize: "1.4rem" }} className="mono">#{customer.customerID}</h2>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: "6px 12px" }}>✕</button>
        </div>

        {/* Churn Meter */}
        <div style={{
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius)",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid var(--border-subtle)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Churn Probability</span>
            <span className="mono" style={{ fontSize: "1.2rem", fontWeight: 700, color: risk.color }}>
              {pct}%
            </span>
          </div>
          <div style={{ height: 10, background: "var(--border)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${risk.color}88, ${risk.color})`,
              borderRadius: 5,
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>

        {/* Risk Badge */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: risk.bg,
          border: `1px solid ${risk.color}33`,
          borderRadius: "var(--radius)",
          marginBottom: "24px",
        }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Risk Level</span>
          <span style={{
            fontWeight: 700, fontSize: "0.875rem",
            color: risk.color, textTransform: "uppercase", letterSpacing: "0.05em"
          }}>{customer.riskLevel}</span>
        </div>

        <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", textAlign: "center" }}>
          Press <kbd style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: "0.75rem"
          }}>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};

export default CustomerModal;