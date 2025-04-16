import React, { useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { style } from "framer-motion/client";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const generateGraphData = (label, data, color) => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label,
    data,
    borderColor: color,
    borderWidth: 2,
  }],
});

const DashboardView = () => {
  const barangays = {
    Bantayan: ['Sillon', 'Ticad', 'Binaobao', 'Tamiao', 'Atop-atop', 'Baigad', 'Baod', 'Botigues', 'Kabac', 'Doong', 'Hilotongan', 'Guiwanon', 'Kabangbang', 'Kampingganon', 'Kangkaibe', 'Lipayran', 'Luyongbaybay', 'Luyongbaybay', 'Luyongbaybay', 'Patao', 'Putian', 'Sungko', 'Suba', 'Sulangan'],
    Madridejos: ['Pili', 'San Agustin', 'kodja'],
    StaFe: ['Poblacion', 'Okoy', 'Pook'],
  };

  const graphs = [
    { municipality: 'Bantayan', type: 'Salinity', data: [3.2, 3.8, 4.1, 4.5, 4.0, 3.6], color: 'blue' },
    { municipality: 'Bantayan', type: 'pH', data: [6.8, 7.0, 7.2, 7.1, 7.3, 6.9], color: 'green' },
    { municipality: 'Madridejos', type: 'Salinity', data: [3.5, 3.9, 4.2, 4.6, 4.1, 3.7], color: 'blue' },
    { municipality: 'Madridejos', type: 'pH', data: [6.7, 7.1, 7.3, 7.2, 7.4, 7.0], color: 'green' },
    { municipality: 'Sta Fe', type: 'Salinity', data: [3.1, 3.7, 4.0, 4.4, 3.9, 3.5], color: 'blue' },
    { municipality: 'Sta Fe', type: 'pH', data: [6.9, 7.2, 7.4, 7.3, 7.5, 7.1], color: 'green' },
  ];

  return (
    <section style={styles.dashboard}>
      <h2 style={styles.dashboardTitle}><strong>OVERALL SALINITY AND pH LEVELS OF EACH MUNICIPALITY</strong></h2>
      <div style={styles.dashboardLayout}>
        {/* Left Sidebar - Barangay List */}
        <div style={styles.sidebar}>
          {Object.keys(barangays).map((municipality, index) => (
            <div key={index} style={styles.barangayCard}>
              <h3>{municipality}</h3>
              <ul>
                {barangays[municipality].map((barangay, i) => (
                  <li key={i}>{barangay}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right - Graphs Section */}
        <div style={styles.dashboardGraphs}>
          {graphs.map(({ municipality, type, data, color }, index) => (
            <div key={index} style={styles.dashboardContainer}>
              <h3 style={styles.graphTitle}>{municipality} - {type} Levels</h3>
              <Line data={generateGraphData(`${municipality} ${type}`, data, color)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
const styles = {
    dashboard: {
      textAlign: "center",
    },
    dashboardTitle: {
      fontSize: "38px",
      fontWeight: "1000",
      color: "white",
      margin: "20px 0",
      textAlign: "center",
    },
    dashboardLayout: {
      display: "flex",
      gap: "20px",
      padding: "20px",
    },
    sidebar: {
      width: "250px",
      background: "#f8f9fa",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px #000000",
      textAlign: "left",
    },
    barangayCard: {
      background: "white",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    //barangayCardTitle: {
    //  fontSize: "18px",
    //  marginBottom: "8px",
    //  textAlign: "center",
    //},
    //barangayCardList: {
    //  listStyle: "none",
    //  padding: "0",
    //  margin: "0",
    //},
    //barangayCardItem: {
    //  padding: "5px 0",
    //  fontSize: "16px",
    //  textAlign: "left",
    //},
    dashboardGraphs: {
      flexGrow: "1",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      gap: "20px",
      justifyContent: "center",
      alignItems: "center",
    },
    dashboardContainer: {
      background: "white",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px #000000",
    },
    graphTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
  };
  
export default DashboardView;