import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";
import "./RegisterPage.css";

const RegisterPage = () => {
  // Basic form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Location data states
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [puroks, setPuroks] = useState([]);

  // Selected location states
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedPurok, setSelectedPurok] = useState("");

  // New state for user type and enum values from UserTbl
  const allUserTypes = ["Super Admin", "Normal User", "Barangay Representative"];
  const [userType, setUserType] = useState("Normal User");

  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  // Fetch all location data concurrently on mount
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/location/municipalities").then((res) => res.json()),
      fetch("http://localhost:5000/api/location/barangays").then((res) => res.json()),
      fetch("http://localhost:5000/api/location/purok").then((res) => res.json()),
    ])
      .then(([municipalitiesData, barangaysData, puroksData]) => {
        setMunicipalities(Array.isArray(municipalitiesData) ? municipalitiesData : []);
        setBarangays(Array.isArray(barangaysData) ? barangaysData : []);
        setPuroks(Array.isArray(puroksData) ? puroksData : []);
      })
      .catch((err) => {
        console.error("Error fetching location data:", err);
        setErrorMessage("Error fetching location data");
      });
  }, []);

  // Handlers to update selected location and reset dependent selections
  const handleMunicipalityChange = (e) => {
    const munId = e.target.value;
    setSelectedMunicipality(munId);
    setSelectedBarangay("");
    setSelectedPurok("");
  };

  const handleBarangayChange = (e) => {
    const bgyId = e.target.value;
    setSelectedBarangay(bgyId);
    setSelectedPurok("");
  };

  const handlePurokChange = (e) => {
    setSelectedPurok(e.target.value);
  };

  const handleRegister = async () => {
    setErrorMessage("");

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !selectedMunicipality ||
      !selectedBarangay ||
      !selectedPurok
    ) {
      setErrorMessage("⚠️ Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("⚠️ Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          gmail: email,
          u_Uphone: phone,
          u_UName: email, // using email as username
          u_PName: password,
          municipality_id: selectedMunicipality,
          barangay_id: selectedBarangay,
          purok_id: selectedPurok,
          UserType: userType,
        }),
      });

      const data = await response.json();

      // If there's an error from the server, handle it
      if (!response.ok) {
        // Check if it's the duplicate email error
        if (data.error && data.error.includes("Duplicate entry")) {
          throw new Error("This email already exists.");
        } else {
          throw new Error(data.error || "Registration failed!");
        }
      }

      // If registration was successful, store data and show modal
      localStorage.setItem("userFirstName", firstName);
      localStorage.setItem("userLastName", lastName);
      localStorage.setItem("userPhone", phone);
      localStorage.setItem("municipality_id", selectedMunicipality);
      localStorage.setItem("barangay_id", selectedBarangay);
      localStorage.setItem("purok_id", selectedPurok);

      // Instead of immediately navigating, display a modal
      setShowModal(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Optional: A simple modal component (you can also extract this to its own file)
  const Modal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Account Created Successfully!</h2>
        <p>You have successfully created an account. Proceed to log in?</p>
        <button onClick={() => navigate("/viewer/loginpage")} className="login-button">
          Log In
        </button>
      </div>
    </div>
  );

  return (
    <div className="reg-container">
      <div className="reg-card">
        <div className="reg-header">
          <AnimatedLogo />
          <h1>Create New Account</h1>
          <p>All fields are required.</p>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="reg-form-grid">
          {/* Basic Info */}
          <div className="inputGroup">
            <label className="label">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          </div>

          {/* Location Dropdowns */}
          <div className="inputGroup">
            <label className="label">Municipality</label>
            <select
              className="input"
              value={selectedMunicipality}
              onChange={handleMunicipalityChange}
            >
              <option value="">Select a Municipality</option>
              {municipalities.map((mun) => (
                <option key={mun.id} value={mun.id}>
                  {mun.name}
                </option>
              ))}
            </select>
          </div>

          <div className="inputGroup">
            <label className="label">Barangay</label>
            <select
              className="input"
              value={selectedBarangay}
              onChange={handleBarangayChange}
              disabled={!selectedMunicipality}
            >
              <option value="">Select a Barangay</option>
              {barangays
                .filter((b) => String(b.municipality_id) === selectedMunicipality)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="inputGroup">
            <label className="label">Purok</label>
            <select
              className="input"
              value={selectedPurok}
              onChange={handlePurokChange}
              disabled={!selectedBarangay}
            >
              <option value="">Select a Purok</option>
              {puroks
                .filter((p) => String(p.barangay_id) === selectedBarangay)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          {/* User Type Dropdown (excluding Super Admin) */}
          <div className="inputGroup">
            <label className="label">User Type</label>
            <select
              className="input"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              {allUserTypes
                .filter((type) => type !== "Super Admin")
                .map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button onClick={handleRegister} className="reg-button">
          Create Account
        </button>

        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/viewer/loginpage" className="link">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Conditionally render the modal */}
      {showModal && <Modal />}
    </div>
  );
};

export default RegisterPage;
