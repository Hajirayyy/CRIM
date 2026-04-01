const ExportReport = ({ summary, customers, label = "Export CSV" }) => {
  const handleExport = () => {
    if (!customers?.length) return;
    const header = ["CustomerID", "Churn Probability (%)", "Risk Level"];
    const rows = customers.map((c) => [
      c.customerID,
      (c.churnProbability * 100).toFixed(1),
      c.riskLevel,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crim_churn_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="btn btn-secondary"
      onClick={handleExport}
      disabled={!customers?.length}
    >
      ↓ {label}
    </button>
  );
};

export default ExportReport;