import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader"; // Header for admin pages

const AdminLayout = () => {
  return (
    <div>
      <AdminHeader />
      <Outlet /> {/* This renders the nested routes */}
    </div>
  );
};

export default AdminLayout;
