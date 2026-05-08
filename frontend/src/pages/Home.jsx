import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div style={{
      backgroundColor: "#050505",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#e8e9f0",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-5px) rotate(-2deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.18; }
          50%       { opacity: 0.28; }
        }
        .cta-primary:hover { opacity: 0.88; }
        .cta-ghost:hover   { border-color: rgba(163,230,53,0.4) !important; color: #a3e635 !important; }
        .signin-btn:hover  { background: rgba(163,230,53,0.1) !important; }
      `}</style>

      {/* ── Ambient glows ── */}
      <div style={{ position: "fixed", bottom: "-120px", right: "-120px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(163,230,53,0.18) 0%, rgba(163,230,53,0.04) 50%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "0", left: "100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(163,230,53,0.09) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "-200px", right: "200px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(163,230,53,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0, animation: "pulse 4s ease-in-out infinite" }} />

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "16px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        zIndex: 100,
        background: "rgba(5,5,5,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{ fontWeight: 800, fontSize: "17px", letterSpacing: "3px", color: "#a3e635" }}>CRIM</span>
        <div style={{ display: "flex", gap: "10px" }}>
          {token ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="signin-btn"
                style={{ padding: "8px 22px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", letterSpacing: "0.5px" }}
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                style={{ padding: "8px 22px", background: "transparent", border: "1px solid rgba(248,113,113,0.35)", color: "#f87171", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.5px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="signin-btn"
              style={{ padding: "8px 22px", background: "transparent", border: "1px solid rgba(163,230,53,0.45)", color: "#a3e635", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.8px", fontFamily: "inherit", transition: "all 0.2s" }}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "100px 48px 60px",
        gap: "48px",
        maxWidth: "1280px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
        flexWrap: "wrap",
      }}>
        {/* Left copy */}
        <div style={{ flex: "0 0 420px", animation: "fadeUp 0.7s ease both" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", color: "#7a7d9a", fontSize: "10px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", marginBottom: "28px", letterSpacing: "1.8px", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.08)" }}>
            Customer Retention Intelligence Model
          </div>

          <h1 style={{ fontSize: "50px", fontWeight: 800, color: "#fff", lineHeight: 1.08, marginBottom: "20px" }}>
            Predict churn,<br />retain <span style={{ color: "#a3e635" }}>customers.</span>
          </h1>

          <p style={{ fontSize: "15px", color: "#6a6d88", lineHeight: 1.8, marginBottom: "36px", maxWidth: "380px" }}>
            CRIM lets you upload customer data, get instant ML-powered churn predictions, and visualize risk across your entire base — in minutes.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {!token ? (
              <>
                <button
                  className="cta-primary"
                  onClick={() => navigate("/signup")}
                  style={{ padding: "13px 28px", background: "#a3e635", color: "#0a0a0a", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.3px", transition: "opacity 0.2s" }}
                >
                  Upload Data →
                </button>
                <button
                  className="cta-ghost"
                  onClick={() => navigate("/login")}
                  style={{ padding: "13px 28px", background: "transparent", color: "#ccc", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "9px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <button
                  className="cta-primary"
                  onClick={() => navigate("/uploads")}
                  style={{ padding: "13px 28px", background: "#a3e635", color: "#0a0a0a", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.3px", transition: "opacity 0.2s" }}
                >
                  Upload Data →
                </button>
                <button
                  className="cta-ghost"
                  onClick={() => navigate("/dashboard")}
                  style={{ padding: "13px 28px", background: "transparent", color: "#ccc", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "9px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                >
                  View Dashboard
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right — floating mock screens */}
        <div style={{ flex: 1, position: "relative", height: "520px", minWidth: "340px", animation: "fadeUp 0.9s ease 0.15s both" }}>

          {/* Back screen (tilted) */}
          <div style={{
            position: "absolute", top: "20px", right: "-20px",
            width: "380px", height: "240px",
            background: "#0c0e14",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px", overflow: "hidden",
            opacity: 0.55, transform: "rotate(2deg) scale(0.95)",
            animation: "floatSlow 6s ease-in-out infinite 1s",
          }}>
            <div style={{ height: "28px", background: "#090b10", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "5px", padding: "0 10px" }}>
              {["#f87171","#fbbf24","#a3e635"].map(c => <div key={c} style={{ width: "7px", height: "7px", borderRadius: "50%", background: c, opacity: 0.5 }} />)}
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                {[["2,847","#e8e9f0","Customers"],["412","#a3e635","At Risk"],["14.5%","#f87171","Churn"]].map(([v,c,l]) => (
                  <div key={l} style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "8px" }}>
                    <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.25)", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.6px" }}>{l}</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main screen (front) */}
          <div style={{
            position: "absolute", top: "40px", left: 0,
            width: "520px",
            background: "#0c0e14",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px", overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            animation: "float 7s ease-in-out infinite",
          }}>
            {/* Browser bar */}
            <div style={{ height: "32px", background: "#090b10", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" }}>
              <div style={{ display: "flex", gap: "5px" }}>
                {["#f87171","#fbbf24","#a3e635"].map(c => <div key={c} style={{ width: "7px", height: "7px", borderRadius: "50%", background: c, opacity: 0.6 }} />)}
              </div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)", padding: "3px 10px", borderRadius: "4px", letterSpacing: "0.5px" }}>crim.app/dashboard</div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button style={{ fontSize: "9px", padding: "3px 10px", borderRadius: "4px", background: "transparent", border: "1px solid rgba(163,230,53,0.35)", color: "#a3e635", cursor: "default", fontFamily: "inherit" }}>Export</button>
                <button style={{ fontSize: "9px", padding: "3px 10px", borderRadius: "4px", background: "#a3e635", border: "none", color: "#0a0a0a", fontWeight: 700, cursor: "default", fontFamily: "inherit" }}>↑ Upload</button>
              </div>
            </div>

            {/* Dashboard body */}
            <div style={{ padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#e8e9f0", marginBottom: "12px", letterSpacing: "0.5px" }}>Dashboard</div>

              {/* Stat grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "12px" }}>
                {[
                  { label: "Total Customers", val: "2,847", color: "#e8e9f0" },
                  { label: "Predicted Churners", val: "412",   color: "#a3e635" },
                  { label: "Churn Rate",        val: "14.5%", color: "#f87171" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "9px", padding: "10px" }}>
                    <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{s.label}</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "8px", marginBottom: "10px" }}>
                {/* Mini line chart */}
                <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "9px", padding: "10px" }}>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Churn Trend</div>
                  <svg viewBox="0 0 160 60" style={{ width: "100%", height: "60px" }}>
                    <defs>
                      <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a3e635" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#a3e635" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <polyline points="0,50 32,42 64,30 96,36 128,22 160,26" fill="none" stroke="#a3e635" strokeWidth="2"/>
                    <polygon points="0,50 32,42 64,30 96,36 128,22 160,26 160,60 0,60" fill="url(#lg)"/>
                    {[[0,50],[32,42],[64,30],[96,36],[128,22],[160,26]].map(([x,y],i) => (
                      <circle key={i} cx={x} cy={y} r="3" fill="#a3e635"/>
                    ))}
                  </svg>
                </div>

                {/* Mini bar chart */}
                <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "9px", padding: "10px" }}>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>By Risk</div>
                  <svg viewBox="0 0 120 60" style={{ width: "100%", height: "60px" }}>
                    <rect x="10" y="25" width="28" height="35" rx="3" fill="#f87171" fillOpacity="0.85"/>
                    <rect x="46" y="18" width="28" height="42" rx="3" fill="#fbbf24" fillOpacity="0.85"/>
                    <rect x="82" y="5"  width="28" height="55" rx="3" fill="#a3e635" fillOpacity="0.85"/>
                    <text x="24" y="22" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">189</text>
                    <text x="60" y="15" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">223</text>
                    <text x="96" y="2"  textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">2.4k</text>
                  </svg>
                </div>
              </div>

              {/* Mini customer rows */}
              <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "9px", padding: "8px 10px" }}>
                {[
                  { name: "Sarah Johnson",   risk: "High",   pct: "91%", rc: "#f87171", rb: "rgba(248,113,113,0.15)" },
                  { name: "Michael Torres",  risk: "High",   pct: "87%", rc: "#f87171", rb: "rgba(248,113,113,0.15)" },
                  { name: "Emily Chen",      risk: "Medium", pct: "63%", rc: "#fbbf24", rb: "rgba(251,191,36,0.15)" },
                ].map((c, i, arr) => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)" }}>{c.name}</span>
                    <span style={{ fontSize: "7px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", background: c.rb, color: c.rc }}>{c.risk}</span>
                    <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}>{c.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Laptop (bottom-left) */}
          <div style={{
            position: "absolute", bottom: "-20px", left: "-40px",
            width: "280px", zIndex: 2,
            animation: "floatSlow 8s ease-in-out infinite 0.5s",
          }}>
            <div style={{ background: "#0a0c10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px 8px 0 0", padding: "8px", height: "160px", overflow: "hidden" }}>
              <div style={{ background: "#090b10", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "5px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "-8px -8px 8px" }}>
                <span style={{ fontSize: "7px", fontWeight: 800, color: "#a3e635", letterSpacing: "2px" }}>CRIM</span>
                <span style={{ fontSize: "6px", color: "rgba(255,255,255,0.2)" }}>Customers</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {[
                  { name: "Alex Rivera",    pct: "78%", color: "#f87171" },
                  { name: "Dana Kim",       pct: "52%", color: "#fbbf24" },
                  { name: "Jordan Blake",   pct: "21%", color: "#a3e635" },
                  { name: "Casey Morgan",   pct: "89%", color: "#f87171" },
                ].map(r => (
                  <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111318", borderRadius: "5px", padding: "5px 7px" }}>
                    <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.45)" }}>{r.name}</span>
                    <span style={{ fontSize: "8px", fontWeight: 700, color: r.color }}>{r.pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: "14px", background: "#111318", borderRadius: "0 0 4px 4px", border: "1px solid rgba(255,255,255,0.08)", borderTop: "none" }} />
            <div style={{ height: "6px", background: "#0c0e14", borderRadius: "0 0 8px 8px", margin: "0 16px", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none" }} />
          </div>
        </div>
      </div>

      {/* ── Why businesses lose customers ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 40px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "48px 40px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "8px" }}>
            Why businesses lose customers
          </h2>
          <p style={{ fontSize: "13px", color: "#3a3d58", lineHeight: 1.85, textAlign: "center", maxWidth: "580px", margin: "0 auto 0" }}>
            Most small and medium businesses only realize customers are leaving after it's too late. They can't afford expensive CRM systems, their data lives in spreadsheets, and they have no data team. CRIM solves all of that — for free.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginTop: "32px" }}>
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
                  </svg>
                ),
                bg: "rgba(248,113,113,0.1)",
                title: "Expensive CRMs",
                desc: "Enterprise tools cost thousands — out of reach for most SMBs.",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                ),
                bg: "rgba(251,191,36,0.1)",
                title: "Data in Spreadsheets",
                desc: "No structure. No insight. Just rows that don't tell you who's leaving.",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                ),
                bg: "rgba(163,230,53,0.08)",
                title: "No Data Team",
                desc: "Building ML models in-house isn't realistic without dedicated engineers.",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                ),
                bg: "rgba(167,139,250,0.1)",
                title: "Too Late to Act",
                desc: "By the time churn is noticed, the customer is already gone.",
              },
            ].map(item => (
              <div key={item.title} style={{ background: "#050505", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "20px 16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#e0e2f0", marginBottom: "6px" }}>{item.title}</div>
                <div style={{ fontSize: "11px", color: "#3a3d58", lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 40px 80px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "8px" }}>
          How it works
        </h2>
        <p style={{ fontSize: "13px", color: "#5a5d78", textAlign: "center", marginBottom: "40px" }}>
          Four steps from raw CSV to actionable retention insights.
        </p>

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0, alignItems: "flex-start" }}>
          {[
            { step: "1", title: "Upload CSV",    desc: "Import your customer dataset in one click", active: true },
            { step: "2", title: "AI Analyzes",   desc: "ML model scores each customer's churn risk" },
            { step: "3", title: "View Results",  desc: "See risk levels, charts, and profiles" },
            { step: "4", title: "Export Report", desc: "Download findings as PDF or Excel" },
          ].map((s, i, arr) => (
            <div key={s.step} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", width: "160px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: s.active ? "#a3e635" : "#111318",
                  border: s.active ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: s.active ? "#0a0a0a" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", fontWeight: 700, margin: "0 auto 12px",
                }}>
                  {s.step}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#e0e2f0", marginBottom: "5px" }}>{s.title}</div>
                <div style={{ fontSize: "10px", color: "#3a3d58", lineHeight: 1.55 }}>{s.desc}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: "32px", height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 4px 32px", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ textAlign: "center", padding: "0 40px 100px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
          Ready to get started?
        </h2>
        <p style={{ fontSize: "13px", color: "#3a3d58", marginBottom: "28px" }}>
          Upload your customer CSV and see who's at risk in seconds.
        </p>

        {!token ? (
          <button
            className="cta-primary"
            onClick={() => navigate("/signup")}
            style={{ padding: "13px 32px", background: "#a3e635", color: "#0a0a0a", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.3px", transition: "opacity 0.2s" }}
          >
            Get Started — it's free →
          </button>
        ) : (
          <button
            className="cta-primary"
            onClick={() => navigate("/uploads")}
            style={{ padding: "13px 32px", background: "#a3e635", color: "#0a0a0a", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.3px", transition: "opacity 0.2s" }}
          >
            Upload Your Data →
          </button>
        )}
        <div style={{ marginTop: "16px" }}>
          <button
            className="cta-ghost"
            onClick={() => navigate("/model-insights")}
            style={{ padding: "11px 28px", background: "transparent", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "9px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", letterSpacing: "0.3px" }}
          >
            Behind the Predictions →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;