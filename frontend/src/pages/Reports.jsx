import { useState } from "react";
import ExportReport from "../components/ExportReport";

const Reports = ({ summary, customers }) => {
  const [config, setConfig] = useState({
    riskFilter: "All",
    dateFrom: "",
    dateTo: "",
    threshold: "50",
  });

  const filtered = customers.filter((c) => {
    if (config.riskFilter !== "All" && c.riskLevel !== config.riskFilter) return false;
    if (config.threshold && c.churnProbability * 100 < Number(config.threshold)) return false;
    return true;
  });

  const handleChange = (field, val) => setConfig((prev) => ({ ...prev, [field]: val }));

  const handleExportFiltered = () => {
    if (!filtered.length) return;
    const header = ["CustomerID", "Churn Probability (%)", "Risk Level"];
    const rows = filtered.map((c) => [
      c.customerID,
      (c.churnProbability * 100).toFixed(1),
      c.riskLevel,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crim_report_${config.riskFilter}_${config.threshold}pct.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Configure export parameters and download filtered churn reports</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900 }}>
        {/* Config Panel */}
        <div className="card animate-fade-up" style={{ animationDelay: "0ms" }}>
          <h2 style={{ marginBottom: 24 }}>Report Configuration</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Risk Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.07em",
                color: "var(--text-muted)", marginBottom: 8 }}>
                Risk Level Filter
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {["All", "High", "Medium", "Low"].map((lvl) => (
                  <button key={lvl}
                    className="btn btn-secondary"
                    onClick={() => handleChange("riskFilter", lvl)}
                    style={{
                      padding: "7px 14px", fontSize: "0.8rem",
                      background: config.riskFilter === lvl ? "var(--accent-glow)" : "var(--bg-elevated)",
                      borderColor: config.riskFilter === lvl ? "rgba(56,189,248,0.4)" : "var(--border)",
                      color: config.riskFilter === lvl ? "var(--accent)" : "var(--text-muted)",
                    }}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Churn Threshold */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.07em",
                color: "var(--text-muted)", marginBottom: 8 }}>
                Min Churn Probability: <span style={{ color: "var(--accent)", fontFamily: "monospace" }}>
                  {config.threshold}%
                </span>
              </label>
              <input type="range" min="0" max="100" step="5"
                value={config.threshold}
                onChange={(e) => handleChange("threshold", e.target.value)}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>0%</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>100%</span>
              </div>
            </div>

            {/* Date Range */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["dateFrom", "Date From"], ["dateTo", "Date To"]].map(([field, label]) => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    color: "var(--text-muted)", marginBottom: 8 }}>{label}</label>
                  <input type="date" value={config[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    style={{ width: "100%" }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Preview Card */}
          <div className="card animate-fade-up" style={{ animationDelay: "100ms" }}>
            <h2 style={{ marginBottom: 16 }}>Export Preview</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Total Customers", value: customers.length },
                { label: "Matching Filter", value: filtered.length, accent: true },
                { label: "Churn Rate", value: summary ? `${summary.churnRate.toFixed(1)}%` : "—" },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 14px",
                  background: accent ? "var(--accent-glow)" : "var(--bg-elevated)",
                  borderRadius: "var(--radius)",
                  border: `1px solid ${accent ? "rgba(56,189,248,0.2)" : "var(--border-subtle)"}`,
                }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{label}</span>
                  <span style={{
                    fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)",
                    fontFamily: "monospace"
                  }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card animate-fade-up" style={{ animationDelay: "180ms" }}>
            <h3 style={{ marginBottom: 16 }}>Export Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn btn-primary"
                onClick={handleExportFiltered}
                disabled={!filtered.length}
                style={{ justifyContent: "center", padding: 12 }}>
                ↓ Export Filtered Report ({filtered.length} rows)
              </button>
              <ExportReport summary={summary} customers={customers} label="Export Full Dataset" />
            </div>
            {!customers.length && (
              <p style={{ marginTop: 12, fontSize: "0.8rem", textAlign: "center" }}>
                No data loaded. Upload a CSV file first.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;