// file: src/pages/BarangayCont.js

import React, { useState, useEffect, useMemo } from "react";
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

// -------------------- WELL STATUS HELPER --------------------
// Multi-tiered logic example:
// - Very Unsafe: salinity > 5 or pH < 4 (blinking, smoky)
// - Consumable: salinity <= 0.5 and pH >= 7 (green glow)
// - Slightly Consumable: salinity <= 2 and pH >= 6 (golden glow)
// - Otherwise Unsafe: plain red bold text
const getWellStatus = (entry) => {
  // Use the available salinity value (salinity_level or salinity)
  const salinity = parseFloat(entry.salinity_level || entry.salinity) || 0;
  const pH = parseFloat(entry.ph_level) || 0;

  if (salinity > 5 || pH < 4) {
    return { text: "Very Unsafe", styleKey: "veryUnsafe" };
  }
  if (salinity <= 0.5 && pH >= 7) {
    return { text: "Consumable", styleKey: "consumable" };
  }
  if (salinity <= 2 && pH >= 6) {
    return { text: "Slightly Consumable", styleKey: "slightlyConsumable" };
  }
  return { text: "Unsafe", styleKey: "unsafe" };
};

// -------------------- HEADER COMPONENT --------------------
const BarangayContHeader = ({
  barangayName,
  entries,
  contaminatedEntries,
  unownedEntries,
  unownedContaminatedEntries,
}) => {
  const HIGH_SALINITY_MIN = 5;
  const HIGH_SALINITY_MAX = 35;
  const LOW_PH_THRESHOLD = 7;

  // Combine all wells
  const allWells = [
    ...entries,
    ...contaminatedEntries,
    ...unownedEntries,
    ...unownedContaminatedEntries,
  ];

  // Used for stats only
  const highSalinityWells = allWells.filter((well) => {
    const salinityValue = parseFloat(well.salinity_level || well.salinity) || 0;
    return salinityValue >= HIGH_SALINITY_MIN && salinityValue <= HIGH_SALINITY_MAX;
  });
  const lowPHWells = allWells.filter((well) => {
    const ph = parseFloat(well.ph_level);
    return ph < LOW_PH_THRESHOLD;
  });

  // Compute stats
  const totalWellCount = allWells.length;
  const contaminatedWellCount = contaminatedEntries.length;
  const highSalinityCount = highSalinityWells.length;
  const lowPHCount = lowPHWells.length;

  const [showModal, setShowModal] = useState(null);
  const handleStatClick = (statKey) => {
    setShowModal(statKey);
  };

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  const stats = [
    {
      label: "Total Well Count",
      value: totalWellCount,
      className: "total",
      onClickKey: "total",
    },
    {
      label: "Contaminated Well",
      value: contaminatedWellCount,
      className: "contaminated",
      onClickKey: "contaminated",
    },
    {
      label: "Wells with High Salinity",
      value: highSalinityCount,
      className: "highSalinity",
      onClickKey: "highSalinity",
    },
    {
      label: "Wells with Low pH Level",
      value: lowPHCount,
      className: "lowPH",
      onClickKey: "lowPH",
    },
  ];

  return (
    <div style={styles.dashboardContainer}>
      <h2>Barangay {capitalize(barangayName)}</h2>
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              ...styles.statBox,
              ...(stat.className === "contaminated" ? styles.contaminated : {}),
              ...(stat.className === "highSalinity" ? styles.highSalinity : {}),
              ...(stat.className === "lowPH" ? styles.lowPH : {}),
            }}
            onClick={() => handleStatClick(stat.onClickKey)}
          >
            {stat.label}
            <h2
              style={{
                ...styles.statValue,
                ...(stat.className === "contaminated" ? styles.contaminated : {}),
                ...(stat.className === "highSalinity" ? styles.highSalinity : {}),
                ...(stat.className === "lowPH" ? styles.lowPH : {}),
              }}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {showModal === "total" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Total Wells in {capitalize(barangayName)}</h2>
            <p>
              There are <b>{totalWellCount}</b> wells in this barangay.
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
            <h2>Contaminated Wells in {capitalize(barangayName)}</h2>
            <p>
              Total contaminated wells: <b>{contaminatedWellCount}</b>
            </p>
            <button onClick={() => setShowModal(null)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
      {showModal === "highSalinity" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Wells with High Salinity in {capitalize(barangayName)}</h2>
            <p>
              Displaying wells with salinity between{" "}
              <b>
                {HIGH_SALINITY_MIN} and {HIGH_SALINITY_MAX} ppt
              </b>
            </p>
            <button onClick={() => setShowModal(null)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
      {showModal === "lowPH" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Wells with Low pH in {capitalize(barangayName)}</h2>
            <p>
              Displaying wells with pH below <b>{LOW_PH_THRESHOLD}</b>
            </p>
            <button onClick={() => setShowModal(null)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------- SELECT LOCATION COMPONENT --------------------
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
          setFormData({
            ...formData,
            municipality: e.target.value,
            barangay: "",
            purok: "",
          })
        }
      >
        <option value="">Select a Municipality</option>
        {municipalitiesData.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <select
        style={styles.input1}
        value={formData.barangay}
        onChange={(e) =>
          setFormData({ ...formData, barangay: e.target.value, purok: "" })
        }
        disabled={!formData.municipality}
      >
        <option value="">Select a Barangay</option>
        {barangaysData
          .filter((b) => String(b.municipality_id) === formData.municipality)
          .map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
      </select>
      <select
        style={styles.input1}
        value={formData.purok}
        onChange={(e) => setFormData({ ...formData, purok: e.target.value })}
        disabled={!formData.barangay}
      >
        <option value="">Select a Purok</option>
        {puroksData
          .filter((p) => String(p.barangay_id) === formData.barangay)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </select>
    </>
  );
};

// -------------------- CUSTOM TOOLTIP COMPONENT --------------------
function CustomTooltip({ active, payload, label, canViewPersonalInfo }) {
  if (!active || !payload || !payload.length) return null;
  const { value, ownerName } = payload[0].payload;
  return (
    <div style={{ backgroundColor: "#fff", padding: 8, border: "1px solid #ccc" }}>
      <p>{label}</p>
      <p>Value: {value}</p>
      {canViewPersonalInfo && ownerName && <p>Owner: {ownerName}</p>}
    </div>
  );
}

// Helper to map month number to abbreviated name
function getMonthName(monthNum) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return monthNames[monthNum - 1] || "";
}

// -------------------- CHART BOX COMPONENT --------------------
const ChartBox = ({
  title,
  description,
  color,
  yAxisLabel,
  data,
  valueKey,
  canViewPersonalInfo,
}) => {
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
          <select
            style={styles.input1}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
          <select
            style={styles.input1}
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
          >
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
          <select
            style={styles.input1}
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
          >
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
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                fill: "#666",
              }}
            />
          ) : (
            <YAxis
              tick={{ fill: "#666" }}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                fill: "#666",
              }}
            />
          )}
          <Tooltip content={<CustomTooltip canViewPersonalInfo={canViewPersonalInfo} />} />
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

