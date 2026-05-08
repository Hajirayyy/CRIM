import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Animation hook
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// Design tokens
const G = {
  accent:       "#a3e635",
  accentDim:    "rgba(163,230,53,0.12)",
  accentBorder: "rgba(163,230,53,0.25)",
  bg:           "#050505",
  card:         "rgba(17,19,24,0.60)",
  cardBorder:   "rgba(255,255,255,0.07)",
  textPrimary:  "#f0f0f0",
  textMuted:    "rgba(255,255,255,0.40)",
  textSub:      "rgba(255,255,255,0.62)",
  radius:       "14px",
  blur:         "blur(14px)",
};

const glassCard = {
  background:         G.card,
  border:             `1px solid ${G.cardBorder}`,
  borderRadius:       G.radius,
  backdropFilter:     G.blur,
  WebkitBackdropFilter: G.blur,
};

const sectionTitle = {
  fontSize:   "clamp(1.4rem, 2.5vw, 1.9rem)",
  fontWeight: 700,
  color:      G.textPrimary,
  margin:     "0 0 6px",
  fontFamily: "'Syne', 'Segoe UI', sans-serif",
};

const sectionSub = {
  fontSize:  "0.95rem",
  color:     G.textMuted,
  margin:    "0 0 40px",
  lineHeight: 1.7,
  maxWidth:  560,
};

// SVG icon library
const Ico = ({ d, size = 22, color = "rgba(163,230,53,0.75)", vb = "0 0 24 24", fill = "none" }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill}
    stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

// Individual named icons used throughout the page
const Icons = {
  robot: (s) => (
    <Ico size={s} d={<>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M12 11V7" /><circle cx="12" cy="5" r="2" />
      <line x1="7" y1="15" x2="7" y2="15" strokeWidth="2.5" />
      <line x1="12" y1="15" x2="12" y2="15" strokeWidth="2.5" />
      <line x1="17" y1="15" x2="17" y2="15" strokeWidth="2.5" />
    </>} />
  ),
  dataset: (s) => (
    <Ico size={s} d={<>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 9v4c0 1.66 4.03 3 9 3s9-1.34 9-3V9" />
      <path d="M3 13v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4" />
    </>} />
  ),
  users: (s) => (
    <Ico size={s} d={<>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>} />
  ),
  trendDown: (s) => (
    <Ico size={s} d={<>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </>} />
  ),
  target: (s) => (
    <Ico size={s} d={<>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>} />
  ),
  activity: (s) => (
    <Ico size={s} d={<>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </>} />
  ),
  // step icons
  filter: (s) => (
    <Ico size={s} d={<>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </>} />
  ),
  balance: (s) => (
    <Ico size={s} d={<>
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M5 7l7-4 7 4" />
      <path d="M5 17l7 4 7-4" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </>} />
  ),
  cpu: (s) => (
    <Ico size={s} d={<>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
    </>} />
  ),
  zap: (s) => (
    <Ico size={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  ),
  eye: (s) => (
    <Ico size={s} d={<>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>} />
  ),
  // philosophy icons
  bullseye: (s) => (
    <Ico size={s} d={<>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="rgba(163,230,53,0.75)" />
    </>} />
  ),
  search: (s) => (
    <Ico size={s} d={<>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>} />
  ),
  settings: (s) => (
    <Ico size={s} d={<>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>} />
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.40)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevronUp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.40)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  csvFile: (s = 38) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke="rgba(163,230,53,0.65)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  ),
  // hero brain/ML icon
  brain: (s = 56) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke="rgba(163,230,53,0.80)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2z"/>
    </svg>
  ),
};

// Section wrapper
const Section = ({ children, style = {} }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(32px)",
      transition: "opacity 0.65s ease, transform 0.65s ease",
      ...style,
    }}>
      {children}
    </div>
  );
};

// Feature chip
const Chip = ({ label, rank }) => {
  const sizes = ["1rem","0.95rem","0.88rem","0.82rem","0.78rem","0.75rem","0.72rem"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "8px 16px",
      background: G.accentDim, border: `1px solid ${G.accentBorder}`,
      borderRadius: 40, color: G.accent,
      fontSize: sizes[rank] || "0.82rem", fontWeight: 600, fontFamily: "monospace",
      transition: "all 0.2s", cursor: "default",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background  = "rgba(163,230,53,0.22)";
        e.currentTarget.style.transform   = "scale(1.06)";
        e.currentTarget.style.boxShadow   = "0 0 16px rgba(163,230,53,0.20)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background  = G.accentDim;
        e.currentTarget.style.transform   = "scale(1)";
        e.currentTarget.style.boxShadow   = "none";
      }}
    >
      {label}
    </span>
  );
};

