import { useState, useRef } from "react";
import axios from "axios";

const FileUpload = ({ onData, compact = false }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onData(res.data);
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Make sure the backend is running at http://127.0.0.1:8000");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ maxWidth: compact ? "100%" : "560px" }}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : file ? "var(--low)" : "var(--border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: compact ? "32px" : "56px 40px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "var(--accent-glow)" : file ? "var(--low-bg)" : "var(--bg-card)",
          transition: "all 0.2s ease",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: compact ? "2rem" : "3rem", marginBottom: "12px" }}>
          {file ? "📄" : "☁"}
        </div>
        {file ? (
          <>
            <p style={{ color: "var(--low)", fontWeight: 600, marginBottom: "4px" }}>{file.name}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
              {(file.size / 1024).toFixed(1)} KB · Click to change
            </p>
          </>
        ) : (
          <>
            <p style={{ color: "var(--text)", fontWeight: 600, marginBottom: "6px" }}>
              Drop your CSV file here
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              or click to browse — .csv files only
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={!file || loading}
        style={{ width: "100%", justifyContent: "center", padding: "12px" }}
      >
        {loading ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
            Analyzing…
          </>
        ) : "Upload & Analyze"}
      </button>
    </div>
  );
};

export default FileUpload;