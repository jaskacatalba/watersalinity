import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";



const Circulo = () => {

  const salinityData = [
    { month: "Jan", level: 20 },
    { month: "Feb", level: 40 },
    { month: "Mar", level: 90 },
    { month: "Apr", level: 120 },
    { month: "May", level: 90 },
    { month: "Jun", level: 30 },
    { month: "Jul", level: 80 },
    { month: "Aug", level: 80 },
    { month: "Sep", level: 120 },
    { month: "Oct", level: 50 },
    { month: "Nov", level: 120 },
    { month: "Dec", level: 90 },
  ];

  const pHData = [
    { month: "Jan", level: 6.5 },
    { month: "Feb", level: 6.8 },
    { month: "Mar", level: 6.0 },
    { month: "Apr", level: 7.5 },
    { month: "May", level: 7.0 },
    { month: "Jun", level: 5.0 },
    { month: "Jul", level: 6.8 },
    { month: "Aug", level: 7.2 },
    { month: "Sep", level: 7.5 },
    { month: "Oct", level: 7.0 },
    { month: "Nov", level: 6.5 },
    { month: "Dec", level: 6.8 },
  ];

  const stats = [
    { label: "Total Well Count", value: 123 },
    { label: "Contaminated Well", value: 23, className: "contaminated" },
    { label: "Wells with High Salinity", value: 10, className: "high-salinity" },
    { label: "Wells with Low pH Level", value: 9, className: "low-ph" },
  ];

  //const wells = [
  //  { firstName: "Radnie", lastName: "Thagay", municipality: "Bantayan", barangay: "Sillon", sitio: "Kolo", contact: "091234567", salinity: "0.01%", ph: "6%", dateAdded:"3/3/2025" },
  //  { firstName: "Jaska", lastName: "Catigbaw", municipality: "Madredijos", barangay: "Pill", sitio: "Kano", contact: "0912340679", salinity: "0%", ph: "9%", dateAdded:"3/3/2025" },
  //];


  return (
      <div style={styles.dashboardContainer}>
        <h2>Bantayan, Barangay Ticad, Circulo</h2>
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={{ ...styles.statBox, ...(stat.className === "contaminated" ? styles.contaminated : {}), ...(stat.className === "high-salinity" ? styles.highSalinity : {}), ...(stat.className === "low-ph" ? styles.lowPH : {}) }}>
            {stat.label}
            <h2 style={{...styles.statValue, ...(stat.className === "contaminated" ? styles.contaminated : {}), ...(stat.className === "high-salinity" ? styles.highSalinity : {}), ...(stat.className === "low-ph" ? styles.lowPH : {})}}>{stat.value}</h2>
          </div>
        ))}
      </div>
      <div style={styles.chartsGrid}>
        <ChartBox title="SALINITY LEVEL" description="Amount of dissolved salts present in water." data={salinityData} color="blue" yAxisLabel="Salinity(ppm)" />
        <ChartBox title="PH LEVEL" description="Measures acidity or alkalinity (below 7 acidic, above 7 alkaline.)" data={pHData} color="red" yAxisLabel="pH Level" />
      </div>
    </div>
  );
};
const ChartBox = ({ title, description, data, color, yAxisLabel }) => (
  <div style={styles.chartBox}>
    <h3 style={styles.chartTitle}>{title}</h3>
    <p style={styles.chartDescription}>{description}</p>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="month" tick={{ fill: "#666" }} />
        <YAxis tick={{ fill: "#666" }} label={{ value: yAxisLabel, angle: -90, position: "insideLeft", fill: "#666" }} />
        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd" }} />
        <Line type="monotone" dataKey="level" stroke={color} strokeWidth={2} dot={{ r: 4, fill: color }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const UserTable = () => {
  const [showModal, setShowModal] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedPurok, setSelectedPurok] = useState("");
  const [entries, setEntries] = useState([]);
  const [contaminatedEntries, setContaminatedEntries] = useState([]);
  const [unownedEntries, setUnownedEntries] = useState([]);
  const [unownedContaminatedEntries, setUnownedContaminatedEntries] = useState([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    municipality: "",
    barangay: "",
    purok: "",
    salinity: "",
    phLevel: "",
    contaminated: "",
  });

  const openModal = (modalType) => {
    console.log("Opening modal:", modalType);
    setShowModal(null);
    setTimeout(() => setShowModal(modalType), 100);
  };
  const barangay = {
    Ticad: ["Circulo", "N/A"],
  };

  const puroks = {
    //Bantayan
    "Ticad": ["Purok 1", "Purok 2"],
  };
  const handleSaveEntry = (type) => {
    console.log("Saving Entry Type:", type);
    console.log("Form Data Before Save:", formData);

    const newData = {
        ...formData,
        dateAdded: new Date().toISOString().split("T")[0]
    };

    if (type === "addNewEntry") {
        setEntries(prev => [...prev, newData]);
    } else if (type === "contaminated") {
        setContaminatedEntries(prev => [...prev, { 
            ...newData, 
            contaminationType: formData.contaminationType, 
            riskLevel: formData.riskLevel 
        }]);
    } else if (type === "unowned") {
        if (formData.contaminated === "yes") {
            setUnownedContaminatedEntries(prev => [...prev, { 
                ...newData, 
                contaminationType: formData.contaminationType, 
                riskLevel: formData.riskLevel 
            }]);
        } else {
            setUnownedEntries(prev => [...prev, { 
                ...newData, 
                salinity: formData.salinity, 
                phLevel: formData.phLevel 
            }]);
        }
    }
    console.log("Updated Entries List:", type === "addNewEntry" ? entries : type === "contaminated" ? contaminatedEntries : formData.contaminated === "yes" ? unownedContaminatedEntries : unownedEntries);
    setFormData({
        firstname: "",
        lastname: "",
        email: "",
        contact: "",
        municipality: "",
        barangay: "",
        purok: "",
        salinity: "",
        phLevel: "",
        contaminated:"",
        contaminationType: "",
        riskLevel: ""
    });
    setShowModal(null);
};
const handleAddNewClick = () => {
  setFormData({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    municipality: "",
    barangay: "",
    purok: "",
    salinity: "",
    phLevel: "",
    contaminated: "", // Ensure it's reset
    contaminationType: "",
    riskLevel: "",
    dateAdded: "",
  });
  setEditingIndex(null); // Ensure it's not in edit mode
  setShowModal("options"); // Open Add New Entry modal
};
const [editingIndex, setEditingIndex] = useState(null);
const handleEdit = (index, type) => {
  console.log("Editing Type:", type); // Debugging
  let selectedEntry;

  if (type === "wells" && entries[index]) selectedEntry = entries[index];
  if (type === "contaminated" && contaminatedEntries[index]) selectedEntry = contaminatedEntries[index];
  if (type === "unowned" && unownedEntries[index]) selectedEntry = unownedEntries[index];
  if (type === "unownedContaminated" && unownedContaminatedEntries[index]) selectedEntry = unownedContaminatedEntries[index];

  if (!selectedEntry) {
    console.error(`No entry found at index ${index} for type ${type}`);
    return; 
  }

  setFormData(selectedEntry);
  setEditingIndex(index);
  setShowModal(type === "wells" ? "editWells" : type === "contaminated" ? "editContaminated" : type === "unowned" ? "editUnowned" : type === "unownedContaminated" ? "editUnownedContaminated" : "");
;
};

const handleSaveEdit = (type) => {
  if (editingIndex === null) return;
  if (type === "wells") {
    const updatedEntries = [...entries];
    updatedEntries[editingIndex] = formData;
    setEntries(updatedEntries);
    setShowModal(null); // Close Wells modal
  } else if (type === "contaminated") {
    const updatedEntries = [...contaminatedEntries];
    updatedEntries[editingIndex] = formData;
    setContaminatedEntries(updatedEntries);
    setShowModal(null); // Close Contaminated modal
  } else if (type === "unowned") {
    const updatedEntries = [...unownedEntries];
    updatedEntries[editingIndex] = formData;
    setUnownedEntries(updatedEntries);
    setShowModal(null); // Close Unowned modal
  } else if (type === "unownedContaminated") {
    const updatedEntries = [...unownedContaminatedEntries];
    updatedEntries[editingIndex] = formData;
    setUnownedContaminatedEntries(updatedEntries);
    setShowModal(null); // Close Unowned Contaminated modal
  }
  setEditingIndex(null);
};
const handleDelete = (index, type) => {
  if (type === "wells") {
    setEntries(entries.filter((_, i) => i !== index));
  } else if (type === "contaminated") {
    setContaminatedEntries(contaminatedEntries.filter((_, i) => i !== index));
  } else if (type === "unowned") {
    setUnownedEntries(unownedEntries.filter((_, i) => i !== index));
  } else if (type === "unownedContaminated") {
    setUnownedContaminatedEntries(unownedContaminatedEntries.filter((_, i) => i !== index));
  }
};
  return (
    <div style={styles.container}>
        <Circulo />
      <div style={styles.headerContainer}>
      <h2>Recent Wells in Circulo</h2>
      <button onClick={() => {setShowModal("options"); handleAddNewClick();}} style={styles.button}>+ Add New</button>
      </div>
      {/*<div style={styles.container}>*/}
      {/* Add New Entry Table */}
      <h2>Wells</h2>
      <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Firstname</th>
            <th style={styles.th}>Lastname</th>
            <th style={styles.th}>Email</th>
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
          {/* Data Rows Here */}
          {entries.map((entry, index) => (
            <tr key={index}>
              <td style={styles.td}>{entry.firstname || "N/A"}</td>
              <td style={styles.td}>{entry.lastname || "N/A"}</td>
              <td style={styles.td}>{entry.email || "N/A"}</td>
              <td style={styles.td}>{entry.contact || "N/A"}</td>
              <td style={styles.td}>{entry.municipality || "N/A"}</td>
              <td style={styles.td}>{entry.barangay || "N/A"}</td>
              <td style={styles.td}>{entry.purok || "N/A"}</td>
              <td style={styles.td}>{entry.salinity || "N/A"}</td>
              <td style={styles.td}>{entry.phLevel || "N/A"}</td>
              <td style={styles.td}>{entry.dateAdded}</td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(index, "wells")} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(index, "wells")} style={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/*</div>*/}
      <hr></hr>
      {/*<div style={styles.container}>*/}
      <div style={styles.tableContainer}>
      {/* Contaminated Table */}
      <h2>Contaminated Wells</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Firstname</th>
            <th style={styles.th}>Lastname</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Contact No.</th>
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
          {/* Data Rows Here */}
          {contaminatedEntries.map((entry, index) => (
            <tr key={index}>
              <td style={styles.td}>{entry.firstname || "N/A"}</td>
              <td style={styles.td}>{entry.lastname || "N/A"}</td>
              <td style={styles.td}>{entry.email || "N/A"}</td>
              <td style={styles.td}>{entry.contact || "N/A"}</td>
              <td style={styles.td}>{entry.municipality || "N/A"}</td>
              <td style={styles.td}>{entry.barangay || "N/A"}</td>
              <td style={styles.td}>{entry.purok || "N/A"}</td>
              <td style={styles.td}>{entry.contaminationType || "N/A"}</td>
              <td style={styles.td}>{entry.riskLevel || "N/A"}</td>
              <td style={styles.td}>{entry.dateAdded}</td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(index, "contaminated")} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(index, "contaminated")} style={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/*</div>*/}
      <hr></hr>
      {/*<div style={styles.container}>*/}
      <div style={styles.tableContainer}></div>
      {/* Unowned Table */}
      <h2>Unowned Wells</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Municipality</th>
            <th style={styles.th}>Barangay</th>
            <th style={styles.th}>Purok</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Salinity</th>
            <th style={styles.th}>pH Level</th>
            <th style={styles.th}>Contaminated</th>
            <th style={styles.th}>Date Added</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Data Rows Here */}
          {unownedEntries.map((entry, index) => (
            <tr key={index}>
              <td style={styles.td}>{entry.municipality || "N/A"}</td>
              <td style={styles.td}>{entry.barangay || "N/A"}</td>
              <td style={styles.td}>{entry.purok || "N/A"}</td>
              <td style={styles.td}>{entry.location || "N/A"}</td>
              <td style={styles.td}>{entry.salinity || "N/A"}</td>
              <td style={styles.td}>{entry.phLevel || "N/A"}</td>
              <td style={styles.td}>{entry.contaminated || "N/A"}</td>
              <td style={styles.td}>{entry.dateAdded}</td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(index, "unowned")} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(index, "unowned")} style={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*</div>*/}
      <hr></hr>
      {/*<div style={styles.container}>*/}
      <div style={styles.tableContainer}></div>
      {/* Unowned Table */}
      <h2>Unowned Contaminated Wells</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Municipality</th>
            <th style={styles.th}>Barangay</th>
            <th style={styles.th}>Purok</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Contaminated</th>
            <th style={styles.th}>Contamination Type</th>
            <th style={styles.th}>Risk Level</th>
            <th style={styles.th}>Date Added</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {unownedContaminatedEntries.map((entry, index) => (
            <tr key={index}>
              <td style={styles.td}>{entry.municipality || "N/A"}</td>
              <td style={styles.td}>{entry.barangay || "N/A"}</td>
              <td style={styles.td}>{entry.purok || "N/A"}</td>
              <td style={styles.td}>{entry.location || "N/A"}</td>
              <td style={styles.td}>{entry.contaminated || "N/A"}</td>
              <td style={styles.td}>{entry.contaminationType || "N/A"}</td>
              <td style={styles.td}>{entry.riskLevel || "N/A"}</td>
              <td style={styles.td}>{entry.dateAdded}</td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(index, "unownedContaminated")} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(index, "unownedContaminated")} style={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*</div>*/}
      <hr></hr>
      {showModal === "options" && (
        <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
        <div className="modal">
          <button onClick={() => openModal("addNewEntry")} style={styles.editButton}>Add New Entry</button>
          <button onClick={() => openModal("contaminated")} style={styles.editButton}>Contaminated</button>
          <button onClick={() => openModal("unowned")} style={styles.editButton}>Unowned</button>
          <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Close</button>
        </div>
        </div>
        </div>
      )}
      {showModal === "addNewEntry" && (
        <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
        <div className="modal">
          <h2 style={styles.h2}>Add New Entry</h2>
          <input style={styles.input} type="text" placeholder="Firstname" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}/>
          <input style={styles.input} type="text" placeholder="Lastname" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}/>
          <input style={styles.input} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
          <input style={styles.input} type="text" placeholder="Contact No." value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}/>
          <select onChange={(e) =>{ setSelectedBarangay(e.target.value); setSelectedPurok(""); setFormData({ ...formData, barangay: e.target.value });}} style={styles.input1}>
            <option value="">Select Barangay</option>
            {Object.keys(barangay).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) =>{ setSelectedPurok(e.target.value); setFormData({ ...formData, purok: e.target.value});}} style={styles.input1}>
            <option value="">Select Purok</option>
            {(barangay[selectedBarangay] || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input style={styles.input} type="text" placeholder="Salinity" value={formData.salinity} onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}/>
          <input style={styles.input} type="text" placeholder="pH Level" value={formData.phLevel} onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}/>
          <br></br>
          <br></br>
          <center>
          <button onClick={() => handleSaveEntry("addNewEntry")} style={styles.editButton}>Save</button>
          <button onClick={() => setShowModal("options")} style={styles.deleteButton}>Back</button>
          </center>
        </div>
        </div>
        </div>
      )}
      {showModal === "contaminated" && (
        <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
        <div className="modal">
          <h2 style={styles.h2}>Add Contaminated Entry</h2>
          <input style={styles.input} type="text" placeholder="Firstname" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}/>
          <input style={styles.input} type="text" placeholder="Lastname" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}/>
          <input style={styles.input} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
          <input style={styles.input} type="text" placeholder="Contact No." value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}/>
          <select onChange={(e) =>{ setSelectedBarangay(e.target.value); setSelectedPurok(""); setFormData({ ...formData, barangay: e.target.value });}} style={styles.input1}>
            <option value="">Select Barangay</option>
            {Object.keys(barangay).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) =>{ setSelectedPurok(e.target.value); setFormData({ ...formData, purok: e.target.value});}} style={styles.input1}>
            <option value="">Select Purok</option>
            {(barangay[selectedBarangay] || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input style={styles.input} type="text" placeholder="Contamination Type" value={formData.contaminationType} onChange={(e) => setFormData({ ...formData, contaminationType: e.target.value })}/>
          <select onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })} style={styles.input1} >
                <option value="">Select Risk Level</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
          <br></br>
          <br></br>
          <center>
          <button onClick={() => handleSaveEntry("contaminated")} style={styles.editButton}>Save</button>
          <button onClick={() => setShowModal("options")} style={styles.deleteButton}>Back</button>
          </center>
        </div>
        </div>
        </div>
      )}
      {showModal === "unowned" && (
        <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
        <div className="modal">
          <h2 style={styles.h2}>Add Unowned Entry</h2>
          <select
            style={styles.input1}
            value={formData.contaminated}
            onChange={(e) => 
            setFormData({ ...formData, contaminated: e.target.value })
             }
          >
            <option value="">Contaminated?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {formData.contaminated === "yes" ? (
            <>
              <select onChange={(e) =>{ setSelectedBarangay(e.target.value); setSelectedPurok(""); setFormData({ ...formData, barangay: e.target.value });}} style={styles.input1}>
            <option value="">Select Barangay</option>
            {Object.keys(barangay).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) =>{ setSelectedPurok(e.target.value); setFormData({ ...formData, purok: e.target.value});}} style={styles.input1}>
            <option value="">Select Purok</option>
            {(barangay[selectedBarangay] || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
              <input style={styles.input} type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}/>
              <input style={styles.input} type="text" placeholder="Contamination Type" value={formData.contaminationType} onChange={(e) => setFormData({ ...formData, contaminationType: e.target.value })}/>
              <select onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })} style={styles.input1} >
                <option value="">Select Risk Level</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </>
          ) : (
            <>
              <select onChange={(e) =>{ setSelectedBarangay(e.target.value); setSelectedPurok(""); setFormData({ ...formData, barangay: e.target.value });}} style={styles.input1}>
            <option value="">Select Barangay</option>
            {Object.keys(barangay).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) =>{ setSelectedPurok(e.target.value); setFormData({ ...formData, purok: e.target.value});}} style={styles.input1}>
            <option value="">Select Purok</option>
            {(barangay[selectedBarangay] || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
              <input style={styles.input} type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}/>
              <input style={styles.input} type="text" placeholder="Salinity" value={formData.salinity} onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}/>
              <input style={styles.input} type="text" placeholder="pH Level" value={formData.phLevel} onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}/>
            </>
          )}
          <br></br>
          <br></br>
          <center>
          <button onClick={() => handleSaveEntry("unowned")} style={styles.editButton}>Save</button>
          <button onClick={() => setShowModal("options")} style={styles.deleteButton}>Back</button>
          </center>
        </div>
        </div>
        </div>
      )}
      {showModal === "editWells" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Entry</h2>
            <input style={styles.input} type="text" placeholder="Firstname" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}/>
            <input style={styles.input} type="text" placeholder="Lastname" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}/>
            <input style={styles.input} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
            <input style={styles.input} type="text" placeholder="Contact No." value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}/>
            <select onChange={(e) =>{ setSelectedBarangay(e.target.value); setSelectedPurok(""); setFormData({ ...formData, barangay: e.target.value });}} style={styles.input1}>
            <option value="">Select Barangay</option>
            {Object.keys(barangay).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) =>{ setSelectedPurok(e.target.value); setFormData({ ...formData, purok: e.target.value});}} style={styles.input1}>
            <option value="">Select Purok</option>
            {(barangay[selectedBarangay] || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
            <input style={styles.input} type="text" placeholder="Salinity" value={formData.salinity} onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}/>
            <input style={styles.input} type="text" placeholder="pH Level" value={formData.phLevel} onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}/>
            <br></br>
              <center>
              <button onClick={() => handleSaveEdit("wells")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
              </center>
          </div>
        </div>
      )}
      {showModal === "editContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Contaminated Entry</h2>
            <input style={styles.input} type="text" placeholder="Firstname" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}/>
          <input style={styles.input} type="text" placeholder="Lastname" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}/>
          <input style={styles.input} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
          <input style={styles.input} type="text" placeholder="Contact No." value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}/>
          <select onChange={(e) =>{ setSelectedBarangay(e.target.value); setSelectedPurok(""); setFormData({ ...formData, barangay: e.target.value });}} style={styles.input1}>
            <option value="">Select Barangay</option>
            {Object.keys(barangay).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) =>{ setSelectedPurok(e.target.value); setFormData({ ...formData, purok: e.target.value});}} style={styles.input1}>
            <option value="">Select Purok</option>
            {(barangay[selectedBarangay] || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input style={styles.input} type="text" placeholder="Contamination Type" value={formData.contaminationType} onChange={(e) => setFormData({ ...formData, contaminationType: e.target.value })}/>
          <select onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })} style={styles.input1}>
            <option value="">Select Risk Level</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
            <br />
            <center>
              <button onClick={() => handleSaveEdit("contaminated")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}
      {showModal === "editUnowned" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Unowned Entry</h2>
            <>
            <select onChange={(e) =>{ setSelectedBarangay(e.target.value); setSelectedPurok(""); setFormData({ ...formData, barangay: e.target.value });}} style={styles.input1}>
            <option value="">Select Barangay</option>
            {Object.keys(barangay).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) =>{ setSelectedPurok(e.target.value); setFormData({ ...formData, purok: e.target.value});}} style={styles.input1}>
            <option value="">Select Purok</option>
            {(barangay[selectedBarangay] || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
              <input style={styles.input} type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}/>
              <input style={styles.input} type="text" placeholder="Salinity" value={formData.salinity} onChange={(e) => setFormData({ ...formData, salinity: e.target.value })}/>
              <input style={styles.input} type="text" placeholder="pH Level" value={formData.phLevel} onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}/>
            </> 
            <br />
            <center>
              <button onClick={() => handleSaveEdit("unowned")} style={styles.editButton}>Save</button>
              <button onClick={() => setShowModal(null)} style={styles.deleteButton}>Cancel</button>
            </center>
          </div>
        </div>
      )}
      {showModal === "editUnownedContaminated" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.h2}>Edit Unowned Contaminated Entry</h2>
            <>
            <select onChange={(e) =>{ setSelectedBarangay(e.target.value); setSelectedPurok(""); setFormData({ ...formData, barangay: e.target.value });}} style={styles.input1}>
            <option value="">Select Barangay</option>
            {Object.keys(barangay).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select onChange={(e) =>{ setSelectedPurok(e.target.value); setFormData({ ...formData, purok: e.target.value});}} style={styles.input1}>
            <option value="">Select Purok</option>
            {(barangay[selectedBarangay] || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
              <input style={styles.input} type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}/>
              <input style={styles.input} type="text" placeholder="Contamination Type" value={formData.contaminationType} onChange={(e) => setFormData({ ...formData, contaminationType: e.target.value })}/>
              <select onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })} style={styles.input1} >
                <option value="">Select Risk Level</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </>
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

