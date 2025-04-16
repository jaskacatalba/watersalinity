import React, { useState } from "react";

function Blue() {
  return (
    <section style={styles.hero}>
      <h1 style={styles.heroTitle}>

        <span style={styles.heroText}>Bantayan's Locale Underwater Evaluation System</span>
      </h1>
      <p style={styles.heroText}>
        Tracking salinity levels in wells to ensure clean and safe drinking water.
      </p>
    </section>
  );
}
const styles = {
  hero: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
    zIndex: 2,
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "white", // Ensure contras
  },
  heroText: {
    marginTop: "10px",
    marginBottom: "235px",
    fontSize: "18px",
    color: "#93c5fd",
    maxWidth: "600px",
    textAlign: "center",
  },
};


export default Blue;