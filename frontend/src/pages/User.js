import React, { useState, useEffect } from "react";

const User = () => {
  const [users, setUsers] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // For creating a new user
  const [newUser, setNewUser] = useState({
    fullname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    contact: "",
    municipality: "",
    barangay: "",
    dateAdded: new Date().toISOString().split("T")[0],
  });

  // State to hold the current user type filter (default: "All")
  const [userTypeFilter, setUserTypeFilter] = useState("All");

  // Fetch all users, municipalities, and barangays when component mounts
  useEffect(() => {
    // Fetch Users
    fetch("http://localhost:5000/api/auth/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch Municipalities
    fetch("http://localhost:5000/api/municipalities")
      .then((res) => res.json())
      .then((data) => setMunicipalities(data))
      .catch((err) =>
        console.error("Error fetching municipalities:", err)
      );

    // Fetch Barangays
    fetch("http://localhost:5000/api/barangays")
      .then((res) => res.json())
      .then((data) => setBarangays(data))
      .catch((err) =>
        console.error("Error fetching barangays:", err)
      );
  }, []);

  // Helper function to get municipality name by ID
  const getMunicipalityName = (municipalityId) => {
    const idNum = parseInt(municipalityId, 10);
    const found = municipalities.find((m) => m.id === idNum);
    return found ? found.name : municipalityId;
  };

  // Helper function to get barangay name by ID
  const getBarangayName = (barangayId) => {
    const idNum = parseInt(barangayId, 10);
    const found = barangays.find((b) => b.id === idNum);
    return found ? found.name : barangayId;
  };

  // DELETE user
  const handleDelete = () => {
    if (!selectedUser) return;
    fetch(`http://localhost:5000/api/users/${selectedUser.u_ID}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setUsers(users.filter((user) => user.u_ID !== selectedUser.u_ID));
        setShowDeleteModal(false);
      })
      .catch((err) => console.error("Error deleting user:", err));
  };

  // ADD new user
  const handleAddUser = () => {
    fetch("http://localhost:5000/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Error: " + data.error);
          return;
        }
        // Append newly created user (assuming your API returns userId)
        setUsers([...users, { u_ID: data.userId, ...newUser }]);
        setShowModal(false);
        setNewUser({
          fullname: "",
          lastname: "",
          email: "",
          username: "",
          password: "",
          contact: "",
          municipality: "",
          barangay: "",
          dateAdded: new Date().toISOString().split("T")[0],
        });
      })
      .catch((err) => console.error("Error adding user:", err));
  };

  // EDIT user
  const handleEditUser = () => {
    if (!selectedUser) return;
    fetch(`http://localhost:5000/api/users/${selectedUser.u_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Error: " + data.error);
          return;
        }
        setUsers(
          users.map((user) =>
            user.u_ID === selectedUser.u_ID ? selectedUser : user
          )
        );
        setShowEditModal(false);
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  // Filter the users based on userTypeFilter
  const filteredUsers =
    userTypeFilter === "All"
      ? users
      : users.filter((user) => user.UserType === userTypeFilter);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <div style={styles.titleAndFilter}>
          <h2 style={styles.pageTitle}>User Management</h2>

          {/* Dropdown to filter user type */}
          <select
            style={styles.userTypeSelect}
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Barangay Representative">Barangay Representative</option>
            <option value="Normal User">Normal User</option>
          </select>
        </div>

        <button onClick={() => setShowModal(true)} style={styles.addButton}>
          Add New
        </button>
      </div>

      {/* Table Container */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>First Name</th>
              <th style={styles.th}>Last Name</th>
              <th style={styles.th}>Username</th>
              <th
                style={{
                  ...styles.th,
                  width: "80px",
                  maxWidth: "80px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Password
              </th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Municipality</th>
              <th style={styles.th}>Barangay</th>
              <th style={styles.th}>User Type</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.u_ID} style={styles.tr}>
                <td style={styles.td}>{user.u_ID}</td>
                <td style={styles.td}>{user.first_name}</td>
                <td style={styles.td}>{user.last_name}</td>
                <td style={styles.td}>{user.u_UName}</td>
                <td
                  style={{
                    ...styles.td,
                    width: "80px",
                    maxWidth: "80px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={user.u_PName}
                >
                  {user.u_PName}
                </td>
                <td style={styles.td}>{user.gmail}</td>
                <td style={styles.td}>{user.u_Uphone}</td>
                <td style={styles.td}>
                  {user.municipality_name ||
                    getMunicipalityName(user.municipality_id)}
                </td>
                <td style={styles.td}>
                  {user.barangay_name || getBarangayName(user.barangay_id)}
                </td>
                <td style={styles.td}>{user.UserType}</td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      style={styles.editButton}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showModal || showEditModal) && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: "1rem", fontWeight: "bold" }}>
              {showModal ? "Add New User" : "Edit User"}
            </h3>
            {Object.keys(newUser).map(
              (key) =>
                key !== "dateAdded" && (
                  <div
                    key={key}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      placeholder={key}
                      onChange={(e) =>
                        showModal
                          ? setNewUser({ ...newUser, [key]: e.target.value })
                          : setSelectedUser({
                              ...selectedUser,
                              [key]: e.target.value,
                            })
                      }
                      value={
                        showModal ? newUser[key] : selectedUser?.[key] || ""
                      }
                      style={styles.input}
                    />
                  </div>
                )
            )}
            <div style={styles.modalActions}>
              <button
                onClick={showModal ? handleAddUser : handleEditUser}
                style={styles.editButton}
              >
                {showModal ? "Add" : "Save"}
              </button>
              <button
                onClick={() =>
                  showModal ? setShowModal(false) : setShowEditModal(false)
                }
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: "1rem", fontWeight: "bold" }}>
              Confirm Deletion
            </h3>
            <p style={{ marginBottom: "1rem" }}>
              Are you sure you want to delete{" "}
              <b>{selectedUser?.first_name || "this user"}?</b>
            </p>
            <div style={styles.modalActions}>
              <button onClick={handleDelete} style={styles.deleteConfirmButton}>
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Inline Styles */
const styles = {
  container: {
    padding: "20px",
    margin: 0,
    width: "100%",
    boxSizing: "border-box",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  titleAndFilter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userTypeSelect: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  pageTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: 0,
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  tableContainer: {
    marginTop: "10px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  th: {
    backgroundColor: "#343a40",
    color: "white",
    padding: "12px",
    textAlign: "left",
    border: "1px solid #ddd",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  tr: {
    transition: "background-color 0.2s ease",
  },
  td: {
    padding: "12px",
    border: "1px solid #ddd",
    whiteSpace: "nowrap",
  },
  addButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "8px 12px",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
  },
  deleteConfirmButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  input: {
    margin: "5px 0",
    padding: "8px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

export default User;
