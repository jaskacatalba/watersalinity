// frontend/src/pages/User/UserCont.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// -------------------- HEADER COMPONENT --------------------
const UserContHeader = ({ entries }) => {
  // Retrieve the user's first name from localStorage.
  const rawName = localStorage.getItem("userFirstName");
  const userFirstName = !rawName || rawName === "undefined" ? "User" : rawName;

  // Sample chart data (replace with real data if needed)
  const salinityData = [
    { month: "Jan", level: 20 },
    { month: "Feb", level: 40 },
    { month: "Mar", level: 90 },
    { month: "Apr", level: 120 },
  ];
  const pHData = [
    { month: "Jan", level: 6.5 },
    { month: "Feb", level: 6.8 },
  ];

  return (
    <div style={styles.dashboardContainer}>
      <h2>Welcome, {userFirstName}</h2>
      <div style={styles.chartsGrid}>
        <ChartBox
          title="SALINITY LEVEL"
          description="Amount of dissolved salts present in water."
          data={salinityData}
          color="blue"
          yAxisLabel="Salinity (ppt)"
        />
        <ChartBox
          title="PH LEVEL"
          description="Measures acidity or alkalinity (below 7 acidic, above 7 alkaline)."
          data={pHData}
          color="red"
          yAxisLabel="pH Level"
        />
      </div>
    </div>
  );
};

// -------------------- CHART BOX COMPONENT --------------------
const ChartBox = ({ title, description, data, color, yAxisLabel }) => (
  <div style={styles.chartBox}>
    <h3 style={styles.chartTitle}>{title}</h3>
    <p style={styles.chartDescription}>{description}</p>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="month" tick={{ fill: "#666" }} />
        <YAxis
          tick={{ fill: "#666" }}
          label={{
            value: yAxisLabel,
            angle: -90,
            position: "insideLeft",
            fill: "#666",
          }}
        />
        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd" }} />
        <Line
          type="monotone"
          dataKey="level"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// -------------------- MAIN COMPONENT: UserCont --------------------
const UserCont = () => {
  const { barangayName } = useParams();

  // Retrieve current user's ID from localStorage
  const userId = localStorage.getItem("userId");

  // State for wells added by the user
  const [entries, setEntries] = useState([]);

  // Modal & form state
  const [showModal, setShowModal] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    salinity: "",
    phLevel: "",
  });

  // Fetch only the current user's well data from the wellRoutes endpoint
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/wells/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching well data:", err));
  }, [userId]);

  const handleAddNewClick = () => {
    resetForm();
    setShowModal("addWells");
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      salinity: "",
      phLevel: "",
    });
    setEditingIndex(null);
  };

  // ========== CREATE (Add New Well) ==========
  const handleSaveEntry = () => {
    const phVal = parseFloat(formData.phLevel) || 0;
    const salVal = parseFloat(formData.salinity) || 0;

    // Optional check for pH range
    if (phVal > 9.99) {
      alert("The pH value is out of range.");
      return;
    }

    // Build the data object with sensor values and userId
    const wellData = {
      user_id: userId,
      ph_level: phVal,
      salinity_level: salVal,
      date_added: new Date().toISOString().split("T")[0],
    };

    fetch("http://localhost:5000/api/wells", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wellData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Error: " + data.error);
          return;
        }
        // Update local state with new entry
        setEntries((prev) => [...prev, { ...wellData, id: data.id }]);
        setShowModal(null);
      })
      .catch((err) => console.error("Error adding well data:", err));

    resetForm();
  };

  // ========== EDIT (Load data into form) ==========
  const handleEdit = (index) => {
    const selectedEntry = entries[index];
    if (!selectedEntry) return;
    setFormData({
      salinity: selectedEntry.salinity_level?.toString() || "",
      phLevel: selectedEntry.ph_level?.toString() || "",
    });
    setEditingIndex(index);
    setShowModal("editWells");
  };

  // ========== UPDATE (PUT request) ==========
  const handleSaveEdit = async () => {
    if (editingIndex === null) return;
    const itemToUpdate = entries[editingIndex];
    const primaryKeyValue = itemToUpdate.id;
    const endpoint = `http://localhost:5000/api/wells/${primaryKeyValue}`;

    const updatedData = {
      salinity_level: parseFloat(formData.salinity) || 0,
      ph_level: parseFloat(formData.phLevel) || 0,
    };

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (!response.ok) {
        alert("Update failed: " + (result.error || result.message));
        return;
      }
      const updatedArr = [...entries];
      updatedArr[editingIndex] = { ...itemToUpdate, ...updatedData };
      setEntries(updatedArr);
      alert(result.message || "Well updated successfully.");
    } catch (err) {
      console.error("Error updating well data:", err);
      alert("Update request failed. Check console for details.");
    }
    setShowModal(null);
    setEditingIndex(null);
  };

  // ========== DELETE (Send DELETE request) ==========
  const handleDelete = async (index) => {
    const itemToDelete = entries[index];
    if (!itemToDelete || !itemToDelete.id) return;
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    const endpoint = `http://localhost:5000/api/wells/${itemToDelete.id}`;
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        alert("Delete failed: " + (result.error || result.message));
        return;
      }
      setEntries(entries.filter((_, i) => i !== index));
      alert(result.message || "Well deleted successfully.");
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Delete request failed. Check console for details.");
    }
  };

  return (
    <div style={styles.container}>
      <UserContHeader entries={entries} />

      <div style={styles.headerContainer}>
        <h2>
          {barangayName
            ? barangayName.charAt(0).toUpperCase() + barangayName.slice(1)
            : "Your Wells"}
        </h2>
        <button onClick={handleAddNewClick} style={styles.button}>
          + Add New
        </button>
      </div>

      {/* Wells Table - Only Salinity & pH Level columns */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Salinity</th>
              <th style={styles.th}>pH Level</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td style={styles.td}>{entry.salinity_level ?? "N/A"}</td>
                <td style={styles.td}>{entry.ph_level ?? "N/A"}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(index)} style={styles.editButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(index)} style={styles.deleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============== MODALS for Add/Edit ============== */}
      {/* Add Wells Modal (Only Salinity & pH Level fields) */}
      {showModal === "addWells" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add New Well</h2>
            <input
              id="salinity"
              name="salinity"
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}
            />
            <input
              id="phLevel"
              name="phLevel"
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
            />
            <br />
            <center>
              <button onClick={handleSaveEntry} style={styles.editButton}>
                Save
              </button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}

      {/* Edit Wells Modal (Only Salinity & pH Level fields) */}
      {showModal === "editWells" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Well Entry</h2>
            <input
              id="salinityEdit"
              name="salinityEdit"
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}
            />
            <input
              id="phLevelEdit"
              name="phLevelEdit"
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
            />
            <br />
            <center>
              <button onClick={handleSaveEdit} style={styles.editButton}>
                Save
              </button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------- STYLES --------------------
const styles = {
  container: { padding: "20px" },
  dashboardContainer: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f2f5",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "20px",
  },
  chartBox: {
    padding: "24px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
  },
  chartTitle: { fontWeight: "bold", fontSize: "18px", color: "#444" },
  chartDescription: { fontSize: "14px", color: "#666" },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  tableContainer: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { backgroundColor: "royalblue", color: "white", padding: "10px" },
  td: { padding: "10px", border: "1px solid #ddd" },
  button: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "red",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "400px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  input: {
    margin: "5px 0",
    padding: "8px",
    width: "95%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  h2: { marginBottom: "15px" },
};

export default UserCont;