import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import headerImage from "../assets/blue2.jpg";

function Header() {
  const [ticadOpen, setTicadOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState("");
  const [activeItem, setActiveItem] = useState(""); // Track active selection
  const [hoveredItem, setHoveredItem] = useState(""); // Track hovered item

  return (
    <header style={styles.header}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Logo */}
        <img
            src={headerImage} // Change this to your image URL
            alt="Login Illustration"
            style={{ width: "65px", height: "65px", marginRight: "0px", borderRadius: "10px", }} // Adjust size and spacing
        />
        {/* Title */}
        <h1
        style={{ width: "50px", height: "35px", marginRight: "10px", fontFamily: "auto", }} // Adjust size and spacing
        >LUE</h1>
      </div>

      {/*<h1 style={styles.title}>BLUE</h1>*/}
      <nav style={styles.nav}>
        <Link
        to="/userticad/ticad"
          style={activeItem === "ticad" || hoveredItem === "ticad" ? styles.activeLink : styles.link}
          onClick={() => setActiveItem("ticad")}
          onMouseEnter={() => setHoveredItem("ticad")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Dashboard
        </Link>

        {/* Ticad Dropdown */}
          <div
            style={styles.dropdown}
            onMouseEnter={() => {
              setTicadOpen(true);
              setHoveredItem("/ticad");
            }}
            onMouseLeave={() => {
              setTicadOpen(false);
              setHoveredItem("");
              setSubMenuOpen(""); // Close submenus
            }}
            >
              <a
                style={ticadOpen || activeItem.includes("barangay") || hoveredItem === "/ticad" ? styles.activeLink : styles.link}
              >
                Ticad ▼
              </a>
                {ticadOpen && (
                  <div style={styles.dropdownContent}>
        
                    {/* First Sub-menu */}
                    <div
                      style={styles.subDropdown}
                      onMouseEnter={() => setSubMenuOpen("purok1")}
                      onMouseLeave={() => setSubMenuOpen("")}
                    >
                      <Link
                        to="/userticad/circulo"
                        style={activeItem === "circulo" || hoveredItem === "circulo" ? styles.activeLink : styles.link}
                        onClick={() => setActiveItem("circulo")}
                        onMouseEnter={() => setHoveredItem("circulo")}
                        onMouseLeave={() => setHoveredItem("")}
                      >
                        Circulo
                      </Link>
                    </div>
        
                    {/* Second Sub-menu */}
                      <div
                        style={styles.subDropdown}
                        onMouseEnter={() => setSubMenuOpen("city2")}
                        onMouseLeave={() => setSubMenuOpen("")}
                      >
                        <Link
                          to="/userticad/"
                          style={activeItem === "city2" || hoveredItem === "city2" ? styles.activeLink : styles.link}
                          onClick={() => setActiveItem("city2")}
                          onMouseEnter={() => setHoveredItem("city2")}
                          onMouseLeave={() => setHoveredItem("")}
                        >
                          N/A
                        </Link>
                        
                      </div>
        
                      {/* Third Sub-menu */}
                      <div
                        style={styles.subDropdown}
                        onMouseEnter={() => setSubMenuOpen("city3")}
                        onMouseLeave={() => setSubMenuOpen("")}
                      >
                        <a
                          href="#"
                          style={activeItem === "city3" || hoveredItem === "city3" ? styles.activeLink : styles.link}
                          onClick={() => setActiveItem("city3")}
                          onMouseEnter={() => setHoveredItem("city3")}
                          onMouseLeave={() => setHoveredItem("")}
                        >
                          N/A
                        </a>
                      </div>
        
                    </div>
                  )}
                </div>
      </nav>
      <Link
       to="/LoginPage"
        style={styles.logout}
        onClick={() => setActiveItem("logout")}
      >
        Logout
      </Link>
    </header>
  );
}

const styles = {
  image: {
    width: "100px", // Adjust size
    height: "100px", // Adjust size
    marginBottom: "0px",
  },
    header: {
      backgroundColor: "royalblue",
      color: "white",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    nav: {
      display: "flex",
      gap: "15px",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "16px",
      padding: "8px",
      display: "block",
      borderRadius: "5px",
      transition: "background 0.3s",
    },
    activeLink: {
      color: "white",
      textDecoration: "none",
      fontSize: "16px",
      padding: "8px",
      display: "block",
      backgroundColor: "dodgerblue", // Active background color
      borderRadius: "5px",
      transition: "background 0.3s",
    },
    logout: {
      color: "white",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "background 0.3s",
      padding: "8px",
      borderRadius: "5px",
    },
    dropdown: {
      position: "relative",
    },
    dropdownContent: {
      position: "absolute",
      backgroundColor: "royalblue",
      color: "white",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      minWidth: "150px",
      borderRadius: "5px",
      zIndex: 1,
      padding: "5px",
    },
    subDropdown: {
      position: "relative",
    },
    subDropdownContent: {
      position: "absolute",
      left: "100%",
      top: "0",
      backgroundColor: "royalblue",
      color: "white",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      minWidth: "150px",
      borderRadius: "5px",
      zIndex: 1,
      padding: "5px",
    },
  };
  export default Header;
  