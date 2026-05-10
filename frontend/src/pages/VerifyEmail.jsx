import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../api/api";

const CheckIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 20px", display: "block" }}>
    <circle cx="12" cy="12" r="11" stroke="#a3e635" strokeWidth="1.5" />
    <path d="M7.5 12l3 3 5-6" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 20px", display: "block" }}>
    <circle cx="12" cy="12" r="11" stroke="#ff4d4f" strokeWidth="1.5" />
    <path d="M15 9l-6 6M9 9l6 6" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SpinnerIcon = () => (
  <div style={{
    width: "48px", height: "48px", borderRadius: "50%",
    border: "2px solid rgba(163,230,53,0.15)",
    borderTop: "2px solid #a3e635",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 20px",
  }} />
);

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token found.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/verify-email?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.detail || "Verification failed. The link may have expired.");
        }
      } catch {
        setStatus("error");
        setMessage("Server error. Please try again.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.glowBottomRight} />
      <div style={styles.glowBottomLeft} />

      <nav style={styles.nav}>
        <span onClick={() => navigate("/")} style={styles.logo}>CRIM</span>
      </nav>

      <div style={styles.card}>
        {status === "loading" && (
          <>
            <SpinnerIcon />
            <h2 style={styles.title}>Verifying your email…</h2>
            <p style={styles.subtitle}>Just a moment, please don't close this tab.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckIcon />
            <h2 style={{ ...styles.title, color: "#a3e635" }}>Email Verified!</h2>
            <p style={{ ...styles.subtitle, marginBottom: "24px", lineHeight: "1.7" }}>
              {message}<br />Your account is now active.
            </p>
            <button style={styles.btn} onClick={() => navigate("/login")}>
              Continue to Login →
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <ErrorIcon />
            <h2 style={{ ...styles.title, color: "#ff4d4f" }}>Verification Failed</h2>
            <p style={{ ...styles.subtitle, marginBottom: "24px", lineHeight: "1.7" }}>
              {message}
            </p>
            <button style={styles.btn} onClick={() => navigate("/signup")}>
              Back to Sign Up →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#e8e9f0",
    position: "relative",
    overflow: "hidden",
  },
  glowBottomRight: {
    position: "fixed", bottom: "-100px", right: "-100px", width: "500px", height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(163,230,53,0.18) 0%, rgba(163,230,53,0.04) 50%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  glowBottomLeft: {
    position: "fixed", bottom: "0px", left: "150px", width: "350px", height: "350px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(163,230,53,0.10) 0%, transparent 65%)",
    pointerEvents: "none", zIndex: 0,
  },
  nav: { position: "fixed", top: 0, left: 0, right: 0, padding: "14px 32px", zIndex: 100 },
  logo: { fontWeight: "800", fontSize: "18px", letterSpacing: "2px", color: "#a3e635", cursor: "pointer" },
  card: {
    position: "relative", zIndex: 1, width: "100%", maxWidth: "380px",
    backgroundColor: "#111318", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", padding: "44px 32px 36px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
    textAlign: "center",
  },
  title: { fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: "0 0 10px" },
  subtitle: { fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 },
  btn: {
    width: "100%", padding: "13px",
    backgroundColor: "#a3e635", color: "#0a0a0a", border: "none",
    borderRadius: "8px", fontSize: "14px", fontWeight: "700",
    letterSpacing: "0.3px", cursor: "pointer",
  },
};