// Stat card
const StatCard = ({ icon, label, value, sub, delay = 0 }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      ...glassCard, padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 12,
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms ease`,
      cursor: "default",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = G.accentBorder;
        e.currentTarget.style.boxShadow   = "0 0 28px rgba(163,230,53,0.08)";
        e.currentTarget.style.transform   = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = G.cardBorder;
        e.currentTarget.style.boxShadow   = "none";
        e.currentTarget.style.transform   = "translateY(0)";
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: G.accentDim, border: `1px solid ${G.accentBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 800, color: G.accent, lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: G.textPrimary, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: "0.76rem", color: G.textMuted, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
};

// Timeline step
const TimelineStep = ({ num, icon, title, body, last = false, delay = 0 }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      display: "flex", gap: 20,
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateX(0)" : "translateX(-24px)",
      transition: `opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms ease`,
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: G.accentDim, border: `2px solid ${G.accentBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, zIndex: 1,
          boxShadow: "0 0 16px rgba(163,230,53,0.12)",
        }}>
          {icon}
        </div>
        {!last && (
          <div style={{
            width: 1, flex: 1, marginTop: 6,
            background: "linear-gradient(to bottom, rgba(163,230,53,0.25), transparent)",
          }} />
        )}
      </div>
      <div style={{ ...glassCard, padding: "18px 22px", marginBottom: last ? 0 : 20, flex: 1 }}>
        <div style={{ fontSize: "0.72rem", color: G.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
          Step {num}
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: G.textPrimary, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: "0.88rem", color: G.textSub, lineHeight: 1.7 }}>{body}</div>
      </div>
    </div>
  );
};

// Metric bar
const MetricBar = ({ label, value, percent, delay = 0 }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateX(0)" : "translateX(-16px)",
      transition: `opacity 0.5s ${delay}ms ease, transform 0.5s ${delay}ms ease`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: "0.9rem", color: G.textPrimary, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: "0.9rem", color: G.accent, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginBottom: 16 }}>
        <div style={{
          height: "100%", borderRadius: 99,
          width: visible ? `${percent}%` : "0%",
          background: "linear-gradient(90deg, #a3e635, #65a30d)",
          transition: `width 1s ${delay + 100}ms cubic-bezier(0.4,0,0.2,1)`,
        }} />
      </div>
    </div>
  );
};

// Collapsible experiment card
const ExpCard = ({ title, tag, body, delay = 0 }) => {
  const [open, setOpen] = useState(false);
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      ...glassCard, overflow: "hidden",
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ${delay}ms ease, transform 0.5s ${delay}ms ease`,
    }}>
      <div onClick={() => setOpen(!open)} style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px", cursor: "pointer",
        borderBottom: open ? `1px solid ${G.cardBorder}` : "none",
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: "0.7rem", fontWeight: 700, padding: "3px 9px",
            borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase",
            background: G.accentDim, border: `1px solid ${G.accentBorder}`, color: G.accent,
          }}>{tag}</span>
          <span style={{ fontSize: "0.92rem", fontWeight: 600, color: G.textPrimary }}>{title}</span>
        </div>
        {open ? Icons.chevronUp : Icons.chevronDown}
      </div>
      {open && (
        <div style={{ padding: "14px 20px", fontSize: "0.87rem", color: G.textSub, lineHeight: 1.7 }}>
          {body}
        </div>
      )}
    </div>
  );
};

// SHAP bar
const ShapBar = ({ feature, impact, positive = true, delay = 0 }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
      opacity:    visible ? 1 : 0,
      transition: `opacity 0.5s ${delay}ms ease`,
    }}>
      <span style={{ width: 150, fontSize: "0.82rem", color: G.textSub, textAlign: "right", flexShrink: 0 }}>
        {feature}
      </span>
      <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          width: visible ? `${impact}%` : "0%",
          background: positive
            ? "linear-gradient(90deg, rgba(239,68,68,0.6), rgba(239,68,68,0.9))"
            : "linear-gradient(90deg, rgba(163,230,53,0.6), #a3e635)",
          transition: `width 0.9s ${delay + 100}ms cubic-bezier(0.4,0,0.2,1)`,
        }} />
      </div>
      {/* Arrow SVG instead of arrow character */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={positive ? "#f87171" : G.accent} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0 }}>
        {positive
          ? <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
          : <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>
        }
      </svg>
      <span style={{ fontSize: "0.74rem", color: positive ? "#f87171" : G.accent, width: 44, flexShrink: 0 }}>
        {positive ? "↑ risk" : "↓ risk"}
      </span>
    </div>
  );
};

