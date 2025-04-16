import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import headerImage from "../assets/blue2.jpg";

function ViewerHeader() {
  const [activeItem, setActiveItem] = useState(""); // Track active selection
  const [hoveredItem, setHoveredItem] = useState(""); // Track hovered item
  const navigate = useNavigate(); // Initialize navigate

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
        to="/viewer/blue"
          style={activeItem === "blue" || hoveredItem === "blue" ? styles.activeLink : styles.link}
          onClick={() => setActiveItem("blue")}
          onMouseEnter={() => setHoveredItem("blue")}
          onMouseLeave={() => setHoveredItem("")}
        >
          What is BLUE?
        </Link>
        <Link
        to="/viewer/dashboardview"
          style={activeItem === "dashboardview" || hoveredItem === "dashboardview" ? styles.activeLink : styles.link}
          onClick={() => setActiveItem("dashboardview")}
          onMouseEnter={() => setHoveredItem("dashboardview")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Dashboard
        </Link>
        <Link
          to="/viewer/articles"
          style={activeItem === "articles" || hoveredItem === "articles" ? styles.activeLink : styles.link}
          onClick={() => setActiveItem("articles")}
          onMouseEnter={() => setHoveredItem("articles")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Articles
        </Link>
        <Link
          to="/viewer/projects"
          style={activeItem === "projects" || hoveredItem === "projects" ? styles.activeLink : styles.link}
          onClick={() => setActiveItem("projects")}
          onMouseEnter={() => setHoveredItem("projects")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Projects
        </Link>
        <Link
          to="/viewer/aboutus"
          style={activeItem === "aboutus" || hoveredItem === "aboutus" ? styles.activeLink : styles.link}
          onClick={() => setActiveItem("aboutus")}
          onMouseEnter={() => setHoveredItem("aboutus")}
          onMouseLeave={() => setHoveredItem("")}
        >
          About Us
        </Link>
      </nav>
    <button
      style={styles.logout}
      onClick={() => {
      setActiveItem("login");
      navigate("/viewer/LoginPage");
    }}
    >
      Login
    </button>
    </header>
  );
}

const styles = {
  image: {
    width: "100px",
    height: "100px",
    marginBottom: "0px",
    "@media (max-width: 768px)": {
      width: "80px",
      height: "80px",
    },
    "@media (max-width: 480px)": {
      width: "60px",
      height: "60px",
    },
  },
  header: {
    width: "99%",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent dark blue
    backdropFilter: "blur(0px)", // Frosted glass effect
    //backgroundColor: "royalblue",
    color: "white",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "15px",
    },
  },
  nav: {
    display: "flex",
    gap: "15px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "10px",
      width: "100%",
      alignItems: "center",
    },
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    padding: "8px",
    display: "block",
    borderRadius: "5px",
    transition: "background 0.3s",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "6px",
    },
  },
  activeLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    padding: "8px",
    display: "block",
    backgroundColor: "dodgerblue",
    borderRadius: "5px",
    transition: "background 0.3s",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "6px",
    },
  },
  logout: {
    backgroundColor: "#22c55e",
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s",
    padding: "8px",
    borderRadius: "5px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "6px",
    },
  },
  dropdown: {
    position: "relative",
    "@media (max-width: 768px)": {
      width: "100%",
      textAlign: "center",
    },
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
    "@media (max-width: 768px)": {
      position: "static",
      width: "100%",
      textAlign: "center",
    },
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
    "@media (max-width: 768px)": {
      position: "static",
      width: "100%",
      textAlign: "center",
    },
  },
};

export default ViewerHeader;