const styles = {
  dashboardContainer: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f2f5",
    minHeight: "85vh",
    "@media (max-width: 768px)": {
      padding: "12px",
    },
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
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontWeight: "bold",
    border: "1px solid #000000",
    color:"#000000",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "12px",
    },
  },
  statValue: {
    fontSize: "24px",
    color: "#333",
    "@media (max-width: 768px)": {
      fontSize: "18px",
    },
  },
  contaminated: {
    color: "#33691E",
    borderColor: "#33691E",
  },
  highSalinity: {
    color: "#1877f2",
    borderColor: "#1877f2",
  },
  lowPH: {
    color: "#e63946",
    borderColor: "#e63946",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
  chartBox: {
    padding: "24px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ddd",
  },
  chartTitle: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#444",
  },
  chartDescription: {
    fontSize: "14px",
    color: "#666",
  },
  container: {
    padding: "20px",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "10px",
    },
  },
  h2: {
    textAlign: "center",
  },
th: {
    backgroundColor: "royalblue",
    color: "white",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    "@media (max-width: 600px)": {
      display: "block",
      overflowX: "auto",
      whiteSpace: "nowrap",
    },
  },
  button: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tableContainer: {
    overflowX: "auto",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "400px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "@media (max-width: 600px)": {
      width: "90%",
    },
  },
  input: {
    margin: "5px 0",
    padding: "8px",
    width: "95%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  input1: {
    margin: "5px 0",
    padding: "8px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

export default UserTable;
