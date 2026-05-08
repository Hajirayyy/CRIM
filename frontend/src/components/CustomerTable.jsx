import { useState } from "react";

const getRiskColor = (level) => {
  if (level === "High") return "#f87171";
  if (level === "Medium") return "#fbbf24";
  return "#a3e635";
};

const PAGE_SIZE = 50;

const CustomerTable = ({ customers, onRowClick}) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = customers
    .filter((c) => filter === "All" || c.riskLevel === filter)
    .filter((c) => !search || c.customerID.toString().includes(search))
    .sort((a, b) => b.churnProbability - a.churnProbability);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleFilterChange = (lvl) => {
    setFilter(lvl);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search customer ID..."
          value={search}
          onChange={handleSearch}
          style={{
            minWidth: 220,
            padding: "11px 14px",
            backgroundColor: "#111318",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            color: "#e8e9f0",
            fontSize: "0.85rem",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["All", "High", "Medium", "Low"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleFilterChange(lvl)}
              style={{
                padding: "7px 14px",
                fontSize: "0.8rem",
                fontWeight: 600,
                background:
                  filter === lvl
                    ? "rgba(163,230,53,0.08)"
                    : "transparent",
                border: `1px solid ${
                  filter === lvl
                    ? "rgba(163,230,53,0.22)"
                    : "rgba(255,255,255,0.10)"
                }`,
                borderRadius: 8,
                color:
                  filter === lvl
                    ? "#a3e635"
                    : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {lvl}
            </button>
          ))}
        </div>

        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.32)",
          }}
        >
          Showing {paginated.length} of {filtered.length} customers
        </span>
      </div>

      {/* Table */}
      <div
        style={{
          background: "rgba(17,19,24,0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <th style={thStyle}>Customer ID</th>
              <th style={thStyle}>Churn Probability</th>
              <th style={thStyle}>Risk Level</th>
              <th style={{ ...thStyle, textAlign: "right" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((c) => (
              <tr
                key={c.customerID}
                onClick={() => onRowClick(c)}
                style={{
                  cursor: "pointer",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <td style={tdStyle}>#{c.customerID}</td>

                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 6,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${c.churnProbability * 100}%`,
                          height: "100%",
                          background: getRiskColor(
                            c.riskLevel
                          ),
                          borderRadius: 3,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>

                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "#e8e9f0",
                      }}
                    >
                      {(c.churnProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>

                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: getRiskColor(c.riskLevel),
                      backgroundColor: `${getRiskColor(
                        c.riskLevel
                      )}15`,
                      border: `1px solid ${getRiskColor(
                        c.riskLevel
                      )}30`,
                    }}
                  >
                    {c.riskLevel}
                  </span>
                </td>

                <td
                  style={{
                    ...tdStyle,
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a3e635",
                      opacity: 0.75,
                      fontWeight: 600,
                    }}
                  >
                    View →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            No customers match the current filter.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          <button
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={page === 1}
            style={{
              ...paginationBtn,
              opacity: page === 1 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>

          <span
            style={{
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={page === totalPages}
            style={{
              ...paginationBtn,
              opacity: page === totalPages ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "16px 18px",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.35)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle = {
  padding: "16px 18px",
  fontSize: "0.85rem",
  color: "#e8e9f0",
};

const paginationBtn = {
  padding: "7px 14px",
  fontSize: "0.8rem",
  fontWeight: 600,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 8,
  color: "rgba(255,255,255,0.45)",
  cursor: "pointer",
};

export default CustomerTable;