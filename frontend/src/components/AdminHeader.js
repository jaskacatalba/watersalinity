import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import headerImage from "../assets/blue2.jpg";
import "./AdminHeader.css";

function AdminHeader() {
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [hoveredItem, setHoveredItem] = useState("");
  const [municipalities, setMunicipalities] = useState([]);
  const navigate = useNavigate();

  // ✅ Get UserType from localStorage
  const userType = localStorage.getItem("userType"); 

  useEffect(() => {
    fetch("http://localhost:5000/api/municipalities")
      .then((res) => res.json())
      .then((data) => {
        setMunicipalities(data);
      })
      .catch((error) => console.error("Error fetching municipalities:", error));
  }, []);

  // UPDATED LOGOUT PROCESS: Clears auth details and navigates to /viewer/loginpage
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    navigate("/viewer/loginpage");
  };

  return (
    <header className="header">
      <div className="header__logo-container">
        <img src={headerImage} alt="Logo" className="image" />
        <h1 className="header__title">LUE</h1>
      </div>

      <nav className="nav">
        <Link
          to="/admin/dashboard"
          className={
            activeItem === "dashboard" || hoveredItem === "dashboard"
              ? "activeLink"
              : "link"
          }
          onClick={() => setActiveItem("dashboard")}
          onMouseEnter={() => setHoveredItem("dashboard")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Dashboard
        </Link>

        {/* Municipality Dropdown */}
        <div
          className="dropdown"
          onMouseEnter={() => {
            setMunicipalityOpen(true);
            setHoveredItem("municipality");
          }}
          onMouseLeave={() => {
            setMunicipalityOpen(false);
            setHoveredItem("");
            setSubMenuOpen("");
          }}
        >
          <button
            type="button"
            className={
              municipalityOpen || hoveredItem === "municipality"
                ? "activeLink dropdownToggle"
                : "link dropdownToggle"
            }
          >
            Municipality ▼
          </button>
          {municipalityOpen && (
            <div className="dropdownContent">
              {municipalities.map((muni) => (
                <div
                  className="subDropdown"
                  key={muni.id}
                  onMouseEnter={() => setSubMenuOpen(muni.id)}
                  onMouseLeave={() => setSubMenuOpen("")}
                >
                  <span
                    className={
                      activeItem === muni.name || hoveredItem === muni.name
                        ? "activeLink"
                        : "link"
                    }
                    onClick={() => setActiveItem(muni.name)}
                    onMouseEnter={() => setHoveredItem(muni.name)}
                    onMouseLeave={() => setHoveredItem("")}
                  >
                    {muni.name}
                  </span>
                  {subMenuOpen === muni.id &&
                    muni.barangays &&
                    muni.barangays.length > 0 && (
                      <div className="subDropdownContent">
                        {muni.barangays.map((barangay, index) => (
                          <Link
                            key={index}
                            to={`/admin/${muni.name.toLowerCase()}/${barangay.toLowerCase()}`}
                            className={
                              activeItem === barangay || hoveredItem === barangay
                                ? "activeLink"
                                : "link"
                            }
                            onClick={() => setActiveItem(barangay)}
                            onMouseEnter={() => setHoveredItem(barangay)}
                            onMouseLeave={() => setHoveredItem("")}
                          >
                            {barangay}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conditionally Render "User Management" for Super Admin Only */}
        {userType === "Super Admin" && (
          <Link
            to="/admin/user"
            className={
              activeItem === "users" || hoveredItem === "users"
                ? "activeLink"
                : "link"
            }
            onClick={() => setActiveItem("users")}
            onMouseEnter={() => setHoveredItem("users")}
            onMouseLeave={() => setHoveredItem("")}
          >
            Users Management
          </Link>
        )}
      </nav>

      <button onClick={handleLogout} className="logout">
        Logout
      </button>
    </header>
  );
}

export default AdminHeader;
