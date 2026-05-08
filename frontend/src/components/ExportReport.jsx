const ExportReport = ({ customers, label = "Export CSV" }) => {
  const handleExport = () => {
    if (!customers?.length) return;

    const header = [
      "CustomerID",
      "Churn Probability (%)",
      "Risk Level",
    ];

    const rows = customers.map((c) => [
      c.customerID,
      (c.churnProbability * 100).toFixed(1),
      c.riskLevel,
    ]);

    const csv = [header, ...rows]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "crim_churn_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const isDisabled = !customers?.length;

  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      style={{
        padding: "10px 16px",
        fontSize: "0.85rem",
        fontWeight: 600,
        letterSpacing: "0.2px",

        borderRadius: 10,

        background: "rgba(17,19,24,0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",

        border: "1px solid rgba(163,230,53,0.15)",
        color: isDisabled
          ? "rgba(255,255,255,0.25)"
          : "#a3e635",

        cursor: isDisabled ? "not-allowed" : "pointer",

        transition: "all 0.25s ease",

        boxShadow: "0 0 0 transparent",
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;

        e.currentTarget.style.borderColor =
          "rgba(163,230,53,0.4)";
        e.currentTarget.style.boxShadow =
          "0 0 18px rgba(163,230,53,0.15)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor =
          "rgba(163,230,53,0.15)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      ↓ {label}
    </button>
  );
};

export default ExportReport;