const PulseDot = () => (
  <div style={{ position: "relative", width: 8, height: 8 }}>
    <div style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      background: G.accent, animation: "pulse-glow 1.8s ease-in-out infinite",
    }} />
  </div>
);

const MinimalHeader = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  if (isLoggedIn) return null;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        padding: "16px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 200,
        background: "rgba(5,5,5,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Left logo */}
      <span
        onClick={() => navigate("/")}
        style={{
          fontWeight: 800,
          fontSize: "17px",
          letterSpacing: "3px",
          color: "#a3e635",
          cursor: "pointer",
        }}
      >
        CRIM
      </span>

      {/* Right sign in button */}
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "8px 22px",
          background: "transparent",
          border: "1px solid rgba(163,230,53,0.45)",
          color: "#a3e635",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.8px",
          fontFamily: "inherit",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(163,230,53,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        Sign In
      </button>
    </nav>
  );
};

// MAIN PAGE
export default function ModelInsights({ isLoggedIn }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setCount((c) => { if (c >= 79) { clearInterval(iv); return 79; } return c + 1; });
      }, 18);
      return () => clearInterval(iv);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "0 24px" };

  const divider = (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg, transparent, rgba(163,230,53,0.18), transparent)",
      margin: "70px 0",
    }} />
  );

  return (
    <div style={{
      backgroundColor: G.bg,
      minHeight: "100vh",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      color: G.textPrimary,
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        @keyframes pulse-glow { 0%,100%{opacity:0.18} 50%{opacity:0.35} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        * { box-sizing: border-box; }
        ::selection { background: rgba(163,230,53,0.25); color:#fff; }
      `}</style>

      <MinimalHeader isLoggedIn={isLoggedIn} />

      {/* Ambient glows */}
      <div style={{
        position:"fixed", bottom:"-100px", right:"-100px",
        width:600, height:600, borderRadius:"50%", pointerEvents:"none", zIndex:0,
        background:"radial-gradient(circle, rgba(163,230,53,0.15) 0%, rgba(163,230,53,0.03) 50%, transparent 70%)",
        animation:"pulse-glow 5s ease-in-out infinite",
      }}/>
      <div style={{
        position:"fixed", top:"10%", left:"-100px",
        width:400, height:400, borderRadius:"50%", pointerEvents:"none", zIndex:0,
        background:"radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 65%)",
        animation:"pulse-glow 7s ease-in-out infinite 2s",
      }}/>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── HERO ── */}
        <div style={{ padding: isLoggedIn ? "160px 24px 80px" : "120px 24px 80px", textAlign: "center", position: "relative" }}>
          {/* decorative rings */}
          <div style={{ position:"absolute", top:30, left:"50%", transform:"translateX(-50%)", width:420, height:420, borderRadius:"50%", border:"1px solid rgba(163,230,53,0.07)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:60, left:"50%", transform:"translateX(-50%)", width:280, height:280, borderRadius:"50%", border:"1px solid rgba(163,230,53,0.10)", pointerEvents:"none" }}/>

          {/* label */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:G.accentDim, border:`1px solid ${G.accentBorder}`,
            borderRadius:40, padding:"6px 16px", marginBottom:28,
          }}>
            <PulseDot />
            <span style={{ fontSize:"0.78rem", fontWeight:700, color:G.accent, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              Model Insights
            </span>
          </div>

          <h1 style={{
            fontSize:"clamp(2.2rem,5vw,3.8rem)", fontWeight:800, lineHeight:1.1,
            color:"#fff", margin:"0 0 20px",
            fontFamily:"'Syne','Segoe UI',sans-serif",
          }}>
            Behind the{" "}
            <span style={{ color:G.accent, textShadow:"0 0 40px rgba(163,230,53,0.35)" }}>
              Predictions
            </span>
          </h1>

          <p style={{ maxWidth:640, margin:"0 auto 48px", fontSize:"1rem", lineHeight:1.75, color:G.textSub }}>
            This system uses machine learning to identify customers at risk of churn based on telecom behavioral
            and service-related patterns. The prediction engine analyzes customer attributes and maps them to the
            expected features of the trained model to generate churn risk predictions and retention insights.
          </p>

          {/* Floating accuracy card */}
          <div style={{
            display:"inline-flex", flexDirection:"column", alignItems:"center",
            background:G.accentDim, border:`1px solid ${G.accentBorder}`,
            borderRadius:16, padding:"20px 40px",
            animation:"float 4s ease-in-out infinite",
          }}>
            <span style={{ fontSize:"3rem", fontWeight:800, color:G.accent, lineHeight:1, fontFamily:"'Syne',sans-serif" }}>
              {count}%
            </span>
            <span style={{ fontSize:"0.78rem", color:G.textMuted, marginTop:4, letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Model Accuracy
            </span>
          </div>
        </div>

        <div style={wrap}>

          {divider}

          {/* ── MODEL OVERVIEW ── */}
          <Section>
            <div style={{ marginBottom:32 }}>
              <div style={{ fontSize:"0.78rem", color:G.accent, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>
                Model Overview
              </div>
              <h2 style={sectionTitle}>Core Statistics</h2>
            </div>
          </Section>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:8 }}>
            <StatCard icon={Icons.robot(20)}    label="Primary Model" value="XGBoost"  sub="Classifier"               delay={0}   />
            <StatCard icon={Icons.dataset(20)}  label="Dataset"       value="Telco"    sub="Customer Churn Dataset"    delay={80}  />
            <StatCard icon={Icons.users(20)}    label="Records"       value="7,043"    sub="Customers"                 delay={160} />
            <StatCard icon={Icons.trendDown(20)}label="Churn Rate"    value="26.5%"    sub="Distribution"              delay={240} />
            <StatCard icon={Icons.target(20)}   label="Accuracy"      value="~79%"     sub="Test set"                  delay={320} />
            <StatCard icon={Icons.activity(20)} label="ROC-AUC"       value="~0.845"   sub="Area under curve"          delay={400} />
          </div>

          {divider}

          {/* ── PIPELINE ── */}
          <Section style={{ marginBottom:36 }}>
            <div style={{ fontSize:"0.78rem", color:G.accent, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>
              How It Works
            </div>
            <h2 style={sectionTitle}>Prediction Pipeline</h2>
            <p style={sectionSub}>From raw customer data to actionable churn risk scores — five stages.</p>
          </Section>

          <div style={{ display:"flex", flexDirection:"column" }}>
            {[
              { icon: Icons.filter(18),  title:"Data Preprocessing",               body:"Customer records are cleaned, transformed, and encoded into a machine-learning compatible format before prediction." },
              { icon: Icons.balance(18), title:"Class Imbalance Handling",          body:"The dataset contains significantly fewer churn customers than non-churn customers. SMOTE (Synthetic Minority Oversampling Technique) was applied to improve learning balance." },
              { icon: Icons.cpu(18),     title:"Model Training",                    body:"The final prediction engine uses Extreme Gradient Boosting (XGBoost), where sequential decision trees learn from previous prediction errors to improve churn detection." },
              { icon: Icons.zap(18),     title:"Risk Prediction",                   body:"The trained model generates churn probability scores, customer risk categorization, and prediction outputs." },
              { icon: Icons.eye(18),     title:"Explainability & Recommendations",  body:"The platform integrates SHAP explainability and retention recommendation generation to improve transparency and business usability." },
            ].map((s, i) => (
              <TimelineStep key={i} num={i+1} icon={s.icon} title={s.title} body={s.body} last={i===4} delay={i*100} />
            ))}
          </div>

          {divider}

          {/* ── EVALUATION METRICS ── */}
          <Section style={{ marginBottom:36 }}>
            <div style={{ fontSize:"0.78rem", color:G.accent, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>
              Performance
            </div>
            <h2 style={sectionTitle}>Evaluation Metrics</h2>
            <p style={sectionSub}>Measured on held-out test data after full training.</p>
          </Section>

          <div style={{ ...glassCard, padding:"28px 32px", marginBottom:20 }}>
            <MetricBar label="Accuracy"  value="~79%"   percent={79}   delay={0}   />
            <MetricBar label="Recall"    value="~67%"   percent={67}   delay={100} />
            <MetricBar label="Precision" value="~60%"   percent={60}   delay={200} />
            <MetricBar label="F1-Score"  value="~0.63"  percent={63}   delay={300} />
            <MetricBar label="ROC-AUC"   value="~0.845" percent={84.5} delay={400} />
          </div>

          <Section>
            <div style={{
              ...glassCard, padding:"18px 24px",
              borderLeft:`3px solid ${G.accent}`,
              borderRadius:"0 14px 14px 0",
              fontSize:"0.88rem", color:G.textSub, lineHeight:1.75,
            }}>
              The project prioritizes <strong style={{ color:G.textPrimary }}>balanced predictive performance</strong> rather
              than maximizing a single metric. Special focus was placed on churn recall and ROC-AUC to improve
              identification of at-risk customers while maintaining stable prediction quality.
            </div>
          </Section>

          {divider}

          {/* ── EXPERIMENTS ── */}
          <Section style={{ marginBottom:36 }}>
            <div style={{ fontSize:"0.78rem", color:G.accent, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>
              Research
            </div>
            <h2 style={sectionTitle}>Experimental Optimization</h2>
            <p style={sectionSub}>
              Multiple approaches were tested before settling on the production pipeline.
              Expand each to see findings.
            </p>
          </Section>

          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
            {[
              { tag:"Baseline",   title:"Random Forest",              body:"Served as the baseline comparison model. Produced lower churn recall than XGBoost, making it less suitable for identifying at-risk customers." },
              { tag:"Production", title:"XGBoost + SMOTE",            body:"Best overall balance between accuracy, recall, precision, and ROC-AUC. Selected as the production model after comparative evaluation." },
              { tag:"Experiment", title:"Threshold Tuning",           body:"Adjusting the decision threshold improved churn recall significantly, but came at the cost of reduced overall accuracy and more false positives." },
              { tag:"Experiment", title:"Feature Engineering",        body:"Additional derived features were tested. Some improved performance marginally; others introduced noise. The final model uses a cleaned subset." },
              { tag:"Experiment", title:"Regularization Experiments", body:"Various L1/L2 regularization strengths were tuned. Helped prevent overfitting but didn't significantly improve test set recall." },
              { tag:"Experiment", title:"Balanced XGBoost V3",        body:"scale_pos_weight and other class-balancing strategies were tested. Produced stable precision but lower recall than the SMOTE-based pipeline." },
            ].map((e, i) => (
              <ExpCard key={i} tag={e.tag} title={e.title} body={e.body} delay={i*60} />
            ))}
          </div>

          {/* Comparison table */}
          <Section>
            <div style={{ ...glassCard, overflow:"hidden" }}>
              <div style={{
                display:"grid", gridTemplateColumns:"1fr 1fr",
                background:"rgba(255,255,255,0.02)",
                borderBottom:`1px solid ${G.cardBorder}`,
                padding:"12px 20px",
              }}>
                {["Version","Observation"].map((h) => (
                  <span key={h} style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:G.textMuted }}>{h}</span>
                ))}
              </div>
              {[
                ["Random Forest",   "Lower churn recall"],
                ["XGBoost + SMOTE", "Best overall balance"],
                ["Threshold Tuning","Higher recall but reduced accuracy"],
                ["Balanced V3",     "Stable precision but lower recall"],
              ].map(([v, o], i) => (
                <div key={i} style={{
                  display:"grid", gridTemplateColumns:"1fr 1fr",
                  padding:"13px 20px",
                  borderBottom: i < 3 ? `1px solid ${G.cardBorder}` : "none",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.015)"}
                  onMouseLeave={(e) => e.currentTarget.style.background="transparent"}
                >
                  <span style={{ fontSize:"0.88rem", color: v==="XGBoost + SMOTE" ? G.accent : G.textPrimary, fontWeight: v==="XGBoost + SMOTE" ? 700 : 400 }}>
                    {v==="XGBoost + SMOTE" && (
                      <span style={{ marginRight:6, verticalAlign:"middle" }}>{Icons.check}</span>
                    )}
                    {v}
                  </span>
                  <span style={{ fontSize:"0.87rem", color:G.textSub }}>{o}</span>
                </div>
              ))}
            </div>
          </Section>

          {divider}

          {/* ── FEATURE IMPORTANCE ── */}
          <Section style={{ marginBottom:36 }}>
            <div style={{ fontSize:"0.78rem", color:G.accent, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>
              Feature Analysis
            </div>
            <h2 style={sectionTitle}>Most Influential Features</h2>
            <p style={sectionSub}>
              Feature importance analysis identified customer commitment duration, service configuration,
              and billing behavior as strong indicators of churn risk.
            </p>
          </Section>

          <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20 }}>
            {["Tenure","Contract Type","Fiber Optic Internet","Monthly Charges","Payment Method","Tech Support","Online Security"]
              .map((f, i) => <Chip key={f} label={f} rank={i} />)}
          </div>

          {divider}

          {/* ── SHAP ── */}
          <Section style={{ marginBottom:36 }}>
            <div style={{ fontSize:"0.78rem", color:G.accent, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>
              Explainability
            </div>
            <h2 style={sectionTitle}>SHAP Explainability</h2>
            <p style={sectionSub}>
              The platform integrates SHAP (SHapley Additive Explanations) to explain why individual customers
              are predicted as high or low churn risk — improving transparency by surfacing the features
              contributing most to each prediction.
            </p>
          </Section>

          <div style={{ ...glassCard, padding:"28px 32px", marginBottom:12 }}>
            <div style={{ fontSize:"0.78rem", fontWeight:700, color:G.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:20 }}>
              Sample — High Risk Customer Feature Impact
            </div>

            <ShapBar feature="Month-to-Month"    impact={82} positive={true}  delay={0}   />
            <ShapBar feature="Fiber Optic"       impact={68} positive={true}  delay={80}  />
            <ShapBar feature="No Tech Support"   impact={55} positive={true}  delay={160} />
            <ShapBar feature="High Charges"      impact={48} positive={true}  delay={240} />
            <ShapBar feature="Long Tenure"       impact={60} positive={false} delay={320} />
            <ShapBar feature="Two-Year Contract" impact={45} positive={false} delay={400} />

            {/* Legend with SVG swatches */}
            <div style={{ marginTop:18, display:"flex", gap:24, flexWrap:"wrap" }}>
              <span style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.78rem", color:G.textMuted }}>
                <svg width="24" height="10" viewBox="0 0 24 10">
                  <rect width="24" height="10" rx="4" fill="rgba(239,68,68,0.6)" />
                </svg>
                Increases churn risk
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.78rem", color:G.textMuted }}>
                <svg width="24" height="10" viewBox="0 0 24 10">
                  <rect width="24" height="10" rx="4" fill="rgba(163,230,53,0.6)" />
                </svg>
                Decreases churn risk
              </span>
            </div>
          </div>

          {divider}

          {/* ── PHILOSOPHY ── */}
          <Section>
            <div style={{ textAlign:"center", maxWidth:680, margin:"0 auto 80px" }}>
              <div style={{ fontSize:"0.78rem", color:G.accent, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>
                Design Philosophy
              </div>
              <h2 style={{ ...sectionTitle, textAlign:"center", marginBottom:18 }}>
                System Design Philosophy
              </h2>
              <p style={{ fontSize:"1rem", color:G.textSub, lineHeight:1.8, marginBottom:36 }}>
                This platform was designed to balance{" "}
                <strong style={{ color:G.textPrimary }}>predictive performance</strong>,{" "}
                <strong style={{ color:G.textPrimary }}>explainability</strong>,{" "}
                <strong style={{ color:G.textPrimary }}>business usability</strong>, and{" "}
                <strong style={{ color:G.textPrimary }}>deployment practicality</strong>. Rather than
                optimizing for raw accuracy alone, the system emphasizes interpretable and operationally
                useful churn prediction.
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16 }}>
                {[
                  { icon: Icons.bullseye(28), label:"Balanced Performance", desc:"Optimized across accuracy, recall, and ROC-AUC" },
                  { icon: Icons.search(28),   label:"Explainability",        desc:"SHAP-powered per-customer prediction transparency" },
                  { icon: Icons.settings(28), label:"Operational Fit",       desc:"Designed for real business deployment and usability" },
                ].map((p) => (
                  <div key={p.label} style={{
                    ...glassCard, padding:"24px 16px", textAlign:"center",
                    transition:"transform 0.2s, box-shadow 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(163,230,53,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="none"; }}
                  >
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>{p.icon}</div>
                    <div style={{ fontSize:"0.85rem", fontWeight:700, color:G.textPrimary, marginBottom:6 }}>{p.label}</div>
                    <div style={{ fontSize:"0.78rem", color:G.textMuted, lineHeight:1.6 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}