import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* =================== HELPER COMPONENTS & FUNCTIONS =================== */

// The same "SelectLocation" from BarangayCont:
const SelectLocation = ({
  formData,
  setFormData,
  municipalitiesData,
  barangaysData,
  puroksData,
}) => {
  return (
    <>
      <select
        style={styles.input1}
        value={formData.municipality}
        onChange={(e) =>
          setFormData({ ...formData, municipality: e.target.value, barangay: "", purok: "" })
        }
      >
        <option value="">Select a Municipality</option>
        {municipalitiesData.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <select
        style={styles.input1}
        value={formData.barangay}
        onChange={(e) =>
          setFormData({ ...formData, barangay: e.target.value, purok: "" })
        }
      >
        <option value="">Select a Barangay</option>
        {barangaysData
          .filter((b) => String(b.municipality_id) === formData.municipality)
          .map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
      </select>

      <select
        style={styles.input1}
        value={formData.purok}
        onChange={(e) => setFormData({ ...formData, purok: e.target.value })}
      >
        <option value="">Select a Purok</option>
        {puroksData
          .filter((p) => String(p.barangay_id) === formData.barangay)
          .map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
      </select>
    </>
  );
};

// Helper to map month number to abbreviated name
function getMonthName(monthNum) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[monthNum - 1] || "";
}

// Convert numeric IDs -> location names
function getMunicipalityName(municipalitiesData, id) {
  const found = municipalitiesData.find((m) => m.id === id);
  return found ? found.name : "N/A";
}
function getBarangayName(barangaysData, id) {
  const found = barangaysData.find((b) => b.id === id);
  return found ? found.name : "N/A";
}
function getPurokName(puroksData, id) {
  const found = puroksData.find((p) => p.id === id);
  return found ? found.name : "N/A";
}

// -------------------- CUSTOM TOOLTIP COMPONENT --------------------
function CustomTooltip({ active, payload, label, userType }) {
  if (!active || !payload || !payload.length) return null;
  const { value, ownerName } = payload[0].payload;
  return (
    <div style={{ backgroundColor: "#fff", padding: 8, border: "1px solid #ccc" }}>
      <p>{label}</p>
      <p>Value: {value}</p>
      {userType === "Super Admin" && ownerName && <p>Owner: {ownerName}</p>}
    </div>
  );
}

/* =================== DASHBOARD HEADER (STATS) =================== */
const DashboardHeader = ({
  entries,
  contaminatedEntries,
  unownedEntries,
  unownedContaminatedEntries,
}) => {
  const HIGH_SALINITY_MIN = 5;
  const HIGH_SALINITY_MAX = 35;
  const LOW_PH_THRESHOLD = 7;

  const allWells = [
    ...entries,
    ...contaminatedEntries,
    ...unownedEntries,
    ...unownedContaminatedEntries,
  ];

  const highSalinityWells = allWells.filter(
    (well) =>
      well.salinity_level &&
      well.salinity_level >= HIGH_SALINITY_MIN &&
      well.salinity_level <= HIGH_SALINITY_MAX
  );

  const lowPHWells = allWells.filter(
    (well) => well.ph_level && well.ph_level < LOW_PH_THRESHOLD
  );

  const totalWellCount =
    entries.length +
    contaminatedEntries.length +
    unownedEntries.length +
    unownedContaminatedEntries.length;

  const contaminatedWellCount = contaminatedEntries.length;
  const highSalinityCount = highSalinityWells.length;
  const lowPHCount = lowPHWells.length;

  const [showModal, setShowModal] = useState(null);

  const handleStatClick = (statKey) => {
    setShowModal(statKey);
  };

  const stats = [
    { label: "Total Well Count", value: totalWellCount, className: "total", onClickKey: "total" },
    { label: "Contaminated Well", value: contaminatedWellCount, className: "contaminated", onClickKey: "contaminated" },
    { label: "Wells with High Salinity", value: highSalinityCount, className: "high-salinity", onClickKey: "highSalinity" },
    { label: "Wells with Low pH Level", value: lowPHCount, className: "low-ph", onClickKey: "lowPH" },
  ];

  return (
    <div style={styles.statsContainer}>
      <h2 style={styles.statsTitle}>Dashboard - All Wells</h2>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              ...styles.statBox,
              ...(stat.className === "contaminated" ? styles.contaminated : {}),
              ...(stat.className === "high-salinity" ? styles.highSalinity : {}),
              ...(stat.className === "low-ph" ? styles.lowPH : {}),
            }}
            onClick={() => handleStatClick(stat.onClickKey)}
          >
            {stat.label}
            <h2
              style={{
                ...styles.statValue,
                ...(stat.className === "contaminated" ? styles.contaminated : {}),
                ...(stat.className === "high-salinity" ? styles.highSalinity : {}),
                ...(stat.className === "low-ph" ? styles.lowPH : {}),
              }}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Modal for Stats (just like BarangayCont's approach) */}
      {showModal === "total" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Total Wells</h2>
            <p>
              There are <b>{totalWellCount}</b> wells.
            </p>
            <button onClick={() => setShowModal(null)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {showModal === "contaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Contaminated Wells</h2>
            <p>Total contaminated wells: <b>{contaminatedWellCount}</b></p>
            <button onClick={() => setShowModal(null)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {showModal === "highSalinity" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Wells with High Salinity</h2>
            <p>Salinity between {HIGH_SALINITY_MIN} and {HIGH_SALINITY_MAX} ppt:</p>
            {/* Could display a table of wells with high salinity */}
            <button onClick={() => setShowModal(null)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {showModal === "lowPH" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Wells with Low pH</h2>
            <p>Below pH {LOW_PH_THRESHOLD}:</p>
            {/* Could display a table of low pH wells */}
            <button onClick={() => setShowModal(null)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* =================== CHART BOX (Like in BarangayCont) =================== */
const ChartBox = ({ title, description, color, yAxisLabel, data, valueKey }) => {
  const userType = localStorage.getItem("userType") || "Normal User";
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [startMonth, setStartMonth] = useState("01");
  const [endMonth, setEndMonth] = useState("12");

  const filteredData = useMemo(() => {
    const raw = data.filter((well) => {
      if (!well.date_added) return false;
      const [year, mm] = well.date_added.split("-");
      if (year !== selectedYear) return false;
      const monthNum = parseInt(mm, 10);
      const startNum = parseInt(startMonth, 10);
      const endNum = parseInt(endMonth, 10);
      return monthNum >= startNum && monthNum <= endNum;
    });

    const groups = {};
    raw.forEach((well) => {
      const [, mm] = well.date_added.split("-");
      if (!groups[mm]) groups[mm] = [];
      groups[mm].push(well);
    });

    const aggregated = Object.keys(groups).map((mm) => {
      const group = groups[mm];
      let selectedWell = null;

      if (valueKey === "salinity_level") {
        let maxVal = 0;
        group.forEach((w) => {
          const val = parseFloat(w.salinity_level) || 0;
          if (val > maxVal) {
            maxVal = val;
            selectedWell = w;
          }
        });
      } else if (valueKey === "ph_level") {
        let minVal = 14;
        group.forEach((w) => {
          const val = parseFloat(w.ph_level) || 14;
          if (val < minVal) {
            minVal = val;
            selectedWell = w;
          }
        });
      }

      const monthNum = parseInt(mm, 10);
      let reading = 0;
      let ownerName = null;
      if (selectedWell) {
        reading =
          valueKey === "salinity_level"
            ? parseFloat(selectedWell.salinity_level) || 0
            : parseFloat(selectedWell.ph_level) || 14;

        ownerName = selectedWell.first_name
          ? `${selectedWell.first_name} ${selectedWell.last_name}`
          : "Unowned";
      }

      return {
        month: monthNum,
        date: getMonthName(monthNum),
        value: reading,
        ownerName,
      };
    });

    aggregated.sort((a, b) => a.month - b.month);
    return aggregated;
  }, [data, selectedYear, startMonth, endMonth, valueKey]);

  const isPH = valueKey === "ph_level";

  return (
    <div style={styles.chartBox}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={styles.chartTitle}>{title}</h3>
        <div>
          <select style={styles.inputSelect} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {years.map((y) => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
          <select style={styles.inputSelect} value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
            <option value="01">Jan</option>
            <option value="02">Feb</option>
            <option value="03">Mar</option>
            <option value="04">Apr</option>
            <option value="05">May</option>
            <option value="06">Jun</option>
            <option value="07">Jul</option>
            <option value="08">Aug</option>
            <option value="09">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
          <select style={styles.inputSelect} value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
            <option value="01">Jan</option>
            <option value="02">Feb</option>
            <option value="03">Mar</option>
            <option value="04">Apr</option>
            <option value="05">May</option>
            <option value="06">Jun</option>
            <option value="07">Jul</option>
            <option value="08">Aug</option>
            <option value="09">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
        </div>
      </div>
      <p style={styles.chartDescription}>{description}</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="date" tick={{ fill: "#666" }} />
          {isPH ? (
            <YAxis
              reversed
              domain={[0, 14]}
              tick={{ fill: "#666" }}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft", fill: "#666" }}
            />
          ) : (
            <YAxis
              tick={{ fill: "#666" }}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft", fill: "#666" }}
            />
          )}
          <Tooltip content={<CustomTooltip userType={userType} />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/* =================== MAIN COMPONENT: Dashboard =================== */
const Dashboard = () => {
  // Well data states
  const [entries, setEntries] = useState([]); 
  const [contaminatedEntries, setContaminatedEntries] = useState([]);
  const [unownedEntries, setUnownedEntries] = useState([]);
  const [unownedContaminatedEntries, setUnownedContaminatedEntries] = useState([]);

  // Location data states
  const [municipalitiesData, setMunicipalitiesData] = useState([]);
  const [barangaysData, setBarangaysData] = useState([]);
  const [puroksData, setPuroksData] = useState([]);

  const [activeTab, setActiveTab] = useState("wells");

  // EXACT same formData structure as BarangayCont
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    municipality: "",
    barangay: "",
    purok: "",
    salinity: "",
    phLevel: "",
    contaminationType: "",
    riskLevel: "",
    location: "",
    dateAdded: "",
  });

  const [showModal, setShowModal] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  // ========== 1) FETCH WELL DATA ==========
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/sensors").then((res) => res.json()),
      fetch("http://localhost:5000/api/contaminated-wells").then((res) => res.json()),
      fetch("http://localhost:5000/api/unowned-wells-clean").then((res) => res.json()),
      fetch("http://localhost:5000/api/contaminated-wells-unowned").then((res) => res.json()),
    ])
      .then(([sensors, contaminated, unowned, unownedContaminated]) => {
        setEntries(sensors);
        setContaminatedEntries(contaminated);
        setUnownedEntries(unowned);
        setUnownedContaminatedEntries(unownedContaminated);
      })
      .catch((err) => console.error("Error fetching well data:", err));
  }, []);

  // ========== 2) FETCH LOCATION DATA ==========
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/location/municipalities").then((res) => res.json()),
      fetch("http://localhost:5000/api/location/barangays").then((res) => res.json()),
      fetch("http://localhost:5000/api/location/purok").then((res) => res.json()),
    ])
      .then(([municipalities, barangays, puroks]) => {
        setMunicipalitiesData(Array.isArray(municipalities) ? municipalities : []);
        setBarangaysData(Array.isArray(barangays) ? barangays : []);
        setPuroksData(Array.isArray(puroks) ? puroks : []);
      })
      .catch((err) => console.error("Error fetching location data:", err));
  }, []);

  // Helper for switching tabs
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Clear form data
  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      contact: "",
      municipality: "",
      barangay: "",
      purok: "",
      salinity: "",
      phLevel: "",
      contaminationType: "",
      riskLevel: "",
      location: "",
      dateAdded: "",
    });
    setEditingIndex(null);
  };

  // The “Add New” button uses the active tab to decide which modal
  const handleAddNewClick = () => {
    resetForm();
    if (activeTab === "wells") setShowModal("addWells");
    else if (activeTab === "contaminated") setShowModal("addContaminated");
    else if (activeTab === "unowned") setShowModal("addUnowned");
    else if (activeTab === "unownedContaminated") setShowModal("addUnownedContaminated");
  };

  /* ============== CREATE (Add) ============== */
  const handleSaveEntry = (type) => {
    // This is where you'd do your checks, just like BarangayCont:
    // e.g. check if pH is out of range, or if municipality/barangay/purok is selected, etc.

    if (type === "wells") {
      // Build new sensorData
      const newWell = {
        first_name: formData.firstname,
        last_name: formData.lastname,
        contact_no: formData.contact,
        municipality_id: parseInt(formData.municipality, 10),
        barangay_id: parseInt(formData.barangay, 10),
        purok_id: parseInt(formData.purok, 10),
        salinity_level: parseFloat(formData.salinity) || 0,
        ph_level: parseFloat(formData.phLevel) || 0,
        date_added: new Date().toISOString().split("T")[0],
      };
      // For now, just push to local state:
      setEntries((prev) => [...prev, newWell]);
    } 
    else if (type === "contaminated") {
      const newContaminated = {
        owner_first_name: formData.firstname,
        owner_last_name: formData.lastname,
        owner_contact_no: formData.contact,
        municipality_id: parseInt(formData.municipality, 10),
        barangay_id: parseInt(formData.barangay, 10),
        purok_id: parseInt(formData.purok, 10),
        location: formData.location,
        contamination_type: formData.contaminationType,
        risk_level: formData.riskLevel,
        date_added: new Date().toISOString().split("T")[0],
      };
      setContaminatedEntries((prev) => [...prev, newContaminated]);
    }
    else if (type === "unowned") {
      const newUnowned = {
        municipality_id: parseInt(formData.municipality, 10),
        barangay_id: parseInt(formData.barangay, 10),
        purok_id: parseInt(formData.purok, 10),
        location: formData.location,
        salinity_level: parseFloat(formData.salinity) || 0,
        ph_level: parseFloat(formData.phLevel) || 0,
        date_added: new Date().toISOString().split("T")[0],
      };
      setUnownedEntries((prev) => [...prev, newUnowned]);
    }
    else if (type === "unownedContaminated") {
      const newUnownedContam = {
        municipality_id: parseInt(formData.municipality, 10),
        barangay_id: parseInt(formData.barangay, 10),
        purok_id: parseInt(formData.purok, 10),
        location: formData.location,
        contamination_type: formData.contaminationType,
        risk_level: formData.riskLevel,
        date_added: new Date().toISOString().split("T")[0],
      };
      setUnownedContaminatedEntries((prev) => [...prev, newUnownedContam]);
    }
    setShowModal(null);
    resetForm();
  };

  /* ============== EDIT (Load data) ============== */
  const handleEdit = (index, type) => {
    let selected = null;
    if (type === "wells") selected = entries[index];
    else if (type === "contaminated") selected = contaminatedEntries[index];
    else if (type === "unowned") selected = unownedEntries[index];
    else if (type === "unownedContaminated") selected = unownedContaminatedEntries[index];

    if (!selected) return;
    setEditingIndex(index);

    // Fill formData. Note the difference in field names between sensor vs. contaminated:
    setFormData({
      firstname: selected.first_name || selected.owner_first_name || "",
      lastname: selected.last_name || selected.owner_last_name || "",
      contact: selected.contact_no || selected.owner_contact_no || "",
      municipality: selected.municipality_id ? String(selected.municipality_id) : "",
      barangay: selected.barangay_id ? String(selected.barangay_id) : "",
      purok: selected.purok_id ? String(selected.purok_id) : "",
      salinity: selected.salinity_level ? String(selected.salinity_level) : "",
      phLevel: selected.ph_level ? String(selected.ph_level) : "",
      contaminationType: selected.contamination_type || "",
      riskLevel: selected.risk_level || "",
      location: selected.location || "",
      dateAdded: selected.date_added || "",
    });

    if (type === "wells") setShowModal("editWells");
    else if (type === "contaminated") setShowModal("editContaminated");
    else if (type === "unowned") setShowModal("editUnowned");
    else if (type === "unownedContaminated") setShowModal("editUnownedContaminated");
  };

  /* ============== UPDATE (Save edit) ============== */
  const handleSaveEdit = (type) => {
    if (editingIndex === null) return;

    // Build updated object
    if (type === "wells") {
      const updated = [...entries];
      updated[editingIndex] = {
        ...updated[editingIndex],
        first_name: formData.firstname,
        last_name: formData.lastname,
        contact_no: formData.contact,
        municipality_id: parseInt(formData.municipality, 10),
        barangay_id: parseInt(formData.barangay, 10),
        purok_id: parseInt(formData.purok, 10),
        salinity_level: parseFloat(formData.salinity) || 0,
        ph_level: parseFloat(formData.phLevel) || 0,
      };
      setEntries(updated);
    }
    else if (type === "contaminated") {
      const updated = [...contaminatedEntries];
      updated[editingIndex] = {
        ...updated[editingIndex],
        owner_first_name: formData.firstname,
        owner_last_name: formData.lastname,
        owner_contact_no: formData.contact,
        municipality_id: parseInt(formData.municipality, 10),
        barangay_id: parseInt(formData.barangay, 10),
        purok_id: parseInt(formData.purok, 10),
        location: formData.location,
        contamination_type: formData.contaminationType,
        risk_level: formData.riskLevel,
      };
      setContaminatedEntries(updated);
    }
    else if (type === "unowned") {
      const updated = [...unownedEntries];
      updated[editingIndex] = {
        ...updated[editingIndex],
        municipality_id: parseInt(formData.municipality, 10),
        barangay_id: parseInt(formData.barangay, 10),
        purok_id: parseInt(formData.purok, 10),
        location: formData.location,
        salinity_level: parseFloat(formData.salinity) || 0,
        ph_level: parseFloat(formData.phLevel) || 0,
      };
      setUnownedEntries(updated);
    }
    else if (type === "unownedContaminated") {
      const updated = [...unownedContaminatedEntries];
      updated[editingIndex] = {
        ...updated[editingIndex],
        municipality_id: parseInt(formData.municipality, 10),
        barangay_id: parseInt(formData.barangay, 10),
        purok_id: parseInt(formData.purok, 10),
        location: formData.location,
        contamination_type: formData.contaminationType,
        risk_level: formData.riskLevel,
      };
      setUnownedContaminatedEntries(updated);
    }

    setShowModal(null);
    setEditingIndex(null);
  };

  /* ============== DELETE ============== */
  const handleDelete = (index, type) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    if (type === "wells") {
      setEntries(entries.filter((_, i) => i !== index));
    }
    else if (type === "contaminated") {
      setContaminatedEntries(contaminatedEntries.filter((_, i) => i !== index));
    }
    else if (type === "unowned") {
      setUnownedEntries(unownedEntries.filter((_, i) => i !== index));
    }
    else if (type === "unownedContaminated") {
      setUnownedContaminatedEntries(unownedContaminatedEntries.filter((_, i) => i !== index));
    }
  };

  // Combine all wells for the chart
  const allWells = [
    ...entries,
    ...contaminatedEntries,
    ...unownedEntries,
    ...unownedContaminatedEntries,
  ];

  return (
    <div style={styles.container}>
      {/* Header Stats + Charts */}
      <DashboardHeader
        entries={entries}
        contaminatedEntries={contaminatedEntries}
        unownedEntries={unownedEntries}
        unownedContaminatedEntries={unownedContaminatedEntries}
      />

      <div style={styles.chartsGrid}>
        <ChartBox
          title="SALINITY LEVEL"
          description="Amount of dissolved salts present in water."
          color="blue"
          yAxisLabel="Salinity (ppt)"
          data={allWells}
          valueKey="salinity_level"
        />
        <ChartBox
          title="PH LEVEL"
          description="Measures acidity or alkalinity (below 7 acidic, above 7 alkaline)."
          color="red"
          yAxisLabel="pH Level"
          data={allWells}
          valueKey="ph_level"
        />
      </div>

      {/* TABS */}
      <div style={styles.tabsContainer}>
        <button
          style={activeTab === "wells" ? styles.activeTab : styles.tab}
          onClick={() => handleTabClick("wells")}
        >
          Wells
        </button>
        <button
          style={activeTab === "contaminated" ? styles.activeTab : styles.tab}
          onClick={() => handleTabClick("contaminated")}
        >
          Contaminated Wells
        </button>
        <button
          style={activeTab === "unowned" ? styles.activeTab : styles.tab}
          onClick={() => handleTabClick("unowned")}
        >
          Unowned Wells
        </button>
        <button
          style={activeTab === "unownedContaminated" ? styles.activeTab : styles.tab}
          onClick={() => handleTabClick("unownedContaminated")}
        >
          Unowned Contaminated Wells
        </button>
      </div>

      <div style={styles.headerContainer}>
        <h2>Recent Wells</h2>
        <button onClick={handleAddNewClick} style={styles.button}>
          + Add New
        </button>
      </div>

      {/* TABLES (Just like BarangayCont) */}
      {activeTab === "wells" && (
        <>
          <h2>Wells</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Firstname</th>
                  <th style={styles.th}>Lastname</th>
                  <th style={styles.th}>Contact No.</th>
                  <th style={styles.th}>Municipality</th>
                  <th style={styles.th}>Barangay</th>
                  <th style={styles.th}>Purok</th>
                  <th style={styles.th}>Salinity</th>
                  <th style={styles.th}>pH Level</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{entry.first_name || "N/A"}</td>
                    <td style={styles.td}>{entry.last_name || "N/A"}</td>
                    <td style={styles.td}>{entry.contact_no || "N/A"}</td>
                    <td style={styles.td}>{getMunicipalityName(municipalitiesData, entry.municipality_id)}</td>
                    <td style={styles.td}>{getBarangayName(barangaysData, entry.barangay_id)}</td>
                    <td style={styles.td}>{getPurokName(puroksData, entry.purok_id)}</td>
                    <td style={styles.td}>{entry.salinity_level || "N/A"}</td>
                    <td style={styles.td}>{entry.ph_level || "N/A"}</td>
                    <td style={styles.td}>{entry.date_added || "N/A"}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(index, "wells")} style={styles.editButton}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(index, "wells")} style={styles.deleteButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "contaminated" && (
        <>
          <h2>Contaminated Wells</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Owner Firstname</th>
                  <th style={styles.th}>Owner Lastname</th>
                  <th style={styles.th}>Owner Contact</th>
                  <th style={styles.th}>Municipality</th>
                  <th style={styles.th}>Barangay</th>
                  <th style={styles.th}>Purok</th>
                  <th style={styles.th}>Contamination Type</th>
                  <th style={styles.th}>Risk Level</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contaminatedEntries.map((entry, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{entry.owner_first_name || "N/A"}</td>
                    <td style={styles.td}>{entry.owner_last_name || "N/A"}</td>
                    <td style={styles.td}>{entry.owner_contact_no || "N/A"}</td>
                    <td style={styles.td}>{getMunicipalityName(municipalitiesData, entry.municipality_id)}</td>
                    <td style={styles.td}>{getBarangayName(barangaysData, entry.barangay_id)}</td>
                    <td style={styles.td}>{getPurokName(puroksData, entry.purok_id)}</td>
                    <td style={styles.td}>{entry.contamination_type || "N/A"}</td>
                    <td style={styles.td}>{entry.risk_level || "N/A"}</td>
                    <td style={styles.td}>{entry.date_added || "N/A"}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(index, "contaminated")} style={styles.editButton}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(index, "contaminated")} style={styles.deleteButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "unowned" && (
        <>
          <h2>Unowned Wells</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Municipality</th>
                  <th style={styles.th}>Barangay</th>
                  <th style={styles.th}>Purok</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Salinity</th>
                  <th style={styles.th}>pH Level</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unownedEntries.map((entry, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{getMunicipalityName(municipalitiesData, entry.municipality_id)}</td>
                    <td style={styles.td}>{getBarangayName(barangaysData, entry.barangay_id)}</td>
                    <td style={styles.td}>{getPurokName(puroksData, entry.purok_id)}</td>
                    <td style={styles.td}>{entry.location || "N/A"}</td>
                    <td style={styles.td}>{entry.salinity_level || "N/A"}</td>
                    <td style={styles.td}>{entry.ph_level || "N/A"}</td>
                    <td style={styles.td}>{entry.date_added || "N/A"}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(index, "unowned")} style={styles.editButton}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(index, "unowned")} style={styles.deleteButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "unownedContaminated" && (
        <>
          <h2>Unowned Contaminated Wells</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Municipality</th>
                  <th style={styles.th}>Barangay</th>
                  <th style={styles.th}>Purok</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Contamination Type</th>
                  <th style={styles.th}>Risk Level</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unownedContaminatedEntries.map((entry, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{getMunicipalityName(municipalitiesData, entry.municipality_id)}</td>
                    <td style={styles.td}>{getBarangayName(barangaysData, entry.barangay_id)}</td>
                    <td style={styles.td}>{getPurokName(puroksData, entry.purok_id)}</td>
                    <td style={styles.td}>{entry.location || "N/A"}</td>
                    <td style={styles.td}>{entry.contamination_type || "N/A"}</td>
                    <td style={styles.td}>{entry.risk_level || "N/A"}</td>
                    <td style={styles.td}>{entry.date_added || "N/A"}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(index, "unownedContaminated")} style={styles.editButton}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(index, "unownedContaminated")} style={styles.deleteButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ============= MODALS for ADD/EDIT (just like BarangayCont) ============= */}

      {/* ADD WELLS */}
      {showModal === "addWells" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add New Well</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Firstname"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Lastname"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contact No."
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            {/* The location selects */}
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
            />
            <br />
            <center>
              <button onClick={() => handleSaveEntry("wells")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}

      {/* ADD CONTAMINATED */}
      {showModal === "addContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add Contaminated Well</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Firstname"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Lastname"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Contact No."
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contamination Type"
              value={formData.contaminationType}
              onChange={(e) => setFormData({ ...formData, contaminationType: e.target.value })}
            />
            <select
              style={styles.input1}
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
            >
              <option value="">Select Risk Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <br />
            <center>
              <button onClick={() => handleSaveEntry("contaminated")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}

      {/* ADD UNOWNED */}
      {showModal === "addUnowned" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add Unowned Well</h2>
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
            />
            <br />
            <center>
              <button onClick={() => handleSaveEntry("unowned")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}

      {/* ADD UNOWNED CONTAMINATED */}
      {showModal === "addUnownedContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add Unowned Contaminated Well</h2>
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contamination Type"
              value={formData.contaminationType}
              onChange={(e) => setFormData({ ...formData, contaminationType: e.target.value })}
            />
            <select
              style={styles.input1}
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
            >
              <option value="">Select Risk Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <br />
            <center>
              <button onClick={() => handleSaveEntry("unownedContaminated")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}

      {/* EDIT WELLS */}
      {showModal === "editWells" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Wells Entry</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Firstname"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Lastname"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contact No."
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
            />
            <br />
            <center>
              <button onClick={() => handleSaveEdit("wells")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}

      {/* EDIT CONTAMINATED */}
      {showModal === "editContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Contaminated Well</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Firstname"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Lastname"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Contact No."
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contamination Type"
              value={formData.contaminationType}
              onChange={(e) => setFormData({ ...formData, contaminationType: e.target.value })}
            />
            <select
              style={styles.input1}
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
            >
              <option value="">Select Risk Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <br />
            <center>
              <button onClick={() => handleSaveEdit("contaminated")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}

      {/* EDIT UNOWNED */}
      {showModal === "editUnowned" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Unowned Well</h2>
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
            />
            <br />
            <center>
              <button onClick={() => handleSaveEdit("unowned")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}

      {/* EDIT UNOWNED CONTAMINATED */}
      {showModal === "editUnownedContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Unowned Contaminated Well</h2>
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contamination Type"
              value={formData.contaminationType}
              onChange={(e) => setFormData({ ...formData, contaminationType: e.target.value })}
            />
            <select
              style={styles.input1}
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
            >
              <option value="">Select Risk Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <br />
            <center>
              <button onClick={() => handleSaveEdit("unownedContaminated")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}
    </div>
  );
};

/* =================== STYLES =================== */
const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  statsContainer: {
    backgroundColor: "#f0f2f5",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "1rem",
  },
  statsTitle: { marginBottom: "0.75rem" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  statBox: {
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontWeight: "bold",
    border: "1px solid #000000",
    color: "#000000",
    cursor: "pointer",
  },
  statValue: { fontSize: "24px", marginTop: "8px" },
  contaminated: { color: "#33691E", borderColor: "#33691E" },
  highSalinity: { color: "#1877f2", borderColor: "#1877f2" },
  lowPH: { color: "#e63946", borderColor: "#e63946" },
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
  tabsContainer: { margin: "1rem 0" },
  tab: {
    backgroundColor: "#ddd",
    border: "none",
    padding: "8px 12px",
    marginRight: "5px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  activeTab: {
    backgroundColor: "blue",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    marginRight: "5px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tableContainer: { overflowX: "auto", marginBottom: "1rem" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { backgroundColor: "royalblue", color: "white", padding: "10px" },
  td: { padding: "10px", border: "1px solid #ddd", textAlign: "left" },
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
  closeButton: {
    marginTop: "10px",
    backgroundColor: "gray",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    width: "400px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  h2: { textAlign: "center" },
  input1: {
    margin: "5px",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  inputSelect: {
    marginLeft: "0.5rem",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  input: {
    margin: "5px 0",
    padding: "8px",
    width: "95%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

export default Dashboard;
