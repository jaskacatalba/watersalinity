import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import headerImage from "../assets/blue2.jpg"; // update path if needed
import "./UserHeader.css"; // using dedicated CSS for UserHeader

function UserHeader() {
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [hoveredItem, setHoveredItem] = useState("");
  const [municipalities, setMunicipalities] = useState([]);

  const navigate = useNavigate();

  // Fetch all municipalities (and their barangays) from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/municipalities")
      .then((res) => res.json())
      .then((data) => {
        setMunicipalities(data);
      })
      .catch((error) =>
        console.error("Error fetching municipalities:", error)
      );
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
        {/* "Your Wells" Link (goes to /user/dashboard, which renders UserCont) */}
        <Link
          to="/user/dashboard"
          className={
            activeItem === "yourWells" || hoveredItem === "yourWells"
              ? "activeLink"
              : "link"
          }
          onClick={() => setActiveItem("yourWells")}
          onMouseEnter={() => setHoveredItem("yourWells")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Your Wells
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
                  {/* Municipality Name */}
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

                  {/* Submenu for Barangays */}
                  {subMenuOpen === muni.id &&
                    muni.barangays &&
                    muni.barangays.length > 0 && (
                      <div className="subDropdownContent">
                        {muni.barangays.map((barangay, index) => (
                          <Link
                            key={index}
                            to={`/user/${muni.name.toLowerCase()}/${barangay.toLowerCase()}`}
                            className={
                              activeItem === barangay ||
                              hoveredItem === barangay
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
      </nav>

      <button onClick={handleLogout} className="logout">
        Logout
      </button>
    </header>
  );
}

export default UserHeader;
