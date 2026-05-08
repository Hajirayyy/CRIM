import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hideOnPages = ["/login", "/signup"];
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

  const linkStyle = ({ isActive }) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: isActive ? "#a3e635" : "rgba(255,255,255,0.38)",
    backgroundColor: isActive ? "rgba(163,230,53,0.08)" : "transparent",
    border: isActive
      ? "1px solid rgba(163,230,53,0.22)"
      : "1px solid transparent",
    transition: "all 0.2s",
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 40px",
        backgroundColor: "rgba(5,5,5,0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <span
        onClick={() => navigate("/")}
        style={{
          fontWeight: "800",
          fontSize: "18px",
          letterSpacing: "2px",
          color: "#a3e635",
          cursor: "pointer",
        }}
      >
        CRIM
      </span>

      {/* Center Links */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <NavLink to="/" end style={linkStyle}>
          Home
        </NavLink>
        <NavLink to="/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/uploads" style={linkStyle}>
          Uploads
        </NavLink>
        <NavLink to="/customers" style={linkStyle}>
          Customers
        </NavLink>
        <NavLink to="/reports" style={linkStyle}>
          Reports
        </NavLink>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            style={{
              padding: "8px 18px",
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,77,79,0.45)";
              e.currentTarget.style.color = "#ff4d4f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "rgba(255,255,255,0.45)";
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={{
                padding: "8px 18px",
                backgroundColor: "#a3e635",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
