import React, { useState } from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#1a202c", // Dark Gray
        color: "white",
        boxShadow: "0px -4px 8px rgba(0, 0, 0, 0.3)", // Subtle shadow at top
        padding: "25px 0",
        width: "99vw", // Ensures full width
        position: "relative",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <p style={{ fontSize: "14px", margin: "5px 0" }}>
          Bantayan's Locale Underwater Evaluation System
        </p>
        <p style={{ fontSize: "12px", margin: "5px 0" }}>
          Designed & Developed by{" "}
          <span style={{ fontWeight: "bold", color: "#4fd1c5" }}>BLUE TEAM</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;