import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";

const Upload = ({ onData }) => {
  const navigate = useNavigate();

  const handleData = (data) => {
    onData(data);
    navigate("/dashboard");
  };

  return (
    <div className="page" style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "calc(100vh - 60px)",
    }}>
      <div style={{ width: "100%", maxWidth: "560px", animation: "fadeUp 0.4s ease" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: 64, height: 64,
            background: "linear-gradient(135deg, var(--accent-glow), rgba(99,102,241,0.1))",
            border: "1px solid rgba(56,189,248,0.3)",
            borderRadius: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem",
            margin: "0 auto 20px",
          }}>☁</div>
          <h1 style={{ marginBottom: 8 }}>Upload Dataset</h1>
          <p style={{ maxWidth: 380, margin: "0 auto" }}>
            Upload a customer CSV file to run churn predictions. The backend will process the data and return risk scores.
          </p>
        </div>

        {/* Upload Component */}
        <FileUpload onData={handleData} />

        {/* Requirements */}
        <div style={{
          marginTop: "28px",
          background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius)", padding: "16px 20px",
        }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "10px" }}>
            File Requirements
          </p>
          {[
            "Format: CSV (.csv)",
            "Must include customer ID column",
            "Will be sent to http://127.0.0.1:8000/api/upload",
          ].map((req) => (
            <div key={req} style={{
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: 6, fontSize: "0.82rem", color: "var(--text-muted)",
            }}>
              <span style={{ color: "var(--low)", fontSize: "0.7rem" }}>✓</span>
              {req}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upload;