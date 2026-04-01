import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ArrowLeft, Info } from "lucide-react";

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
    <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #4a5080", flexShrink: 0 }} />
    <span style={{ fontSize: "14px", color: "#333" }}>
      <strong>{label}:</strong> {value}
    </span>
    <div style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#c8ccdb" }} />
  </div>
);

const CustomerProfile = ({ customers = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = customers.find((c) => c.customerID === id) || {
    customerID: id,
    name: "N/A",
    gender: "—",
    citizenship: "—",
    dependents: "—",
    tenure: "—",
    contract: "—",
    internetService: "—",
    monthlyCharges: "—",
    paymentMethod: "—",
    churnProbability: 0,
    riskLevel: "—",
  };

  const churnPct = Math.round((customer.churnProbability ?? 0) * 100);

  const barData = [
    { factor: "Contract", value: 82 },
    { factor: "Tenure", value: 74 },
    { factor: "Monthly\nCharges", value: 68 },
    { factor: "Service\nProvider", value: 55 },
    { factor: "Payment\nMethod", value: 40 },
  ];

  const riskColor =
    customer.riskLevel === "High" ? "#e85d5d"
    : customer.riskLevel === "Medium" ? "#f0a500"
    : "#3caa6f";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f8fc" }}>
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e", textAlign: "center", marginBottom: "4px" }}>
          Customer Profile
        </h1>
        <p style={{ textAlign: "center", color: "#888", fontSize: "14px", marginBottom: "24px" }}>
          Detailed churn analysis for selected customer
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <button
            onClick={() => navigate("/customers")}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 18px", backgroundColor: "#eef0f8",
              border: "1px solid #d0d4e0", borderRadius: "8px",
              fontSize: "13px", fontWeight: "600", color: "#4a5080", cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} /> Back to Customers
          </button>
        </div>

        {/* 3-column layout */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>

          {/* Personal Info */}
          <div
            style={{
              flex: "0 0 200px",
              backgroundColor: "#fff",
              border: "1px solid #e0e3ec",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <p style={{ margin: "0 0 16px", fontWeight: "600", fontSize: "14px", color: "#1a1a2e" }}>
              Personal Information
            </p>
            <div
              style={{
                width: "72px", height: "72px", borderRadius: "50%",
                backgroundColor: "#eef0f8", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <span style={{ fontSize: "28px" }}>👤</span>
            </div>
            <div
              style={{
                backgroundColor: "#f7f8fc", borderRadius: "8px",
                padding: "14px", fontSize: "13px", color: "#444", lineHeight: "1.8",
              }}
            >
              <div><strong>Customer ID:</strong> {customer.customerID}</div>
              <div><strong>Name:</strong> {customer.name}</div>
              <div><strong>Gender:</strong> {customer.gender}</div>
              <div><strong>Citizenship:</strong> {customer.citizenship}</div>
              <div><strong>Dependents:</strong> {customer.dependents}</div>
            </div>
          </div>

          {/* Account Info */}
          <div
            style={{
              flex: "1 1 240px",
              backgroundColor: "#fff",
              border: "1px solid #e0e3ec",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <p style={{ margin: "0 0 20px", fontWeight: "600", fontSize: "14px", color: "#1a1a2e" }}>
              Account Information
            </p>
            <InfoRow label="Tenure" value={`${customer.tenure} months`} />
            <InfoRow label="Contract" value={customer.contract} />
            <InfoRow label="Internet Service" value={customer.internetService} />
            <InfoRow label="Monthly Charges" value={`$${customer.monthlyCharges}`} />
            <InfoRow label="Payment Method" value={customer.paymentMethod} />
          </div>

          {/* Contributing Features */}
          <div
            style={{
              flex: "1 1 260px",
              backgroundColor: "#fff",
              border: "1px solid #e0e3ec",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <p style={{ margin: "0 0 16px", fontWeight: "600", fontSize: "14px", color: "#1a1a2e" }}>
              Contributing Features
            </p>
            <BarChart width={260} height={200} data={barData} margin={{ bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="factor" tick={{ fontSize: 10 }} interval={0} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" fill="#4a5080" radius={[3, 3, 0, 0]} />
            </BarChart>
          </div>

        </div>

        {/* Churn Probability Bar */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e0e3ec",
            borderRadius: "12px",
            padding: "24px 32px",
          }}
        >
          <p style={{ margin: "0 0 14px", fontWeight: "600", fontSize: "15px", color: "#1a1a2e", textAlign: "center" }}>
            Churn Probability: {churnPct}%
          </p>
          <div style={{ height: "14px", backgroundColor: "#eee", borderRadius: "8px", overflow: "hidden", marginBottom: "12px" }}>
            <div
              style={{
                width: `${churnPct}%`,
                height: "100%",
                backgroundColor: riskColor,
                borderRadius: "8px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: riskColor }}>
              {customer.riskLevel} Risk
            </span>
            <Info size={14} color="#aaa" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;