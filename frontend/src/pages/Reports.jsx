import { useState } from "react";
import ExportReport from "../components/ExportReport";

const Reports = ({ summary, customers }) => {
  const [config, setConfig] = useState({
    riskFilter: "All",
    dateFrom: "",
    dateTo: "",
    threshold: "50",
  });

  const handleChange = (field, val) =>
    setConfig((prev) => ({ ...prev, [field]: val }));

  const filtered = customers.filter((c) => {
    if (config.riskFilter !== "All" && c.riskLevel !== config.riskFilter)
      return false;
    if (config.threshold && c.churnProbability * 100 < Number(config.threshold))
      return false;
    return true;
  });

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

  const glass = {
    background: "rgba(17,19,24,0.35)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 22,
  };

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    marginBottom: 10,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        padding: "40px",
        color: "#e8e9f0",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
      }}
    >
      {/* Neon background glow */}
      <div
        style={{
          position: "fixed",
          top: "-120px",
          right: "-120px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(163,230,53,0.18), transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto 28px",
          ...glass,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.7rem" }}>Reports</h1>
        <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.4)" }}>
          Configure export parameters and download filtered churn reports
        </p>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        {/* LEFT PANEL */}
        <div style={glass}>
          <h2 style={{ marginTop: 0, marginBottom: 22 }}>
            Report Configuration
          </h2>

          {/* Risk Filter */}
          <div style={{ marginBottom: 22 }}>
            <div style={labelStyle}>Risk Level Filter</div>

            <div style={{ display: "flex", gap: 8 }}>
              {["All", "High", "Medium", "Low"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleChange("riskFilter", lvl)}
                  style={{
                    padding: "8px 14px",
                    fontSize: "0.8rem",
                    borderRadius: 10,
                    cursor: "pointer",

                    background:
                      config.riskFilter === lvl
                        ? "rgba(163,230,53,0.12)"
                        : "rgba(255,255,255,0.03)",

                    border:
                      config.riskFilter === lvl
                        ? "1px solid rgba(163,230,53,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",

                    color:
                      config.riskFilter === lvl
                        ? "#a3e635"
                        : "rgba(255,255,255,0.5)",
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Threshold */}
          <div style={{ marginBottom: 22 }}>
            <div style={labelStyle}>
              Min Churn Probability:{" "}
              <span style={{ color: "#a3e635", fontFamily: "monospace" }}>
                {config.threshold}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={config.threshold}
              onChange={(e) => handleChange("threshold", e.target.value)}
              style={{ width: "100%", accentColor: "#a3e635" }}
            />
          </div>

          {/* Date */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              ["dateFrom", "Date From"],
              ["dateTo", "Date To"],
            ].map(([field, label]) => (
              <div key={field}>
                <div style={labelStyle}>{label}</div>
                <input
                  type="date"
                  value={config[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e8e9f0",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Preview */}
          <div style={glass}>
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Export Preview</h2>

            {[
              {
                label: "Total Customers",
                value: customers.length,
              },
              {
                label: "Matching Filter",
                value: filtered.length,
                accent: true,
              },
              {
                label: "Churn Rate",
                value: summary ? `${summary.churnRate.toFixed(1)}%` : "—",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  marginBottom: 10,

                  background: item.accent
                    ? "rgba(163,230,53,0.08)"
                    : "rgba(255,255,255,0.03)",

                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    color: item.accent ? "#a3e635" : "#e8e9f0",
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={glass}>
            <h3 style={{ marginTop: 0 }}>Export Actions</h3>

            <button
              onClick={handleExportFiltered}
              disabled={!filtered.length}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 700,

                background: "rgba(163,230,53,0.12)",
                border: "1px solid rgba(163,230,53,0.35)",
                color: "#a3e635",
                marginBottom: 10,
              }}
            >
              ↓ Export Filtered ({filtered.length} rows)
            </button>

            <ExportReport
              summary={summary}
              customers={customers}
              label="Export Full Dataset"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
