import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/api";

// ---------- SVG Icons ----------
const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="gray" strokeWidth="2" />
    <path d="M2 7l8.97 5.7a1.94 1.94 0 002.06 0L22 7" stroke="gray" strokeWidth="2" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M7 10V7a5 5 0 0110 0v3" stroke="gray" strokeWidth="2" strokeLinecap="round" />
    <rect x="5" y="10" width="14" height="10" rx="2" stroke="gray" strokeWidth="2" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="gray" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" stroke="gray" strokeWidth="2" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 3L21 21" stroke="gray" strokeWidth="2" strokeLinecap="round" />
    <path d="M10.6 10.6A2 2 0 0013.4 13.4" stroke="gray" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 2 12 2 12a18 18 0 014.06-5.94" stroke="gray" strokeWidth="2" strokeLinecap="round" />
    <path d="M9.53 4.53A9 9 0 0112 4c7 0 10 8 10 8a18 18 0 01-2.16 3.19" stroke="gray" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

  const navigate = useNavigate();

  const handleEmailBlur = () => {
    if (email && !emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
x 
      const data = await res.json();

      if (!res.ok) {
        // 403 = email not verified
        if (res.status === 403) {
          setError("Your email isn't verified yet. Check your inbox for the confirmation link.");
        } else {
          setError(data.detail || "Invalid email or password");
        }
        return;
      }

      onLogin(data.access_token);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotError("");
    setForgotSuccess("");

    if (!forgotEmail || !emailRegex.test(forgotEmail)) {
      setForgotError("Enter a valid email address");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setForgotError(data.detail || "Something went wrong. Try again.");
      } else {
        setForgotSuccess("Reset link sent! Check your inbox (and spam folder).");
      }
    } catch {
      setForgotError("Server error. Try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotEmail("");
    setForgotError("");
    setForgotSuccess("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowBottomRight} />
      <div style={styles.glowBottomLeft} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <span onClick={() => navigate("/")} style={styles.logo}>CRIM</span>
      </nav>

      {/* ── Forgot Password Modal ── */}
      {showForgot && (
        <div style={styles.modalOverlay} onClick={closeForgot}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Reset your password</h3>
            <p style={styles.modalSubtitle}>
              Enter the email you signed up with and we'll send you a reset link.
            </p>

            {forgotSuccess ? (
              <div style={styles.successBox}>{forgotSuccess}</div>
            ) : (
              <>
                {forgotError && <div style={styles.errorBox}>{forgotError}</div>}
                <div style={styles.inputWrapper}>
                  <EmailIcon />
                  <input
                    placeholder="name@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={styles.input}
                    autoFocus
                  />
                </div>
                <button
                  style={{
                    ...styles.submitBtn,
                    marginTop: "16px",
                    opacity: forgotLoading ? 0.7 : 1,
                    cursor: forgotLoading ? "not-allowed" : "pointer",
                  }}
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Sending..." : "Send reset link →"}
                </button>
              </>
            )}

            <button style={styles.modalClose} onClick={closeForgot}>
              {forgotSuccess ? "Close" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* Card */}
      <form
        style={styles.card}
        onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your credentials to continue</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {/* Email */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>EMAIL ADDRESS</label>
          <div
            style={{
              ...styles.inputWrapper,
              border: emailError
                ? "1px solid rgba(255,77,79,0.5)"
                : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <EmailIcon />
            <input
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={handleEmailBlur}
              style={styles.input}
            />
          </div>
          {emailError && <div style={styles.smallError}>{emailError}</div>}
        </div>

        {/* Password */}
        <div style={{ ...styles.fieldGroup, marginTop: "16px" }}>
          <div style={styles.labelRow}>
            <label style={styles.label}>PASSWORD</label>
            <span
              style={styles.forgotLink}
              onClick={() => { setShowForgot(true); setForgotEmail(email); }}
            >
              Forgot password?
            </span>
          </div>
          <div style={styles.inputWrapper}>
            <LockIcon />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <span style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Sign In to Dashboard →"}
        </button>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} style={styles.link}>Sign up</span>
        </p>
      </form>
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
  // Modal
  modalOverlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#111318",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "32px",
    width: "100%",
    maxWidth: "360px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
  },
  modalTitle: { fontSize: "18px", fontWeight: "700", color: "#fff", margin: "0 0 8px" },
  modalSubtitle: { fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 20px", lineHeight: "1.6" },
  modalClose: {
    width: "100%", marginTop: "12px", padding: "11px",
    background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer",
  },
  // Card
  card: {
    position: "relative", zIndex: 1, width: "100%", maxWidth: "380px",
    backgroundColor: "#111318", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", padding: "36px 32px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6)", marginTop: "-30px",
  },
  title: { fontSize: "26px", fontWeight: "700", color: "#ffffff", margin: "0 0 6px" },
  subtitle: { fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 },
  errorBox: {
    background: "rgba(255,77,79,0.1)", border: "1px solid rgba(255,77,79,0.3)",
    color: "#ff4d4f", padding: "10px 12px", borderRadius: "8px",
    fontSize: "13px", marginBottom: "14px", textAlign: "center",
  },
  successBox: {
    background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.25)",
    color: "#a3e635", padding: "10px 12px", borderRadius: "8px",
    fontSize: "13px", marginBottom: "14px", textAlign: "center",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  forgotLink: { fontSize: "12px", color: "#a3e635", fontWeight: "600", cursor: "pointer" },
  inputWrapper: {
    display: "flex", alignItems: "center", backgroundColor: "#0c0e13",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0 14px", gap: "10px",
  },
  eyeBtn: { cursor: "pointer", display: "flex", alignItems: "center" },
  input: { flex: 1, padding: "12px 0", backgroundColor: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "14px" },
  smallError: { color: "#ff4d4f", fontSize: "11px", marginTop: "2px" },
  submitBtn: {
    marginTop: "22px", width: "100%", padding: "13px",
    backgroundColor: "#a3e635", color: "#0a0a0a", border: "none",
    borderRadius: "8px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.3px",
  },
  footer: { marginTop: "20px", fontSize: "13px", textAlign: "center", color: "rgba(255,255,255,0.3)" },
  link: { color: "#a3e635", cursor: "pointer", fontWeight: "600" },
};