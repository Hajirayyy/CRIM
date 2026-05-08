import { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:8000/api";

const getRiskStyle = (level) => {
  if (level === "High") {
    return { color: "#f87171", glow: "rgba(248,113,113,0.18)" };
  }
  if (level === "Medium") {
    return { color: "#fbbf24", glow: "rgba(251,191,36,0.18)" };
  }
  return { color: "#a3e635", glow: "rgba(163,230,53,0.18)" };
};

const formatFeatureName = (name) => {
  if (name.includes("_")) {
    const [base, ...rest] = name.split("_");
    return `${base.replace(/([A-Z])/g, " $1").trim()}: ${rest.join(" ")}`;
  }
  return name.replace(/([A-Z])/g, " $1").trim();
};

const ShapBar = ({ feature, shapValue, value }) => {
  const isPositive = shapValue > 0;
  const maxBar = 100;
  const barWidth = Math.min(Math.abs(shapValue) * 400, maxBar);
  const color = isPositive ? "#f87171" : "#34d399";

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: "0.82rem", color: "#e8e9f0" }}>
          {formatFeatureName(feature)}
        </span>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
          {typeof value === "number" ? value.toFixed(2) : value}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: maxBar, display: "flex", justifyContent: "flex-end" }}>
          {!isPositive && (
            <div style={{
              height: 7,
              width: barWidth,
              background: color,
              borderRadius: 6,
              opacity: 0.85,
            }} />
          )}
        </div>

        <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />

        <div style={{ width: maxBar }}>
          {isPositive && (
            <div style={{
              height: 7,
              width: barWidth,
              background: color,
              borderRadius: 6,
              opacity: 0.85,
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

const CustomerModal = ({ customer, onClose, uploadId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const risk = getRiskStyle(customer?.riskLevel || "Low");

  const glassCard = {
    background: "rgba(10,10,10,0.35)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid rgba(255,255,255,0.06)`,
    borderRadius: 16,
    padding: 20,
    boxShadow: `0 0 0 1px ${risk.glow}`,
  };

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!customer || customer.riskLevel === "Low") return;

    setLoading(true);
    fetch(`${BASE_URL}/recommendations/${uploadId}/${customer.customerID}`)
      .then((r) => r.json())
      .then((d) => setRecommendations(d.recommendations || []))
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false));
  }, [customer?.customerID, uploadId]);

  if (!customer) return null;

  const pct = (customer.churnProbability * 100).toFixed(1);
  const shap = customer.shapExplanation || [];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)", // darker cinematic overlay
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        overflowY: "auto",
        padding: "50px 20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 920,

            // 👇 MAIN MODAL FIX
            background: "rgba(17,19,24,0.35)", // MUCH lighter than before
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",

            border: `1px solid rgba(163,230,53,0.10)`,
            boxShadow: `0 0 40px rgba(0,0,0,0.6), 0 0 60px ${risk.glow}`,

            borderRadius: 20,
            padding: 32,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 26 }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
                Customer Details
              </div>
              <h2 style={{ color: "#e8e9f0", margin: 0 }}>
                #{customer.customerID}
              </h2>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = risk.color;
                e.currentTarget.style.color = risk.color;
                e.currentTarget.style.boxShadow = `0 0 18px ${risk.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              ✕
            </button>
          </div>

          {/* Top Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={glassCard}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                Churn Probability
              </div>

              <div style={{ fontSize: "1.8rem", color: risk.color, margin: "10px 0" }}>
                {pct}%
              </div>

              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 6 }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: risk.color,
                    borderRadius: 6,
                    boxShadow: `0 0 12px ${risk.glow}`,
                  }}
                />
              </div>
            </div>

            <div style={{ ...glassCard, display: "flex", alignItems: "center" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                  Risk Level
                </div>
                <div style={{ fontSize: "1.4rem", color: risk.color, marginTop: 8 }}>
                  {customer.riskLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            
            {/* SHAP */}
            <div style={glassCard}>
              <h3 style={{ color: "#e8e9f0", marginTop: 0, marginBottom: 16 }}>
                Why this prediction?
              </h3>

              {shap.map((s, i) => (
                <ShapBar key={i} {...s} />
              ))}
            </div>

            {/* Recommendations */}
            <div style={glassCard}>
              <h3 style={{ color: "#e8e9f0", marginTop: 0, marginBottom: 6 }}>
                Retention Recommendations
              </h3>

              <div style={{ marginBottom: 16, color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
                AI-driven actions to reduce churn risk
              </div>

              {loading ? (
                <div style={{ color: risk.color }}>Generating...</div>
              ) : (
                <ol style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
                  {recommendations.map((r, i) => (
                    <li key={i} style={{ color: "#e8e9f0", marginBottom: 10 }}>
                      {r}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;