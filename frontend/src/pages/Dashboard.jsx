import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";
import ExportReport from "../components/ExportReport";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

// Risk colours aligned with the neon theme
const RISK_COLORS = ["#f87171", "#fbbf24", "#a3e635"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(17,19,24,0.95)",
      border: "1px solid rgba(163,230,53,0.20)",
      borderRadius: 10, padding: "10px 14px", fontSize: "0.8rem",
      backdropFilter: "blur(8px)",
    }}>
      {label && <p style={{ color: "rgba(255,255,255,0.38)", marginBottom: 4 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#a3e635", fontWeight: 600, margin: 0 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

// Reusable transparent glass card wrapper
const GlassCard = ({ children, style = {}, delay = 0 }) => (
  <div style={{
    background: "rgba(17,19,24,0.45)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: "24px",
    animation: "fadeUp 0.4s ease both",
    animationDelay: `${delay}ms`,
    ...style,
  }}>
    {children}
  </div>
);

// Stat card — matches the Figma circular-icon style
const StatCard = ({ title, value, sub, accent = false, delay = 0 }) => (
  <div style={{
    background: accent
      ? "rgba(163,230,53,0.07)"
      : "rgba(17,19,24,0.45)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${accent ? "rgba(163,230,53,0.22)" : "rgba(255,255,255,0.07)"}`,
    borderRadius: 16,
    padding: "22px 24px",
    display: "flex", alignItems: "center", gap: 16,
    animation: "fadeUp 0.4s ease both",
    animationDelay: `${delay}ms`,
  }}>
    {/* Circle icon */}
    <div style={{
      width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
      background: accent ? "rgba(163,230,53,0.12)" : "rgba(163,230,53,0.06)",
      border: `1px solid ${accent ? "rgba(163,230,53,0.30)" : "rgba(163,230,53,0.14)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={accent ? "#a3e635" : "rgba(163,230,53,0.6)"} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
    <div>
      <p style={{ margin: "0 0 2px", fontSize: "0.78rem", color: "rgba(255,255,255,0.38)",
        textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
        {title}
      </p>
      <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700,
        color: accent ? "#a3e635" : "#e8e9f0", lineHeight: 1.1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "rgba(255,255,255,0.28)" }}>
          {sub}
        </p>
      )}
    </div>
  </div>
);

const Dashboard = ({ summary, customers, uploadId }) => {
  const [modalCustomer, setModalCustomer] = useState(null);
  const navigate = useNavigate();

  const pieData = summary ? [
    { name: "High Risk",   value: summary.highRisk },
    { name: "Medium Risk", value: summary.mediumRisk },
    { name: "Low Risk",    value: summary.lowRisk },
  ] : [];

  const trendData = summary ? [
    { month: "Jan", churn: +(summary.highRisk * 0.20 + summary.mediumRisk * 0.10).toFixed(1) },
    { month: "Feb", churn: +(summary.highRisk * 0.25 + summary.mediumRisk * 0.10).toFixed(1) },
    { month: "Mar", churn: +(summary.highRisk * 0.30 + summary.mediumRisk * 0.10).toFixed(1) },
    { month: "Apr", churn: +(summary.highRisk * 0.15 + summary.mediumRisk * 0.05).toFixed(1) },
    { month: "May", churn: +(summary.highRisk * 0.20 + summary.mediumRisk * 0.10).toFixed(1) },
    { month: "Jun", churn: +(summary.highRisk * 0.18 + summary.mediumRisk * 0.08).toFixed(1) },
  ] : [];

  const barData = summary ? [
    { risk: "High",   count: summary.highRisk,   fill: "#f87171" },
    { risk: "Medium", count: summary.mediumRisk, fill: "#fbbf24" },
    { risk: "Low",    count: summary.lowRisk,    fill: "#a3e635" },
  ] : [];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Full-bleed dark page */}
      <div style={{
        minHeight: "calc(100vh - 60px)",
        backgroundColor: "#050505",
        position: "relative",
        overflow: "hidden",
        padding: "40px 40px 60px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#e8e9f0",
      }}>

        {/* Ambient glows — same as Upload/Signup pages */}
        <div style={{
          position: "fixed", bottom: "-100px", right: "-100px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(163,230,53,0.18) 0%, rgba(163,230,53,0.04) 50%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "fixed", bottom: "0px", left: "150px",
          width: "350px", height: "350px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(163,230,53,0.10) 0%, transparent 65%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>

          {/* ── Page header ── */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap", gap: 12,
            marginBottom: 36,
            animation: "fadeUp 0.35s ease both",
          }}>
            <div>
              <h1 style={{ margin: "0 0 6px", fontSize: "1.8rem", fontWeight: 700, color: "#e8e9f0" }}>
                Dashboard
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: "0.9rem" }}>
                Customer Retention &amp; Intervention Management
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <ExportReport summary={summary} customers={customers} />
              <button
                onClick={() => navigate("/customers")}
                style={{
                  padding: "9px 18px", fontSize: "0.85rem", fontWeight: 600,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, color: "rgba(255,255,255,0.55)", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(163,230,53,0.35)"; e.currentTarget.style.color = "#a3e635"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
              >
                View All Customers →
              </button>
              <button
                onClick={() => navigate("/uploads")}
                style={{
                  padding: "9px 20px", fontSize: "0.85rem", fontWeight: 700,
                  background: "#a3e635", border: "none",
                  borderRadius: 10, color: "#0a0a0a", cursor: "pointer",
                  letterSpacing: "0.2px",
                }}
              >
                ↑ Upload CSV
              </button>
            </div>
          </div>

          {/* ── Empty state ── */}
          {!summary ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", minHeight: "420px", gap: 16,
              animation: "fadeUp 0.4s ease both",
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(163,230,53,0.06)",
                border: "1px solid rgba(163,230,53,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.2rem", opacity: 0.5,
              }}>◈</div>
              <h2 style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, margin: 0 }}>
                No data loaded
              </h2>
              <p style={{ textAlign: "center", maxWidth: 360, color: "rgba(255,255,255,0.28)",
                fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                Upload a customer CSV file to see churn predictions, risk distribution, and analytics.
              </p>
              <button
                onClick={() => navigate("/uploads")}
                style={{
                  marginTop: 8, padding: "11px 28px", fontSize: "0.9rem", fontWeight: 700,
                  background: "#a3e635", border: "none", borderRadius: 10,
                  color: "#0a0a0a", cursor: "pointer", letterSpacing: "0.2px",
                }}
              >
                ↑ Upload CSV File
              </button>
            </div>
          ) : (
            <>
              {/* ── Stat cards ── */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14, marginBottom: 28,
              }}>
                <StatCard title="Total Customers"    value={summary.totalCustomers.toLocaleString()}          delay={0} />
                <StatCard title="Predicted Churners" value={summary.predictedChurners.toLocaleString()}       delay={60}  accent />
                <StatCard title="Churn Rate"          value={`${summary.churnRate.toFixed(1)}%`}              delay={120} />
                <StatCard title="High Risk"           value={summary.highRisk.toLocaleString()}   sub="customers" delay={180} />
                <StatCard title="Medium Risk"         value={summary.mediumRisk.toLocaleString()} sub="customers" delay={240} />
                <StatCard title="Low Risk"            value={summary.lowRisk.toLocaleString()}    sub="customers" delay={300} />
              </div>

              {/* ── Charts row ── */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16, marginBottom: 28,
              }}>

                {/* Pie — Risk Distribution */}
                <GlassCard delay={200}>
                  <h3 style={{ margin: "0 0 20px", fontSize: "1rem", fontWeight: 700, color: "#e8e9f0" }}>
                    Risk Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%"
                        outerRadius={90} innerRadius={50} paddingAngle={3}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={RISK_COLORS[i]}
                            stroke="rgba(17,19,24,0.8)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend formatter={(val) => (
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>{val}</span>
                      )} />
                    </PieChart>
                  </ResponsiveContainer>
                </GlassCard>

                {/* Line — Churn Trend */}
                <GlassCard delay={260}>
                  <h3 style={{ margin: "0 0 20px", fontSize: "1rem", fontWeight: 700, color: "#e8e9f0" }}>
                    Churn Trend (Monthly)
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#a3e635" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month"
                        tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 12 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 12 }}
                        axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="churn" stroke="#a3e635" strokeWidth={2.5}
                        dot={{ fill: "#a3e635", r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#a3e635", strokeWidth: 0 }}
                        name="Churners" />
                    </LineChart>
                  </ResponsiveContainer>
                </GlassCard>

                {/* Bar — Customers by Risk */}
                <GlassCard delay={320}>
                  <h3 style={{ margin: "0 0 20px", fontSize: "1rem", fontWeight: 700, color: "#e8e9f0" }}>
                    Customers by Risk
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="risk"
                        tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 12 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 12 }}
                        axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Customers" radius={[6, 6, 0, 0]}>
                        {barData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>

              {/* ── Customer table ── */}
              <div style={{ animation: "fadeUp 0.4s ease both", animationDelay: "400ms" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 16,
                }}>
                  <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#e8e9f0" }}>
                    Top Customers by Churn Risk
                  </h2>
                  <button
                    onClick={() => navigate("/customers")}
                    style={{
                      fontSize: "0.8rem", padding: "6px 14px", fontWeight: 600,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 8, color: "rgba(255,255,255,0.45)", cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(163,230,53,0.35)"; e.currentTarget.style.color = "#a3e635"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                  >
                    View all →
                  </button>
                </div>
                <CustomerTable customers={customers} onRowClick={setModalCustomer} />
              </div>
            </>
          )}
        </div>
      </div>

      <CustomerModal
        customer={modalCustomer}
        onClose={() => setModalCustomer(null)}
        uploadId={uploadId}
      />
    </>
  );
};

export default Dashboard;