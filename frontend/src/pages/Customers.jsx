import { useState } from "react";
import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";

const Customers = ({ customers, uploadId }) => {
  const [modalCustomer, setModalCustomer] = useState(null);

  const isEmpty = !customers || customers.length === 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        padding: "40px",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#e8e9f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Neon ambient glow (same as dashboard) */}
      <div
        style={{
          position: "fixed",
          top: "-120px",
          right: "-120px",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(163,230,53,0.18), transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: "-150px",
          left: "120px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(248,113,113,0.10), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto 28px",
          padding: "22px 24px",
          borderRadius: 18,

          background: "rgba(17,19,24,0.35)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.6rem", color: "#e8e9f0" }}>
          All Customers
        </h1>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {customers?.length > 0
            ? `${customers.length.toLocaleString()} customers loaded — click any row to view details`
            : "No data loaded yet — upload a CSV to get started"}
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {isEmpty ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "420px",
              textAlign: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                opacity: 0.15,
                filter: "drop-shadow(0 0 10px rgba(163,230,53,0.2))",
              }}
            >
              ◈
            </div>

            <h2 style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              No customers yet
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.9rem",
                maxWidth: 420,
                lineHeight: 1.6,
              }}
            >
              Upload a CSV file from the Upload page to generate churn
              predictions, risk segmentation, and AI insights.
            </p>
          </div>
        ) : (
          <CustomerTable
            customers={customers}
            onRowClick={setModalCustomer}
            showAll={true}
          />
        )}
      </div>

      {/* Modal */}
      <CustomerModal
        customer={modalCustomer}
        onClose={() => setModalCustomer(null)}
        uploadId={uploadId}
      />
    </div>
  );
};

export default Customers;
