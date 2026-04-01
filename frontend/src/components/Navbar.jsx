import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
 // npm install lucide-react for icons
const Navbar = () => {
  const linkStyle = ({ isActive }) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: isActive ? "#1a1a2e" : "#555",
    backgroundColor: isActive ? "#e8eaf0" : "transparent",
    transition: "all 0.2s",
  });
 
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 40px",
        backgroundColor: "#f0f2f7",
        borderBottom: "1px solid #e0e3ec",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <span style={{ fontStyle: "italic", fontWeight: "600", fontSize: "16px", color: "#1a1a2e" }}>
        CRIM
      </span>
 
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <NavLink to="/" end style={linkStyle}>Home</NavLink>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/uploads" style={linkStyle}>Uploads</NavLink>
        <NavLink to="/customers" style={linkStyle}>Customers</NavLink>
        <NavLink to="/reports" style={linkStyle}>Reports</NavLink>
      </div>
 
      <div
        style={{
          width: "34px", height: "34px", borderRadius: "50%",
          backgroundColor: "#d0d4e0", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
        <User size={18} color="#555" />
      </div>
    </nav>
  );
};

export default Navbar;