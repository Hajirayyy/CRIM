import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import { BASE_URL } from "../api/api";

const toLabel = (s) =>
  s
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

const CsvIcon = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(163,230,53,0.65)"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="9" x2="10" y2="9" />
  </svg>
);

const Pill = ({ label, color = "green" }) => {
  const colors = {
    green: {
      bg: "rgba(163,230,53,0.08)",
      border: "rgba(163,230,53,0.22)",
      text: "#a3e635",
    },
    yellow: {
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.22)",
      text: "#fde68a",
    },
    red: {
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
      text: "#fca5a5",
    },
  };
  const c = colors[color] || colors.green;
  return (
    <span
      style={{
        fontSize: "0.78rem",
        fontFamily: "monospace",
        fontWeight: 500,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 5,
        padding: "4px 10px",
        color: c.text,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

const CoverageBar = ({ percent }) => (
  <div
    style={{
      width: "100%",
      height: 5,
      background: "rgba(255,255,255,0.07)",
      borderRadius: 99,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${percent}%`,
        background: percent >= 60 ? "#a3e635" : "#fbbf24",
        borderRadius: 99,
        transition: "width 0.4s ease",
      }}
    />
  </div>
);

// Icons
const FileIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(163,230,53,0.7)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a3e635"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TickIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a3e635"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(163,230,53,0.6)"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 0.18s ease",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      flexShrink: 0,
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CustomDropdown = ({
  value,
  options,
  onChange,
  placeholder = "— Ignore this column —",
  compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  const selectedLabel = value
    ? (options.find((o) => o.value === value)?.label ?? value)
    : null;

  // Shared list renderer
  const renderList = (items, withIgnore, listStyle) => (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        zIndex: 9999,
        background: "#111418",
        border: "1px solid rgba(163,230,53,0.25)",
        borderRadius: 8,
        overflow: "hidden",
        maxHeight: 240,
        overflowY: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(163,230,53,0.2) transparent",
        ...listStyle,
      }}
    >
      {(withIgnore ? [{ value: "", label: placeholder }, ...items] : items).map(
        (opt) => {
          const isSelected = opt.value === "" ? !value : opt.value === value;
          const isHov = hovered === opt.value;
          return (
            <div
              key={opt.value}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                onChange(opt.value || null);
                setOpen(false);
              }}
              style={{
                padding: compact ? "7px 12px" : "9px 12px",
                fontSize: compact ? "0.82rem" : "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                background: isSelected
                  ? "rgba(163,230,53,0.12)"
                  : isHov
                    ? "rgba(163,230,53,0.07)"
                    : "transparent",
                color: isSelected
                  ? "#a3e635"
                  : isHov
                    ? "#c8f06a"
                    : opt.value === ""
                      ? "rgba(255,255,255,0.35)"
                      : "#e8e9f0",
                borderLeft: isSelected
                  ? "2px solid #a3e635"
                  : "2px solid transparent",
                transition: "background 0.1s, color 0.1s",
              }}
            >
              <span>{opt.label}</span>
              {isSelected && opt.value !== "" && <TickIcon />}
            </div>
          );
        },
      )}
    </div>
  );

  // Compact variant
  if (compact) {
    return (
      <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "0.76rem",
            color: "rgba(255,255,255,0.38)",
            cursor: "pointer",
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {selectedLabel || "assign…"} <ChevronDown open={open} />
        </button>
        {open && renderList(options, false, { minWidth: 200 })}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          background: open ? "rgba(163,230,53,0.06)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "rgba(163,230,53,0.45)" : "rgba(163,230,53,0.18)"}`,
          borderRadius: 7,
          padding: "7px 10px",
          fontSize: "0.85rem",
          color: selectedLabel ? "#e8e9f0" : "rgba(255,255,255,0.35)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          textAlign: "left",
          outline: "none",
          boxShadow: open ? "0 0 0 2px rgba(163,230,53,0.12)" : "none",
          transition: "border 0.15s, background 0.15s, box-shadow 0.15s",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown open={open} />
      </button>
      {open && renderList(options, true, { width: "100%" })}
    </div>
  );
};

const EXPECTED_FEATURES = [
  "SeniorCitizen",
  "tenure",
  "MonthlyCharges",
  "TotalCharges",
  "gender",
  "Partner",
  "Dependents",
  "PhoneService",
  "MultipleLines",
  "InternetService",
  "OnlineSecurity",
  "OnlineBackup",
  "DeviceProtection",
  "TechSupport",
  "StreamingTV",
  "StreamingMovies",
  "Contract",
  "PaperlessBilling",
  "PaymentMethod",
];

const FeaturesPanel = () => (
  <div
    style={{
      background: "rgba(17,19,24,0.45)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: "20px 24px",
      marginTop: 20,
    }}
  >
    <p
      style={{
        margin: "0 0 4px",
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "#e8e9f0",
      }}
    >
      Expected Model Features
    </p>
    <p
      style={{
        margin: "0 0 14px",
        fontSize: "0.8rem",
        color: "rgba(255,255,255,0.38)",
      }}
    >
      Your CSV columns will be auto-matched to these. Exact names aren't
      required.
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {EXPECTED_FEATURES.map((f) => (
        <Pill key={f} label={toLabel(f)} color="green" />
      ))}
    </div>
  </div>
);

const MappingTable = ({
  mapping,
  expectedFeatures,
  onMappingChange,
  summary,
}) => {
  const matched = mapping.filter((m) => m.mappedTo !== null);
  const extra = mapping.filter((m) => m.mappedTo === null);
  const good = summary.coveragePercent >= 60;

  const cardStyle = {
    background: "rgba(17,19,24,0.35)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
  };

  const featureOptions = expectedFeatures.map((f) => ({
    value: f,
    label: toLabel(f),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Coverage card */}
      <div style={{ ...cardStyle, padding: "20px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#e8e9f0",
              }}
            >
              {good ? "✓" : "⚠"}&nbsp;{summary.coveragePercent}% Feature
              Coverage
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.83rem",
                color: "rgba(255,255,255,0.38)",
              }}
            >
              {summary.matchedCount} of {summary.totalExpected} model features
              matched from your file
              {extra.length > 0 &&
                ` · ${extra.length} column${extra.length > 1 ? "s" : ""} will be ignored`}
            </p>
          </div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "5px 13px",
              borderRadius: 20,
              whiteSpace: "nowrap",
              background: good
                ? "rgba(163,230,53,0.10)"
                : "rgba(251,191,36,0.10)",
              border: `1px solid ${good ? "rgba(163,230,53,0.28)" : "rgba(251,191,36,0.28)"}`,
              color: good ? "#a3e635" : "#fde68a",
            }}
          >
            {good ? "Ready to predict" : "Low coverage"}
          </span>
        </div>
        <CoverageBar percent={summary.coveragePercent} />
      </div>

      {/* Matched columns table */}
      {matched.length > 0 && (
        <div style={{ ...cardStyle, overflow: "visible" }}>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 40px 1fr 100px",
              gap: 12,
              padding: "12px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.015)",
              borderRadius: "12px 12px 0 0",
            }}
          >
            {["Your Column", "", "Maps To", ""].map((h, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {h}
              </p>
            ))}
          </div>

          {matched.map((row, idx) => (
            <div
              key={row.userColumn}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 40px 1fr 100px",
                gap: 12,
                padding: "11px 20px",
                alignItems: "center",
                borderBottom:
                  idx < matched.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
                transition: "background 0.15s",
                // Give each row its own stacking context so its dropdown floats above the rows below
                position: "relative",
                zIndex: matched.length - idx,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(163,230,53,0.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                style={{
                  fontSize: "0.87rem",
                  fontFamily: "monospace",
                  color: "#e8e9f0",
                  background: "rgba(255,255,255,0.04)",
                  padding: "4px 10px",
                  borderRadius: 5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.userColumn}
              </span>

              {/* Neon green arrow */}
              <span
                style={{
                  color: "rgba(163,230,53,0.75)",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                →
              </span>

              <CustomDropdown
                value={row.mappedTo}
                options={featureOptions}
                onChange={(val) => onMappingChange(row.userColumn, val)}
                placeholder="— Ignore this column —"
              />

              <button
                onClick={() => onMappingChange(row.userColumn, null)}
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 7,
                  padding: "7px 0",
                  fontSize: "0.82rem",
                  color: "#f87171",
                  cursor: "pointer",
                  fontWeight: 500,
                  width: "100%",
                }}
              >
                Ignore
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Unrecognised columns */}
      {extra.length > 0 && (
        <div
          style={{
            ...cardStyle,
            overflow: "visible",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.015)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderRadius: "12px 12px 0 0",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#f87171" }}>✕</span>
            <p
              style={{
                margin: 0,
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.38)",
              }}
            >
              Unrecognised Columns — Will Be Ignored
            </p>
          </div>
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {extra.map((row) => (
              <div
                key={row.userColumn}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <Pill label={row.userColumn} color="red" />
                <CustomDropdown
                  value={row.mappedTo}
                  options={featureOptions}
                  onChange={(val) =>
                    val && onMappingChange(row.userColumn, val)
                  }
                  placeholder="assign…"
                  compact
                />
              </div>
            ))}
          </div>
          <p
            style={{
              margin: 0,
              padding: "0 20px 14px",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.5,
            }}
          >
            These columns had no recognisable match in the model. Use the
            dropdown next to each to manually assign one if needed.
          </p>
        </div>
      )}

      {/* Missing features */}
      {summary.missingFeatures && summary.missingFeatures.length > 0 && (
        <div
          style={{
            background: "rgba(251,191,36,0.04)",
            border: "1px solid rgba(251,191,36,0.18)",
            borderRadius: 12,
            padding: "16px 20px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "#fbbf24",
            }}
          >
            ⚠ Missing Features
          </p>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "0.81rem",
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.5,
            }}
          >
            These model features could not be matched from your file and will
            default to zero, which may reduce prediction accuracy:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {summary.missingFeatures.map((f) => (
              <Pill key={f} label={toLabel(f)} color="yellow" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Upload page
const Upload = ({ onData, uploadState, onUploadStateChange }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(uploadState?.step || "upload");
  const [uploadedFile, setUploadedFile] = useState(
    uploadState?.uploadedFile || null,
  );
  const [previewData, setPreviewData] = useState(
    uploadState?.previewData || null,
  );
  const [mapping, setMapping] = useState(uploadState?.mapping || []);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const persist = (patch) => {
    if (onUploadStateChange) onUploadStateChange(patch);
  };

  const handleMappingChange = (userColumn, newTarget) => {
    const updated = mapping.map((m) =>
      m.userColumn === userColumn ? { ...m, mappedTo: newTarget } : m,
    );
    setMapping(updated);
    persist({ step, uploadedFile, previewData, mapping: updated });
  };

  const liveSummary = (() => {
    if (!previewData) return null;
    const matched = new Set(mapping.map((m) => m.mappedTo).filter(Boolean));
    const total = previewData.expectedFeatures.length;
    return {
      matchedCount: matched.size,
      totalExpected: total,
      coveragePercent: Math.round((matched.size / total) * 1000) / 10,
      extraColumns: mapping.filter((m) => !m.mappedTo).map((m) => m.userColumn),
      missingFeatures: previewData.expectedFeatures.filter(
        (f) => !matched.has(f),
      ),
    };
  })();

  const handleConfirm = async () => {
    if (!uploadedFile) return;
    setIsLoading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", uploadedFile);
    fd.append("mapping", JSON.stringify(mapping));
    try {
      const res = await fetch(`${BASE_URL}/api/upload/confirm`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || "Prediction failed");
      }
      const data = await res.json();
      console.log("API response:", data);
      onData(data);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("upload");
    setPreviewData(null);
    setMapping([]);
    setUploadedFile(null);
    setError(null);
    persist({
      step: "upload",
      uploadedFile: null,
      previewData: null,
      mapping: [],
    });
  };

  return (
    <>
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          width: "100%",
          backgroundColor: "#050505",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: step === "mapping" ? "flex-start" : "center",
          paddingTop: step === "mapping" ? 48 : 72,
          paddingBottom: 48,
          boxSizing: "border-box",
        }}
      >
        {/* Ambient glows */}
        <div
          style={{
            position: "fixed",
            bottom: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(163,230,53,0.18) 0%, rgba(163,230,53,0.04) 50%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "0px",
            left: "150px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(163,230,53,0.10) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div
          style={{
            width: "100%",
            maxWidth: step === "mapping" ? 860 : 600,
            animation: "fadeUp 0.4s ease",
            position: "relative",
            zIndex: 1,
            padding: "0 16px",
            boxSizing: "border-box",
          }}
        >
          {/* Mapping header */}
          {step === "mapping" && (
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h1
                style={{
                  marginBottom: 10,
                  fontSize: "1.7rem",
                  color: "#e8e9f0",
                  fontWeight: 700,
                }}
              >
                Review Column Mapping
              </h1>
              <p
                style={{
                  maxWidth: 520,
                  margin: "0 auto",
                  color: "rgba(255,255,255,0.38)",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                }}
              >
                We've automatically matched your file's columns to the model's
                expected features. Adjust any mappings below before running
                predictions.
              </p>
              {previewData && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <Pill label={previewData.fileName} color="green" />
                  <Pill
                    label={`${previewData.rowCount.toLocaleString()} rows`}
                    color="green"
                  />
                </div>
              )}
            </div>
          )}

          {/* Upload step */}
          {step === "upload" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <h1
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: 700,
                    color: "#e8e9f0",
                    margin: "0 0 8px",
                  }}
                >
                  Upload Dataset
                </h1>
                <p
                  style={{
                    color: "rgba(255,255,255,0.38)",
                    fontSize: "0.9rem",
                    margin: 0,
                  }}
                >
                  Upload a telecom customer CSV to run churn predictions.
                </p>
              </div>
              <FileUpload
                onUploadSuccess={(file, data) => {
                  setUploadedFile(file);
                  setPreviewData(data);
                  setMapping(data.suggestedMapping);
                  setStep("mapping");

                  persist({
                    step: "mapping",
                    uploadedFile: file,
                    previewData: data,
                    mapping: data.suggestedMapping,
                  });
                }}
              />
              {error && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "13px 18px",
                    borderRadius: 12,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    fontSize: "0.85rem",
                    color: "#f87171",
                  }}
                >
                  {error}
                </div>
              )}
              <FeaturesPanel />
            </>
          )}

          {/* Mapping step */}
          {step === "mapping" && previewData && liveSummary && (
            <>
              <MappingTable
                mapping={mapping}
                expectedFeatures={previewData.expectedFeatures}
                onMappingChange={handleMappingChange}
                summary={liveSummary}
              />
              {error && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "13px 18px",
                    borderRadius: 12,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    fontSize: "0.85rem",
                    color: "#f87171",
                  }}
                >
                  {error}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <button
                  onClick={handleBack}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12,
                    padding: "11px 24px",
                    fontSize: "0.88rem",
                    color: "rgba(255,255,255,0.45)",
                    cursor: "pointer",
                  }}
                >
                  ← Different File
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading || liveSummary.matchedCount === 0}
                  style={{
                    background:
                      liveSummary.matchedCount === 0 || isLoading
                        ? "rgba(163,230,53,0.20)"
                        : "#a3e635",
                    border: "none",
                    borderRadius: 12,
                    padding: "11px 30px",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color:
                      liveSummary.matchedCount === 0
                        ? "rgba(255,255,255,0.35)"
                        : "#0a0a0a",
                    cursor:
                      liveSummary.matchedCount === 0 || isLoading
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    letterSpacing: "0.3px",
                  }}
                >
                  {isLoading && (
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid rgba(0,0,0,0.2)",
                        borderTop: "2px solid #0a0a0a",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                  )}
                  {isLoading ? "Running Predictions…" : "Confirm & Predict →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Upload;
