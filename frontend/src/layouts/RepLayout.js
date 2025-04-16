// src/layouts/RepLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import RepHeader from "../components/RepHeader"; // Import the RepHeader

const RepLayout = () => {
  return (
    <div>
      <RepHeader /> {/* Renders the RepHeader for Barangay Representatives */}
      <Outlet />   {/* Renders the nested routes (e.g., /barangay/dashboard) */}
    </div>
  );
};

export default RepLayout;
