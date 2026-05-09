import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrengthScore = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    return s;
  };

  const score = passwordStrengthScore(newPassword);
  const strengthLabel = score <= 1 ? "Weak" : score <= 3 ? "Medium" : "Strong";
  const strengthColor = score <= 1 ? "#ff4d4f" : score <= 3 ? "#facc15" : "#a3e635";
  const strengthWidth = score <= 1 ? "25%" : score <= 3 ? "60%" : "100%";

  const handleReset = async () => {
    setError("");

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Reset failed. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowBottomRight} />
      <div style={styles.glowBottomLeft} />

      <nav style={styles.nav}>
        <span onClick={() => navigate("/")} style={styles.logo}>CRIM</span>
      </nav>

      <div style={styles.card}>
        {success ? (
          <>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 20px", display: "block" }}>
              <circle cx="12" cy="12" r="11" stroke="#a3e635" strokeWidth="1.5" />
              <path d="M7.5 12l3 3 5-6" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 style={{ ...styles.title, color: "#a3e635" }}>Password Updated!</h2>
            <p style={{ ...styles.subtitle, marginBottom: "24px", lineHeight: "1.7" }}>
              Your new password is set. You can now log in with it.
            </p>
            <button style={styles.submitBtn} onClick={() => navigate("/login")}>
              Go to Login →
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <h2 style={styles.title}>Set New Password</h2>
              <p style={styles.subtitle}>Choose a strong password for your account</p>
            </div>

            {!token && (
              <div style={styles.errorBox}>
                This reset link is invalid or has expired.{" "}
                <span
                  style={{ color: "#a3e635", cursor: "pointer", fontWeight: "600" }}
                  onClick={() => navigate("/login")}
                >
                  Request a new one
                </span>
              </div>
            )}

            {error && <div style={styles.errorBox}>{error}</div>}

            {/* New password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>NEW PASSWORD</label>
              <div style={styles.inputWrapper}>
                <LockIcon />
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                />
                <span style={styles.eyeBtn} onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </span>
              </div>
              {newPassword && (
                <div style={styles.strengthRow}>
                  <span style={styles.strengthLabel}>Strength: </span>
                  <span style={{ color: strengthColor, fontWeight: "600", fontSize: "11px" }}>{strengthLabel}</span>
                  <div style={styles.strengthBarTrack}>
                    <div style={{ ...styles.strengthBarFill, width: strengthWidth, backgroundColor: strengthColor }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ ...styles.fieldGroup, marginTop: "16px" }}>
              <label style={styles.label}>CONFIRM PASSWORD</label>
              <div
                style={{
                  ...styles.inputWrapper,
                  border: confirmPassword && confirmPassword !== newPassword
                    ? "1px solid rgba(255,77,79,0.5)"
                    : confirmPassword && confirmPassword === newPassword
                      ? "1px solid rgba(163,230,53,0.35)"
                      : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <LockIcon />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                />
                <span style={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </span>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <div style={styles.smallError}>Passwords don't match</div>
              )}
            </div>

            <button
              style={{
                ...styles.submitBtn,
                marginTop: "22px",
                opacity: loading || !token ? 0.5 : 1,
                cursor: loading || !token ? "not-allowed" : "pointer",
              }}
              onClick={handleReset}
              disabled={loading || !token}
            >
              {loading ? "Updating..." : "Update Password →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", backgroundColor: "#050505",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif", color: "#e8e9f0",
    position: "relative", overflow: "hidden",
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
    borderRadius: "16px", padding: "36px 32px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6)", marginTop: "-30px",
    textAlign: "center",
  },
  title: { fontSize: "24px", fontWeight: "700", color: "#ffffff", margin: "0 0 6px" },
  subtitle: { fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 },
  errorBox: {
    background: "rgba(255,77,79,0.1)", border: "1px solid rgba(255,77,79,0.3)",
    color: "#ff4d4f", padding: "10px 12px", borderRadius: "8px",
    fontSize: "13px", marginBottom: "14px", textAlign: "center",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "7px", textAlign: "left" },
  label: { fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" },
  inputWrapper: {
    display: "flex", alignItems: "center", backgroundColor: "#0c0e13",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0 14px", gap: "10px",
  },
  eyeBtn: { cursor: "pointer", display: "flex", alignItems: "center" },
  input: { flex: 1, padding: "12px 0", backgroundColor: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "14px" },
  strengthRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" },
  strengthLabel: { fontSize: "11px", color: "rgba(255,255,255,0.35)" },
  strengthBarTrack: { flex: 1, height: "3px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" },
  strengthBarFill: { height: "100%", borderRadius: "2px", transition: "width 0.3s ease, background-color 0.3s ease" },
  smallError: { color: "#ff4d4f", fontSize: "11px", marginTop: "2px" },
  submitBtn: {
    width: "100%", padding: "13px", backgroundColor: "#a3e635", color: "#0a0a0a",
    border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.3px", cursor: "pointer",
  },
};