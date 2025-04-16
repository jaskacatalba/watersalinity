// src/layouts/UserLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "../components/UserHeader"; // Import your UserHeader

const UserLayout = () => {
  return (
    <div>
      <UserHeader /> {/* Renders the UserHeader with "Your Wells" */}
      <Outlet />     {/* Renders the nested user routes (like /user/dashboard) */}
    </div>
  );
};

export default UserLayout;