// -------------------- MAIN COMPONENT: BarangayCont --------------------
const BarangayCont = () => {
  const params = useParams();
  const routeBarangayName = params.barangayName;
  const storedBarangayName = localStorage.getItem("barangayName") || "";
  const displayBarangayName =
    routeBarangayName || storedBarangayName || "Selected Barangay";

  const userType = localStorage.getItem("userType") || "Normal User";
  const showActions = userType !== "Normal User";
  const assignedRepBarangay = storedBarangayName.toLowerCase();
  const canViewPersonalInfo =
    userType === "Super Admin" ||
    (userType === "Barangay Representative" &&
      displayBarangayName.toLowerCase() === assignedRepBarangay);

  const [entries, setEntries] = useState([]);
  const [contaminatedEntries, setContaminatedEntries] = useState([]);
  const [unownedEntries, setUnownedEntries] = useState([]);
  const [unownedContaminatedEntries, setUnownedContaminatedEntries] = useState([]);
  const [activeTab, setActiveTab] = useState("wells");
  const [purokFilter, setPurokFilter] = useState("All");
  const [showModal, setShowModal] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
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
    location: "",
    dateAdded: "",
  });

  const [municipalitiesData, setMunicipalitiesData] = useState([]);
  const [barangaysData, setBarangaysData] = useState([]);
  const [puroksData, setPuroksData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/location/municipalities").then((res) =>
        res.json()
      ),
      fetch("http://localhost:5000/api/location/barangays").then((res) =>
        res.json()
      ),
      fetch("http://localhost:5000/api/location/purok").then((res) => res.json()),
    ])
      .then(([municipalities, barangays, puroks]) => {
        setMunicipalitiesData(Array.isArray(municipalities) ? municipalities : []);
        setBarangaysData(Array.isArray(barangays) ? barangays : []);
        setPuroksData(Array.isArray(puroks) ? puroks : []);
      })
      .catch((err) => console.error("Error fetching location data:", err));
  }, []);

  useEffect(() => {
    if (displayBarangayName) {
      const currentBarangay = barangaysData.find(
        (b) => b.name.toLowerCase() === displayBarangayName.toLowerCase()
      );
      if (currentBarangay) {
        const barangayId = currentBarangay.id;
        Promise.all([
          fetch(`http://localhost:5000/api/sensors/barangay/${barangayId}`).then((res) =>
            res.json()
          ),
          fetch(`http://localhost:5000/api/contaminated-wells/barangay/${barangayId}`).then((res) =>
            res.json()
          ),
          fetch(`http://localhost:5000/api/unowned-wells-clean/barangay/${barangayId}`).then((res) =>
            res.json()
          ),
          fetch(`http://localhost:5000/api/contaminated-wells-unowned/barangay/${barangayId}`).then((res) =>
            res.json()
          ),
        ])
          .then(([sensors, contaminated, unowned, unownedContaminated]) => {
            setEntries(sensors);
            setContaminatedEntries(contaminated);
            setUnownedEntries(unowned);
            setUnownedContaminatedEntries(unownedContaminated);
          })
          .catch((err) => console.error("Error fetching well data:", err));
      }
    }
  }, [displayBarangayName, barangaysData]);

  const currentBarangay = useMemo(() => {
    return barangaysData.find(
      (b) => b.name.toLowerCase() === displayBarangayName.toLowerCase()
    );
  }, [barangaysData, displayBarangayName]);

  const filteredPuroksForDropdown = useMemo(() => {
    if (!currentBarangay) return puroksData;
    return puroksData.filter((p) => String(p.barangay_id) === String(currentBarangay.id));
  }, [puroksData, currentBarangay]);

  const getMunicipalityName = (id) => {
    const found = municipalitiesData.find((m) => m.id === id);
    return found ? found.name : "N/A";
  };
  const getBarangayName = (id) => {
    const found = barangaysData.find((b) => b.id === id);
    return found ? found.name : "N/A";
  };
  const getPurokName = (id) => {
    const found = puroksData.find((p) => p.id === id);
    return found ? found.name : "N/A";
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const filteredEntries = useMemo(() => {
    if (purokFilter === "All") return entries;
    return entries.filter((e) => String(e.purok_id) === purokFilter);
  }, [entries, purokFilter]);

  const filteredContaminated = useMemo(() => {
    if (purokFilter === "All") return contaminatedEntries;
    return contaminatedEntries.filter((e) => String(e.purok_id) === purokFilter);
  }, [contaminatedEntries, purokFilter]);

  const filteredUnowned = useMemo(() => {
    if (purokFilter === "All") return unownedEntries;
    return unownedEntries.filter((e) => String(e.purok_id) === purokFilter);
  }, [unownedEntries, purokFilter]);

  const filteredUnownedContaminated = useMemo(() => {
    if (purokFilter === "All") return unownedContaminatedEntries;
    return unownedContaminatedEntries.filter(
      (e) => String(e.purok_id) === purokFilter
    );
  }, [unownedContaminatedEntries, purokFilter]);

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
      location: "",
      dateAdded: "",
    });
    setEditingIndex(null);
  };

  const handleAddNewClick = () => {
    resetForm();
    if (activeTab === "wells") setShowModal("addWells");
    else if (activeTab === "contaminated") setShowModal("addContaminated");
    else if (activeTab === "unowned") setShowModal("addUnowned");
    else if (activeTab === "unownedContaminated")
      setShowModal("addUnownedContaminated");
  };

  // ========== CREATE (Add New) ==========
  const handleSaveEntry = (type) => {
    if (type === "wells") {
      const municipalityId = parseInt(formData.municipality, 10);
      const barangayId = parseInt(formData.barangay, 10);
      const purokId = parseInt(formData.purok, 10);
      if (!municipalityId || !barangayId || !purokId) {
        alert("Please select a valid Municipality, Barangay, and Purok.");
        return;
      }
      const phVal = parseFloat(formData.phLevel) || 0;
      const salVal = parseFloat(formData.salinity) || 0;
      const sensorData = {
        first_name: formData.firstname,
        last_name: formData.lastname,
        contact_no: formData.contact,
        municipality_id: municipalityId,
        barangay_id: barangayId,
        purok_id: purokId,
        ph_level: phVal,
        salinity_level: salVal,
        date_added: new Date().toISOString().split("T")[0],
      };
      fetch("http://localhost:5000/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sensorData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Error: " + data.error);
            return;
          }
          setEntries((prev) => [...prev, { ...sensorData, id: data.id }]);
          setShowModal(null);
        })
        .catch((err) => console.error("Error adding sensor:", err));
    } else if (type === "contaminated") {
      const municipalityId = parseInt(formData.municipality, 10);
      const barangayId = parseInt(formData.barangay, 10);
      const purokId = parseInt(formData.purok, 10);
      if (
        !municipalityId ||
        !barangayId ||
        !purokId ||
        !formData.location ||
        !formData.firstname ||
        !formData.lastname ||
        !formData.contact ||
        !formData.contaminationType ||
        !formData.phLevel ||
        !formData.salinity
      ) {
        alert("Please fill in all required fields for a contaminated well.");
        return;
      }
      const contaminatedData = {
        municipality_id: municipalityId,
        barangay_id: barangayId,
        purok_id: purokId,
        location: formData.location,
        owner_first_name: formData.firstname,
        owner_last_name: formData.lastname,
        owner_contact_no: formData.contact,
        contamination_type: formData.contaminationType,
        ph_level: parseFloat(formData.phLevel),
        salinity: parseFloat(formData.salinity)
      };

      fetch("http://localhost:5000/api/contaminated-wells/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contaminatedData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Error: " + data.error);
            return;
          }
          setContaminatedEntries((prev) => [
            ...prev,
            { ...contaminatedData, well_id: data.wellId },
          ]);
          setShowModal(null);
        })
        .catch((err) => console.error("Error adding contaminated well:", err));
    } else if (type === "unowned") {
      const municipalityId = parseInt(formData.municipality, 10);
      const barangayId = parseInt(formData.barangay, 10);
      const purokId = parseInt(formData.purok, 10);
      if (!municipalityId || !barangayId || !purokId || !formData.location) {
        alert("Please fill in all required fields for an unowned well.");
        return;
      }
      const phVal = parseFloat(formData.phLevel) || 0;
      const salVal = parseFloat(formData.salinity) || 0;
      const unownedData = {
        municipality_id: municipalityId,
        barangay_id: barangayId,
        purok_id: purokId,
        location: formData.location,
        ph_level: phVal,
        salinity_level: salVal,
      };

      fetch("http://localhost:5000/api/unowned-wells-clean/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unownedData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Error: " + data.error);
            return;
          }
          setUnownedEntries((prev) => [
            ...prev,
            { ...unownedData, well_id: data.well_id },
          ]);
          setShowModal(null);
        })
        .catch((err) => console.error("Error adding unowned well:", err));
    } else if (type === "unownedContaminated") {
      const municipalityId = parseInt(formData.municipality, 10);
      const barangayId = parseInt(formData.barangay, 10);
      const purokId = parseInt(formData.purok, 10);
      if (
        !municipalityId ||
        !barangayId ||
        !purokId ||
        !formData.location ||
        !formData.contaminationType ||
        !formData.phLevel ||
        !formData.salinity
      ) {
        alert("Please fill in all required fields for an unowned contaminated well.");
        return;
      }
      const unownedContaminatedData = {
        municipality_id: municipalityId,
        barangay_id: barangayId,
        purok_id: purokId,
        location: formData.location,
        contamination_type: formData.contaminationType,
        ph_level: parseFloat(formData.phLevel),
        salinity: parseFloat(formData.salinity)
      };

      fetch("http://localhost:5000/api/contaminated-wells-unowned/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unownedContaminatedData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Error: " + data.error);
            return;
          }
          setUnownedContaminatedEntries((prev) => [
            ...prev,
            { ...unownedContaminatedData, well_id: data.wellId },
          ]);
          setShowModal(null);
        })
        .catch((err) =>
          console.error("Error adding unowned contaminated well:", err)
        );
    }
    resetForm();
  };

  // ========== EDIT (Load data into form) ==========
  const handleEdit = (index, type) => {
    let selectedEntry = null;
    if (type === "wells") {
      selectedEntry = entries[index];
      setFormData({
        firstname: selectedEntry.first_name || "",
        lastname: selectedEntry.last_name || "",
        contact: selectedEntry.contact_no || "",
        municipality: selectedEntry.municipality_id?.toString() || "",
        barangay: selectedEntry.barangay_id?.toString() || "",
        purok: selectedEntry.purok_id?.toString() || "",
        salinity: selectedEntry.salinity_level?.toString() || "",
        phLevel: selectedEntry.ph_level?.toString() || "",
        contaminationType: "",
        location: selectedEntry.location || "",
        dateAdded: selectedEntry.date_added || "",
      });
      setEditingIndex(index);
      setShowModal("editWells");
    }
    else if (type === "contaminated") {
      selectedEntry = contaminatedEntries[index];
      setFormData({
        firstname: selectedEntry.owner_first_name || "",
        lastname: selectedEntry.owner_last_name || "",
        contact: selectedEntry.owner_contact_no || "",
        municipality: selectedEntry.municipality_id?.toString() || "",
        barangay: selectedEntry.barangay_id?.toString() || "",
        purok: selectedEntry.purok_id?.toString() || "",
        salinity: selectedEntry.salinity?.toString() || "",
        phLevel: selectedEntry.ph_level?.toString() || "",
        contaminationType: selectedEntry.contamination_type || "",
        location: selectedEntry.location || "",
        dateAdded: selectedEntry.date_added || "",
      });
      setEditingIndex(index);
      setShowModal("editContaminated");
    }
    else if (type === "unowned") {
      selectedEntry = unownedEntries[index];
      setFormData({
        firstname: "",
        lastname: "",
        contact: "",
        municipality: selectedEntry.municipality_id?.toString() || "",
        barangay: selectedEntry.barangay_id?.toString() || "",
        purok: selectedEntry.purok_id?.toString() || "",
        salinity: selectedEntry.salinity_level?.toString() || "",
        phLevel: selectedEntry.ph_level?.toString() || "",
        contaminationType: "",
        location: selectedEntry.location || "",
        dateAdded: selectedEntry.date_added || "",
      });
      setEditingIndex(index);
      setShowModal("editUnowned");
    }
    else if (type === "unownedContaminated") {
      selectedEntry = unownedContaminatedEntries[index];
      setFormData({
        firstname: "",
        lastname: "",
        contact: "",
        municipality: selectedEntry.municipality_id?.toString() || "",
        barangay: selectedEntry.barangay_id?.toString() || "",
        purok: selectedEntry.purok_id?.toString() || "",
        salinity: selectedEntry.salinity?.toString() || "",
        phLevel: selectedEntry.ph_level?.toString() || "",
        contaminationType: selectedEntry.contamination_type || "",
        location: selectedEntry.location || "",
        dateAdded: selectedEntry.date_added || "",
      });
      setEditingIndex(index);
      setShowModal("editUnownedContaminated");
    }
  };
  

  // ========== UPDATE (PUT request) ==========
  const handleSaveEdit = async (type) => {
    if (editingIndex === null) return;
    let itemToUpdate = null;
    let primaryKeyValue = null;
    let endpoint = "";
    let updatedData = {};

    if (type === "wells") {
      itemToUpdate = entries[editingIndex];
      primaryKeyValue = itemToUpdate.id;
      endpoint = `http://localhost:5000/api/sensors/${primaryKeyValue}`;
      updatedData = {
        first_name: formData.firstname,
        last_name: formData.lastname,
        contact_no: formData.contact,
        municipality_id: parseInt(formData.municipality, 10) || null,
        barangay_id: parseInt(formData.barangay, 10) || null,
        purok_id: parseInt(formData.purok, 10) || null,
        ph_level: parseFloat(formData.phLevel) || null,
        salinity_level: parseFloat(formData.salinity) || null,
      };
    } else if (type === "contaminated") {
      itemToUpdate = contaminatedEntries[editingIndex];
      primaryKeyValue = itemToUpdate.well_id;
      endpoint = `http://localhost:5000/api/contaminated-wells/${primaryKeyValue}`;
      updatedData = {
        municipality_id: parseInt(formData.municipality, 10) || null,
        barangay_id: parseInt(formData.barangay, 10) || null,
        purok_id: parseInt(formData.purok, 10) || null,
        location: formData.location,
        owner_first_name: formData.firstname,
        owner_last_name: formData.lastname,
        owner_contact_no: formData.contact,
        contamination_type: formData.contaminationType,
        ph_level: parseFloat(formData.phLevel) || null,
        salinity: parseFloat(formData.salinity) || null,
      };
    } else if (type === "unowned") {
      itemToUpdate = unownedEntries[editingIndex];
      primaryKeyValue = itemToUpdate.well_id;
      endpoint = `http://localhost:5000/api/unowned-wells-clean/${primaryKeyValue}`;
      updatedData = {
        municipality_id: parseInt(formData.municipality, 10) || null,
        barangay_id: parseInt(formData.barangay, 10) || null,
        purok_id: parseInt(formData.purok, 10) || null,
        location: formData.location,
        ph_level: parseFloat(formData.phLevel) || null,
        salinity_level: parseFloat(formData.salinity) || null,
      };
    } else if (type === "unownedContaminated") {
      itemToUpdate = unownedContaminatedEntries[editingIndex];
      primaryKeyValue = itemToUpdate.well_id;
      endpoint = `http://localhost:5000/api/contaminated-wells-unowned/${primaryKeyValue}`;
      updatedData = {
        municipality_id: parseInt(formData.municipality, 10) || null,
        barangay_id: parseInt(formData.barangay, 10) || null,
        purok_id: parseInt(formData.purok, 10) || null,
        location: formData.location,
        contamination_type: formData.contaminationType,
        ph_level: parseFloat(formData.phLevel) || null,
        salinity: parseFloat(formData.salinity) || null,
      };
    }
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
      if (type === "wells") {
        const updatedArr = [...entries];
        updatedArr[editingIndex] = { ...itemToUpdate, ...updatedData };
        setEntries(updatedArr);
      } else if (type === "contaminated") {
        const updatedArr = [...contaminatedEntries];
        updatedArr[editingIndex] = { ...itemToUpdate, ...updatedData };
        setContaminatedEntries(updatedArr);
      } else if (type === "unowned") {
        const updatedArr = [...unownedEntries];
        updatedArr[editingIndex] = { ...itemToUpdate, ...updatedData };
        setUnownedEntries(updatedArr);
      } else if (type === "unownedContaminated") {
        const updatedArr = [...unownedContaminatedEntries];
        updatedArr[editingIndex] = { ...itemToUpdate, ...updatedData };
        setUnownedContaminatedEntries(updatedArr);
      }
      alert(result.message || "Well updated successfully.");
    } catch (err) {
      console.error("Error updating well:", err);
      alert("Update request failed. Check console for details.");
    }
    setShowModal(null);
    setEditingIndex(null);
  };

  // ========== DELETE (Send DELETE request) ==========
  const handleDelete = async (index, type) => {
    let itemToDelete = null;
    let primaryKeyValue = null;
    let endpoint = "";
    if (type === "wells") {
      itemToDelete = entries[index];
      primaryKeyValue = itemToDelete.id;
      endpoint = `http://localhost:5000/api/sensors/${primaryKeyValue}`;
    } else if (type === "contaminated") {
      itemToDelete = contaminatedEntries[index];
      primaryKeyValue = itemToDelete.well_id;
      endpoint = `http://localhost:5000/api/contaminated-wells/${primaryKeyValue}`;
    } else if (type === "unowned") {
      itemToDelete = unownedEntries[index];
      primaryKeyValue = itemToDelete.well_id;
      endpoint = `http://localhost:5000/api/unowned-wells-clean/${primaryKeyValue}`;
    } else if (type === "unownedContaminated") {
      itemToDelete = unownedContaminatedEntries[index];
      primaryKeyValue = itemToDelete.well_id;
      endpoint = `http://localhost:5000/api/contaminated-wells-unowned/${primaryKeyValue}`;
    }
    if (!itemToDelete || !primaryKeyValue) return;
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        alert("Delete failed: " + (result.error || result.message));
        return;
      }
      if (type === "wells") {
        setEntries(entries.filter((_, i) => i !== index));
      } else if (type === "contaminated") {
        setContaminatedEntries(contaminatedEntries.filter((_, i) => i !== index));
      } else if (type === "unowned") {
        setUnownedEntries(unownedEntries.filter((_, i) => i !== index));
      } else if (type === "unownedContaminated") {
        setUnownedContaminatedEntries(
          unownedContaminatedEntries.filter((_, i) => i !== index)
        );
      }
      alert(result.message || "Well deleted successfully.");
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Delete request failed. Check console for details.");
    }
  };

  const allWells = [
    ...entries,
    ...contaminatedEntries,
    ...unownedEntries,
    ...unownedContaminatedEntries,
  ];

  return (
    <div style={styles.container}>
      {/* Inject keyframes for blinking effect */}
      <style dangerouslySetInnerHTML={{ __html: styles.keyframes }} />
      <BarangayContHeader
        barangayName={displayBarangayName}
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
          canViewPersonalInfo={canViewPersonalInfo}
        />
        <ChartBox
          title="PH LEVEL"
          description="Measures acidity or alkalinity (below 7 acidic, above 7 alkaline)."
          color="red"
          yAxisLabel="pH Level"
          data={allWells}
          valueKey="ph_level"
          canViewPersonalInfo={canViewPersonalInfo}
        />
      </div>
      <div style={styles.tabsContainer}>
        <div style={styles.tabButtons}>
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
            style={
              activeTab === "unownedContaminated" ? styles.activeTab : styles.tab
            }
            onClick={() => handleTabClick("unownedContaminated")}
          >
            Unowned Contaminated Wells
          </button>
        </div>
        <select
          style={styles.purokSelect}
          value={purokFilter}
          onChange={(e) => setPurokFilter(e.target.value)}
        >
          <option value="All">All Puroks</option>
          {filteredPuroksForDropdown.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.headerContainer}>
        <h2>
          {displayBarangayName
            ? displayBarangayName.charAt(0).toUpperCase() +
              displayBarangayName.slice(1)
            : "Selected Barangay"}
        </h2>
        {showActions && (
          <button onClick={handleAddNewClick} style={styles.button}>
            + Add New
          </button>
        )}
      </div>
      {/* ---------- Wells Table ---------- */}
      {activeTab === "wells" && (
        <>
          <h2>Wells</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {canViewPersonalInfo && (
                    <>
                      <th style={styles.th}>Firstname</th>
                      <th style={styles.th}>Lastname</th>
                      <th style={styles.th}>Contact No.</th>
                    </>
                  )}
                  <th style={styles.th}>Municipality</th>
                  <th style={styles.th}>Barangay</th>
                  <th style={styles.th}>Purok</th>
                  <th style={styles.th}>Salinity</th>
                  <th style={styles.th}>pH Level</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Status</th>
                  {showActions && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => {
                  const { text, styleKey } = getWellStatus(entry);
                  return (
                    <tr key={index}>
                      {canViewPersonalInfo && (
                        <>
                          <td style={styles.td}>{entry.first_name || "N/A"}</td>
                          <td style={styles.td}>{entry.last_name || "N/A"}</td>
                          <td style={styles.td}>{entry.contact_no || "N/A"}</td>
                        </>
                      )}
                      <td style={styles.td}>
                        {getMunicipalityName(entry.municipality_id)}
                      </td>
                      <td style={styles.td}>
                        {getBarangayName(entry.barangay_id)}
                      </td>
                      <td style={styles.td}>{getPurokName(entry.purok_id)}</td>
                      <td style={styles.td}>{entry.salinity_level || entry.salinity || "N/A"}</td>
                      <td style={styles.td}>{entry.ph_level || "N/A"}</td>
                      <td style={styles.td}>
                        {entry.date_added
                          ? entry.date_added.toString().slice(0, 10)
                          : "N/A"}
                      </td>
                      <td style={{ ...styles.td, ...styles[styleKey] }}>
                        {text}
                      </td>
                      {showActions && (
                        <td style={styles.td}>
                          <button
                            onClick={() => handleEdit(index, "wells")}
                            style={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index, "wells")}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* ---------- Contaminated Wells Table ---------- */}
      {activeTab === "contaminated" && (
        <>
          <h2>Contaminated Wells</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {canViewPersonalInfo && (
                    <>
                      <th style={styles.th}>Owner Firstname</th>
                      <th style={styles.th}>Owner Lastname</th>
                      <th style={styles.th}>Owner Contact</th>
                    </>
                  )}
                  <th style={styles.th}>Municipality</th>
                  <th style={styles.th}>Barangay</th>
                  <th style={styles.th}>Purok</th>
                  <th style={styles.th}>Contamination Type</th>
                  <th style={styles.th}>pH Level</th>
                  <th style={styles.th}>Salinity</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Status</th>
                  {showActions && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredContaminated.map((entry, index) => {
                  const { text, styleKey } = getWellStatus(entry);
                  return (
                    <tr key={index}>
                      {canViewPersonalInfo && (
                        <>
                          <td style={styles.td}>
                            {entry.owner_first_name || "N/A"}
                          </td>
                          <td style={styles.td}>
                            {entry.owner_last_name || "N/A"}
                          </td>
                          <td style={styles.td}>
                            {entry.owner_contact_no || "N/A"}
                          </td>
                        </>
                      )}
                      <td style={styles.td}>
                        {getMunicipalityName(entry.municipality_id)}
                      </td>
                      <td style={styles.td}>
                        {getBarangayName(entry.barangay_id)}
                      </td>
                      <td style={styles.td}>{getPurokName(entry.purok_id)}</td>
                      <td style={styles.td}>
                        {entry.contamination_type || "N/A"}
                      </td>
                      <td style={styles.td}>{entry.ph_level || "N/A"}</td>
                      <td style={styles.td}>{entry.salinity || entry.salinity_level || "N/A"}</td>
                      <td style={styles.td}>
                        {entry.date_added
                          ? entry.date_added.toString().slice(0, 10)
                          : "N/A"}
                      </td>
                      <td style={{ ...styles.td, ...styles[styleKey] }}>
                        {text}
                      </td>
                      {showActions && (
                        <td style={styles.td}>
                          <button
                            onClick={() => handleEdit(index, "contaminated")}
                            style={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index, "contaminated")}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* ---------- Unowned Wells Table ---------- */}
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
                  <th style={styles.th}>Status</th>
                  {showActions && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUnowned.map((entry, index) => {
                  const { text, styleKey } = getWellStatus(entry);
                  return (
                    <tr key={index}>
                      <td style={styles.td}>
                        {getMunicipalityName(entry.municipality_id)}
                      </td>
                      <td style={styles.td}>
                        {getBarangayName(entry.barangay_id)}
                      </td>
                      <td style={styles.td}>{getPurokName(entry.purok_id)}</td>
                      <td style={styles.td}>{entry.location || "N/A"}</td>
                      <td style={styles.td}>{entry.salinity_level || entry.salinity || "N/A"}</td>
                      <td style={styles.td}>{entry.ph_level || "N/A"}</td>
                      <td style={styles.td}>
                        {entry.date_added
                          ? entry.date_added.toString().slice(0, 10)
                          : "N/A"}
                      </td>
                      <td style={{ ...styles.td, ...styles[styleKey] }}>
                        {text}
                      </td>
                      {showActions && (
                        <td style={styles.td}>
                          <button
                            onClick={() => handleEdit(index, "unowned")}
                            style={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index, "unowned")}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* ---------- Unowned Contaminated Wells Table ---------- */}
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
                  <th style={styles.th}>pH Level</th>
                  <th style={styles.th}>Salinity</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Status</th>
                  {showActions && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUnownedContaminated.map((entry, index) => {
                  const { text, styleKey } = getWellStatus(entry);
                  return (
                    <tr key={index}>
                      <td style={styles.td}>
                        {getMunicipalityName(entry.municipality_id)}
                      </td>
                      <td style={styles.td}>
                        {getBarangayName(entry.barangay_id)}
                      </td>
                      <td style={styles.td}>{getPurokName(entry.purok_id)}</td>
                      <td style={styles.td}>{entry.location || "N/A"}</td>
                      <td style={styles.td}>
                        {entry.contamination_type || "N/A"}
                      </td>
                      <td style={styles.td}>{entry.ph_level || "N/A"}</td>
                      <td style={styles.td}>{entry.salinity || entry.salinity_level || "N/A"}</td>
                      <td style={styles.td}>
                        {entry.date_added
                          ? entry.date_added.toString().slice(0, 10)
                          : "N/A"}
                      </td>
                      <td style={{ ...styles.td, ...styles[styleKey] }}>
                        {text}
                      </td>
                      {showActions && (
                        <td style={styles.td}>
                          <button
                            onClick={() => handleEdit(index, "unownedContaminated")}
                            style={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index, "unownedContaminated")}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* ================= MODALS for Add/Edit ================= */}
      {/* Wells Add/Edit Modals */}
      {showModal === "addWells" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add New Well</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Firstname"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Lastname"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contact No."
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, salinity: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) =>
                setFormData({ ...formData, phLevel: e.target.value })
              }
            />
            <br />
            <center>
              <button
                onClick={() => handleSaveEntry("wells")}
                style={styles.editButton}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(null)}
                style={styles.deleteButton}
              >
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}
      {showModal === "editWells" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Wells Entry</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Firstname"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Lastname"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contact No."
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, salinity: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) =>
                setFormData({ ...formData, phLevel: e.target.value })
              }
            />
            <br />
            <center>
              <button
                onClick={() => handleSaveEdit("wells")}
                style={styles.editButton}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(null)}
                style={styles.deleteButton}
              >
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}
      {/* Contaminated Wells Add/Edit Modals */}
      {showModal === "addContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add New Contaminated Well</h2>
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Firstname"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Lastname"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Contact No."
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
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
              placeholder="Contamination Type"
              value={formData.contaminationType}
              onChange={(e) =>
                setFormData({ ...formData, contaminationType: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) =>
                setFormData({ ...formData, phLevel: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) =>
                setFormData({ ...formData, salinity: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <br />
            <center>
              <button
                onClick={() => handleSaveEntry("contaminated")}
                style={styles.editButton}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(null)}
                style={styles.deleteButton}
              >
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}
      {showModal === "editContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Contaminated Well</h2>
            {/* Owner Details */}
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Firstname"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Lastname"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Owner Contact No."
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
            {/* Location Selection */}
            <SelectLocation
              formData={formData}
              setFormData={setFormData}
              municipalitiesData={municipalitiesData}
              barangaysData={barangaysData}
              puroksData={puroksData}
            />
            {/* Well-specific Fields */}
            <input
              style={styles.input}
              type="text"
              placeholder="Contamination Type"
              value={formData.contaminationType}
              onChange={(e) =>
                setFormData({ ...formData, contaminationType: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) =>
                setFormData({ ...formData, phLevel: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) =>
                setFormData({ ...formData, salinity: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <br />
            <center>
              <button
                onClick={() => handleSaveEdit("contaminated")}
                style={styles.editButton}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(null)}
                style={styles.deleteButton}
              >
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}
      {/* Unowned Wells Add/Edit Modals */}
      {showModal === "addUnowned" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add New Unowned Well</h2>
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
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) =>
                setFormData({ ...formData, salinity: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) =>
                setFormData({ ...formData, phLevel: e.target.value })
              }
            />
            <br />
            <center>
              <button
                onClick={() => handleSaveEntry("unowned")}
                style={styles.editButton}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(null)}
                style={styles.deleteButton}
              >
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}
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
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) =>
                setFormData({ ...formData, salinity: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) =>
                setFormData({ ...formData, phLevel: e.target.value })
              }
            />
            <br />
            <center>
              <button
                onClick={() => handleSaveEdit("unowned")}
                style={styles.editButton}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(null)}
                style={styles.deleteButton}
              >
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}
      {/* Unowned Contaminated Wells Add/Edit Modals */}
      {showModal === "addUnownedContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Add New Unowned Contaminated Well</h2>
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
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contamination Type"
              value={formData.contaminationType}
              onChange={(e) =>
                setFormData({ ...formData, contaminationType: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) =>
                setFormData({ ...formData, phLevel: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) =>
                setFormData({ ...formData, salinity: e.target.value })
              }
            />
            <br />
            <center>
              <button
                onClick={() => handleSaveEntry("unownedContaminated")}
                style={styles.editButton}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(null)}
                style={styles.deleteButton}
              >
                Cancel
              </button>
            </center>
          </div>
        </div>
      )}
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
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Contamination Type"
              value={formData.contaminationType}
              onChange={(e) =>
                setFormData({ ...formData, contaminationType: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="pH Level"
              value={formData.phLevel}
              onChange={(e) =>
                setFormData({ ...formData, phLevel: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Salinity"
              value={formData.salinity}
              onChange={(e) =>
                setFormData({ ...formData, salinity: e.target.value })
              }
            />
            <br />
            <center>
              <button
                onClick={() => handleSaveEdit("unownedContaminated")}
                style={styles.editButton}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(null)}
                style={styles.deleteButton}
              >
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
  // Keyframes for blinking "Very Unsafe" effect
  keyframes: `
    @keyframes blinkSmoke {
      0% { text-shadow: 0 0 10px red; opacity: 1; }
      50% { text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000; opacity: 0.6; }
      100% { text-shadow: 0 0 10px red; opacity: 1; }
    }
  `,
  container: { padding: "20px" },
  dashboardContainer: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f2f5",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statBox: {
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontWeight: "bold",
    border: "1px solid #000000",
    color: "#000000",
    cursor: "pointer",
  },
  statValue: { fontSize: "24px", color: "#333" },
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
  tabsContainer: {
    margin: "20px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabButtons: {
    display: "flex",
    gap: "10px",
  },
  tab: {
    backgroundColor: "#f0f0f0",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  activeTab: {
    backgroundColor: "royalblue",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  purokSelect: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
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
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "5px",
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
    zIndex: 9999,
  },
  modalContent: {
    width: "400px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
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
  input: {
    margin: "5px 0",
    padding: "8px",
    width: "95%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  input1: {
    margin: "5px",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  // -------------- Dynamic Status Styles --------------
  consumable: {
    fontWeight: "bold",
    color: "green",
    textShadow: "0 0 5px green",
  },
  slightlyConsumable: {
    fontWeight: "bold",
    color: "goldenrod",
    textShadow: "0 0 4px goldenrod",
  },
  unsafe: {
    fontWeight: "bold",
    color: "red",
  },
  veryUnsafe: {
    fontWeight: "bold",
    color: "red",
    animation: "blinkSmoke 1.5s infinite",
  },
};

export default BarangayCont;
