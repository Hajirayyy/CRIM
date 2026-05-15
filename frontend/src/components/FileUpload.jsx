import { useState } from "react";
import { BASE_URL } from "../api/api";
const CsvIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
    stroke="rgba(163,230,53,0.65)" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="9"  x2="10" y2="9"  />
  </svg>
);

const FileUpload = ({ onUploadSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const simulateProgress = (onComplete) => {
    let p = 0;

    setProgress(0);
    setDone(false);

    const interval = setInterval(() => {
      p += Math.random() * 18 + 6;

      if (p >= 95) {
        p = 95;
        clearInterval(interval);
        onComplete();
      }

      setProgress(Math.round(p));
    }, 120);
  };

  const uploadFile = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Only CSV files are allowed.");
      return;
    }

    const MAX_SIZE = 20 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      setError("File is too large. Maximum allowed size is 20MB.");
      return;
    }
    setSelectedFile(file);
    setError(null);
    setLoading(true);

    simulateProgress(async () => {
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch(`${BASE_URL}/api/upload/preview`, {
          method: "POST",
          body: fd,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Upload failed");
        }

        const data = await res.json();

        setProgress(100);
        setDone(true);

        setTimeout(() => {
          setLoading(false);

          if (onUploadSuccess) {
            onUploadSuccess(file, data);
          }
        }, 500);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      uploadFile(file);
    }
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];

    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          padding: "48px",
          borderRadius: "12px",
          cursor: loading ? "default" : "pointer",
          border: `2px dashed ${
            dragging ? "rgba(163,230,53,0.55)" : "rgba(163,230,53,0.22)"
          }`,
          background: "rgba(17,19,24,0.45)",
        }}
      >
        <CsvIcon />

        <p style={{ margin: 0, color: "#fff", fontWeight: 600 }}>
          {loading ? "Uploading..." : "Choose a file or drag & drop"}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          .CSV format only, up to 20MB
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={handleBrowse}
          style={{ display: "none" }}
          disabled={loading}
        />
      </label>

      {selectedFile && (
        <div
          style={{
            marginTop: "16px",
            color: "#fff",
          }}
        >
          <p style={{ marginBottom: "8px" }}>{selectedFile.name}</p>

          <div
            style={{
              height: "5px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#a3e635",
                transition: "width 0.2s ease",
              }}
            />
          </div>

          <p
            style={{
              marginTop: "8px",
              fontSize: "0.8rem",
              color: done ? "#a3e635" : "rgba(255,255,255,0.45)",
            }}
          >
            {done ? "Completed" : `${progress}%`}
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "12px",
            color: "#f87171",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
